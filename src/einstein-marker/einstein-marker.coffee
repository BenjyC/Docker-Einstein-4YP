#!/usr/bin/env coffee
# vim: ft=coffee sw=2 ts=2 sts=2 tw=110 wildignore+=*.js

`#!/usr/bin/env node
`

fs = require "fs-extra"
child_process = require "child_process"
glob = require "glob"

moduleRE = /^(ca|be)\d+$/
default_timeout = "3"
staff = "sblott hamilton grahamy ygraham dobrien jfoster".split /\s+/

# These modules are rate limited.
rateLimitedModules = ["ca116", "ca117", "ca177", "ca277"]

# Stderr will always be shown in the report for modules listed here.
showStderrModules = ["ca320", "be115", "ca000"]

fail = (args...) ->
  message = [ "error: #{process.argv[1].split("/").reverse()[0]}", args...]
  console.error message.join " "
  process.exit 1

extend = (hash1, hash2) ->
  hash1[key] = hash2[key] for own key of hash2
  hash1

# class AsyncDataFetcher
#   constructor: (fetch) ->
#     @data = null
#     @queue = []
#     fetch (@data) =>
#       callback @data for callback in @queue
#       @queue = null
#
#   use: (callback) ->
#     if @data? then callback @data else @queue.push callback
#
# class JobRunner
#   constructor: (@jobs) ->
#     @fetcher = new AsyncDataFetcher (callback) =>
#       for job in @jobs
#         do (job) =>
#           job =>
#             @jobs = @jobs.filter (j) -> j != job
#             callback true if @jobs.length == 0
#
#   onReady: (callback) ->
#     @fetcher.use callback

handlers = []
use = (handler) -> handlers.push handler

# Get the arguments.
use (req, res, next) ->
  req.args = process.argv[2..]
  next()

# Get the module, if it's provided.
use (req, res, next) ->
  if 0 < req.args.length and moduleRE.test req.args[0]
    res.module = req.module = req.args[0]
    req.args = req.args[1..]
  else if process.env.MODULE and moduleRE.test process.env.MODULE
    res.module = req.module = process.env.MODULE
  next()

# Get the client IP address, if any.
use (req, res, next) ->
  # This matches dot-quad IP addresses.
  ipRE = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if 0 < req.args.length and ipRE.test req.args[0]
    res.client_ip_address = req.client_ip_address = req.args[0]
    req.args = req.args[1..]
  next()

# Verify the filename.
use (req, res, next) ->
  if req.args.length != 1
    fail "requires exactly one argument, a file name"
  else
    req.filename = req.args[0]
    fs.stat req.filename, (err, stat) ->
     if err then fail "file does not exist: #{req.filename}"
     else
      if not stat.isFile() then fail "is not a regular file: #{req.filename}"
      else
        fs.realpath req.filename, (err, path) ->
          req.filename = path
          next()

# Work out the module, if necessary.
use (req, res, next) ->
  if req.module then next()
  else
    req.module = res.module = do ->
      for candidate in req.filename.split("/").reverse()
        return candidate if moduleRE.test candidate
      null

    if req.module then next()
    else
      # Hardwire these.
      req.module = res.module = switch process.env.USER
        when "dobrien" then "ca117"
        when "jfoster" then "ca278"
        when "hamilton" then "ca320"
        when "grahamy" then "ca320"
        when "ygraham" then "ca320"
        else null
      if req.module then next()
      else fail "failed to detect module"

# Work out the user.
use (req, res, next) ->
  candidate = req.filename.split("/").reverse()[1]
  child_process.exec "/usr/local/bin/dcu-email-address #{candidate}", (err, stdout, stderr) ->
    req.user = res.user = if err or stdout.toString().trim().length == 0 then process.env.USER else candidate
    next()

# Work out the task name.
use (req, res, next) ->
  req.task = res.task = req.filename.split("/").reverse()[0]
  next()

reportError = (req, res, message, callback) ->
  if process.env.USER == "einstein"
    process.chdir require("path").dirname req.filename
    fs.writeFile ".most-recent-report.json", (JSON.stringify extend res, errorMessage: message.trim()), callback
  else
    callback()

use (req, res, next) ->
  isBinaryFile = require "isbinaryfile"

  isBinaryFile req.filename, (err, isBinary) ->
    if err or isBinary
      message = "Rejecting upload: #{req.task} is a binary file."
      reportError req, res, message, ->
        fail "rejecting upload: #{req.task} is a binary file"
    else
      next()

# Find the marker directory.
use (req, res, next) ->
  directory = "*"
  directory = "blott" if req.module == "ca000"
  glob "/home/#{directory}/markers/#{req.module}/#{req.task}", {}, (err, dirs = []) ->
    dirs = dirs.filter (d) -> -1 == d.indexOf "/rsnapshot/"
    if dirs.length == 1
      req.marker = dirs[0]
      next()
    else
      message = """
        There is no marker for a task named "<code>#{req.task}</code>".
        <br /> <br />
        In most cases, this means that <i>you have not used exactly the file name which you
        were instructed to use</i>.
        Check the file name carefully and rename your file, if necessary.
        <br /> <br />
        One common mistake is to use a "<code>1</code>" (one) instead of an "<code>l</code>" (el), or vice versa.
        """
      reportError req, res, message, ->
        fail "could not find marker directory for #{req.task} for #{req.module}"

# Change directory.
use (req, res, next) ->
  ok = null
  try
    process.chdir req.marker
    ok = true
  if ok then next()
  else
    fail "failed to change directory to #{req.marker} #{JSON.stringify req}"

# Add the upload itself to the result.
# NOTE(smblott) This value is used below if a preamble.txt is included.
use (req, res, next) ->
  fs.readFile req.filename, (err, data) ->
    if err then fail "failed to read file: #{req.filename}"
    else
      extend res, upload: data.toString()
      next()

# Read the root preamble, if any.  A preamble in the root test directory applies to all test directories (but
# would be overridden by preambles in those directories.
use (req, res, next) ->
  fs.readFile "./preamble.txt", (err, data) ->
    req.preamble = null
    req.preamble = data.toString() unless err
    next()

# Similarly for "postamble.txt".
use (req, res, next) ->
  fs.readFile "./postamble.txt", (err, data) ->
    req.postamble = null
    req.postamble = data.toString() unless err
    next()

# Get test directories.
use (req, res, next) ->
  glob "./*", {mark: true}, (err, fs1) ->
    glob "./../module-wide/*", {mark: true}, (err, fs2) ->
      tests = [ fs1..., fs2... ].filter (d) -> d[d.length - 1] == "/"
      req.tests = [".", tests...]
      req.noPreamble = fs2
      next()

runTest = do ->
  tmp = require "tmp"
  tmp.setGracefulCleanup()

  (req, res, test, setter) ->
    cwd = process.cwd()
    process.chdir test

    # To create the home directory, we nest one temporary directory inside another.  This allows us to set
    # execute-only permissions on the outer temporary directory, which makes it almost impossible (probably)
    # for one student to view another student's uploads.  They would have to guess the inner temporary
    # directory name.

    dir = tmp.dirSync template: "/var/jail/einstein/tmp/einstein-upload-XXXXXX"
    parentDirName = dir.name

    dir = tmp.dirSync template: "#{parentDirName}/home-XXXXXX"
    dirName = dir.name

    fs.chmodSync dirName, 0o0777
    fs.chmodSync parentDirName, 0o0111

    # glob "*", (err, files) ->
    fs.readdir ".", (err, files) ->
      runner = req.task
      argv = []
      stdin = null
      result = {suppressIO: false, showStderr: false}
      timeout = default_timeout
      preamble = postamble = ""
      preamble = req.preamble unless test in req.noPreamble
      postamble = req.postamble unless test in req.noPreamble

      for file in files
        try stat = fs.statSync file
        continue unless stat?.isFile()

        try fs.accessSync file, fs.constants.R_OK
        catch
          continue

        runner = file if file in ["runner.py", "runner.pl", "runner.hs", "runner.sh", "runner.zsh"]
        # res.showIO ||= file == "show-io.txt" and test == "."

        if file in [req.task, "stdout.txt", "show-io.txt"]
          continue
        else if file == "suppress-io.txt"
          extend result, suppressIO: true
        else if file == "show-stderr.txt"
          extend result, showStderr: true
        else if file == "ignore-stdout.txt"
          extend result, ignoreStdout: true
        else if file == "ignore-stderr.txt"
          extend result, ignoreStderr: true
        else if file == "stdin.txt"
          stdin = file
        else if file == "argv.txt"
          argText = fs.readFileSync(file).toString().trim()
          argv = argText.split "\n" if argText
        else if file == "timeout.txt"
          try timeout = parseInt fs.readFileSync(file).toString()
        else if file == "preamble.txt"
          preamble = fs.readFileSync(file).toString()
        else if file == "postamble.txt"
          postamble = fs.readFileSync(file).toString()
        else
          fs.copySync file, "#{dirName}/#{file}"

      extension = runner.split(".").reverse()[0]
      command =
        if extension == "py" and req.module in ["ca117", "ca247"]
          res.language ?= "python3"
          [ "python3" ]
        else if extension == "py"
          res.language ?= "python2"
          [ "python" ]
        else if extension == "sh"
          res.language ?= "bourne shell"
          [ "sh" ]
        else if extension == "zsh"
          res.language ?= "zsh"
          [ "zsh" ]
        else if extension == "pl" and true # This may need to be tweaked for specific modules (pl is perl and prolog!).
          res.language ?= "perl"
          [ "perl" ]
        else if extension == "pl"
          res.language ?= "prolog"
          "swipl -q -t main -f".split " "
        else if extension == "hs"
          res.language ?= "haskell"
          [ "runghc" ]
        else
          fail "invalid extension: #{extension}"

      stdin ?= "/dev/null"
      stdinStream = fs.createReadStream stdin
      fs.readFile stdin, (err, stdin) ->
         prefix = ["/usr/bin/time", "--quiet", "-f", "## %M", "timeout", timeout]
         args = [prefix..., command..., "./#{runner}", argv...]

         # Prepend preamble or postpend postamble, if any.
         preamble ||= ""
         postamble ||= ""
         preamble += "\n" if preamble
         postamble = "\n" + postamble if postamble
         fs.writeFileSync "#{dirName}/#{req.task}", preamble + res.upload + postamble

         # Spawn test.
         child = child_process.spawn "/usr/local/bin/run-as-student", args,
           cwd: dirName
           env: HOME: dirName, TASK: req.task, MODULE: req.module, EINSTEIN_USER: req.user, EXTRA_FD: 3
           stdio: ['pipe', 'pipe', 'pipe', 'pipe']

         stdinStream.pipe child.stdin
         # We need to handle this, otherwise we get an error if the script fails to read all of a very-long
         # input.
         child.stdin.on "error", ->

         stdout = ""
         stderr = ""
         extra = ""
         child.stdout.on "data", (data) -> stdout = stdout + data.toString()
         child.stderr.on "data", (data) -> stderr = stderr + data.toString()
         child.stdio[3].on "data", (data) -> extra = extra + data.toString()

         start = new Date()
         child.on "exit", mkReport = (code, signal) ->
           end = new Date()

           memory = 0
           stderr = stderr.split("\n").filter (line) ->
             unless 0 == line.indexOf "## " then true
             else
               memory = line.split(" ")[1]
               false
           stderr = stderr.join "\n"

           fs.remove dirName
           fs.readFile "stdout.txt", (err, expected) ->
             expected = if err then "" else expected.toString()
             extra = null if extra.length == 0
             correct = (code == 0) and (result.ignoreStdout or stdout == expected) and (result.ignoreStderr or stderr.length == 0)
             fs.readFile "stdin.txt", (err, stdin) ->
               stdin = if err then "" else stdin.toString()
               process.chdir cwd
               setter extend result,
                 test: if test == "." then "test0" else test
                 command: command
                 argv: argv
                 error: code
                 stdin: stdin[...8192]
                 stdout: stdout[...8192]
                 stderr: stderr[...8192]
                 extra: extra
                 expected: expected[...8192]
                 correct: correct
                 runtime: end - start
                 memory: memory
                 timeout: timeout

         child.on "error", (error) ->
           stderr = (stderr + "\n\n" + error.toString()).trim()
           # ??
           mkReport 75

# Run tests.
use (req, res, next) ->
  # res.showIO = false
  tests = req.tests[..].reverse()
  res.results = results = []

  do runTests = ->
    if tests.length == 0 then next()
    else
      runTest req, res, tests.pop(), (result) ->
        results.push result
        runTests()

# Collate overall result.
use (req, res, next) ->
  total = res.results.length
  correct = (result for result in res.results when result.correct).length
  extend res,
    correct: correct == total
    failed: total - correct
    passed: correct
  next()

# Rate limiter.
use (req, res, next) ->
  res.rateLimited = false
  if res.correct
    # Do not rate limit correct uploads.
    next()
  else unless req.module in rateLimitedModules
    # Add modules to this list to enable the rate limiter.
    next()
  # else if req.user in staff
  #   # The rate limiter never applies to staff.
  #   next()
  else
    child_process.exec "/usr/local/bin/rate-limit #{req.module} #{req.user} #{req.task}", [], (err, stdout, stderr) ->
      res.rateLimited = true if err
      next()

use (req, res, next) ->
  hideStderrEnabled = req.module not in showStderrModules
  for test in res.results
    test.hideStderr = hideStderrEnabled and not test.showStderr
    delete test.showStderr
  next()

do ->
  einsteinUsers = "einstein blott".trim().split /\s+/
  einsteinUsers = "einstein".trim().split /\s+/

  # Handle output for einstein.
  use (req, res, next) ->
    if process.env.USER not in einsteinUsers then next()
    else
      unless 0 == req.filename.indexOf "/home/blott/einstein-data/uploads/"
        next()
      else
        correctFile = "#{res.task}.correct"
        incorrectFile = "#{res.task}.incorrect"
        [writeFile, unlinkFile] =
          if res.correct then [correctFile, incorrectFile] else [incorrectFile, correctFile]

        cwd = process.cwd()
        process.chdir require("path").dirname req.filename

        # We have to nest all of these so that we do not change directory until they're all done.
        child_process.exec "date -r \"#{req.filename}\" +\"%Y-%m-%d-%H:%M:%S\"", [], (err, stdout) ->
          date = stdout.trim()
          extend res, version: 1, timeout: default_timeout, date: date, extension: res.task.split(".").reverse()[0]
          extend res, ip: req.client_ip_address ? "unknown"
          glob ".#{res.task}.report.*.json", (err, files) ->
            # For hack, disable the following two lines.
            fs.writeFile writeFile, "#{files.length + 1}", ->
              fs.unlink unlinkFile, ->
                json = JSON.stringify res, null, 2
                # For hack, keep this line.
                fs.writeFile ".most-recent-report.json", json, ->
                  # For hack, disable the following two lines.
                  fs.writeFile ".#{res.task}.#{date}", res.upload, ->
                    fs.writeFile ".#{res.task}.report.#{date}.json", json, ->
                      # For hack, keep this line.
                      fs.writeFile ".#{res.task}.report.json", json, ->
                        process.chdir cwd
                        next()
                if res.user in "sblott hamilton grahamy ygraham dobrien jfoster".split /\s+/
                  console.log json.split("\n").map((x) -> "#json #{x}").join "\n" # "#test-report-json #{encodeURIComponent json}"

  # Handle output for non-einstein users.
  use (req, res, next) ->
    if false and process.env.USER in einsteinUsers then next()
    else
      correct = if res.correct then "correct" else "incorrect"
      for result in res.results
        passed = if result.correct then "passed" else "failed"
        console.log "#test-report #{res.module} #{res.user} #{res.task} #{result.test} #{passed}"
      console.log "#test-report-overall #{res.module} #{res.user} #{res.task} #{correct} passed #{res.results.length - res.failed} of #{res.results.length}"
      for report in res.results
        if report.extra? and report.extra and 0 < report.extra.trim().length
          console.log "#extra #{res.module} #{res.user} #{report.test} #{line}" for line in report.extra.trim().split "\n"
      next()

use (req, res, next) ->
  process.exit if res.correct then 0 else 1

do ->
  handlers = handlers.reverse()
  req = {}
  res = {}

  do middleware = ->
    if 0 < handlers.length
      handlers.pop() req, res, -> middleware()

