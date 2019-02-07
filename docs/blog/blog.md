# Blog: Docker Einstein

**Ben Coleman**

## Blog Entry 001 - 03/12/2018

To start development, I created a basic NodeJS web application locally. This is what I plan to build
upon in the coming weeks and deploy as part of the Docker image. This is the start of a proposed thin
system that should implement basic functionality before expansion. 

I also added a copy of the original marker script for easy access. This may be implemented into
the web application in the coming weeks, and more than likely rewritten to suit the new system.

## Blog Entry 002 - 04/12/2018

The NodeJS web application now runs and builds with Docker and Docker Compose. Docker Compose is a container
orchestration tool used for managing containers and controlling failsafe deployments. There is now a dockerfile
that creates a docker image, and a docker-compose file for building. I can now begin to build the Einstein upload 
functionality on top of this system.

## Blog Entry 003 - 17/12/2018

Before this commit I had done research and consulted my supervisor on the file upload aspect of Einstein. 
It was decided that the best approach was to use a node module, <i> Formidable </i> to handle file uploads 
on the backend. I done some experimenting between this and the express middleware alternative, <i> express-formidable </i> 
and settled on using the base formidable module with a HTTP form that takes the file uploaded by the user. Formidable then parses 
the file. The application is now ready to be implemented with a marker script that a uploaded file may be passed to. 

![Upload Page](https://gitlab.computing.dcu.ie/colemab5/2019-ca400-colemab5/raw/master/docs/blog/images/UploadScreen1.png)

## Blog Entry 004 - 25/01/2019

I had run into an issue with the file upload of the project. I had previously implemented the upload feature but found that
the file was not actually being saved on the server. I had some time to think on this over Christmas during the exam period, and 
was able to come back and figure out the issue over the last few days. The encoding type of the HTML form for uploading files
was causing issues, and was rectified. After removing the feedback redirect to test this issue, I then came back and added this 
page again now that functionality has been restored. Next I will work on the marker script working alongside this upload system.

## Blog Entry 005 - 03/02/2019

The last week has been spent working on establising a link between the file uploaded in the post request using formidable and a middleware function that
can access and use such file. This should allow me to setup the basic marker script to process a file. However I am having trouble 
gaining access to this file. Any middleware function I try to pass the file to returns 'undefined' or executes before the file has
even been uploaded. Many solutions to this have given the same output. I will continue to investigate this issue.

## Blog Entry 006 - 04/02/2019

Alongside the main file upload and processing functionality, I have also been investigating testing that I can implement within my application.
I decided to use the Mocha test framework with the Chai assertion library to work inside my Express app and allow me to create unit tests as I add 
further functionality.

Currently, the testing is set up correctly within the package.json and looks for any test case found in the test directory. All tests can be executed 
together using 'npm test', however automation of this will be configured. The test cases used during initial setup of this framework were simply checks
that the upload page and feedback page of the application exist. This will be elaborated over the coming weeks into more specific unit tests.

I plan to document any unit tests in the technical manual of this project.

## Blog Entry 007 - 06/02/2019

Over the last few days I have reverted back to my focus on working with uploaded files and figuring out the best approach to do so. I also revisited the 
status and content unit tests I had written and edited the *"it"* block, as all research has indicated the same convention; *"human-readable"* description. 

![Unit Test](https://gitlab.computing.dcu.ie/colemab5/2019-ca400-colemab5/raw/master/docs/blog/images/UnitTest1.png).

As seen above, the tests are now descriptive: *"checks status"* and *"checks content"*

This image also shows the setup of the test directory within the project, and how the package.json is configured to 
run all tests with the directory using just *"npm test"*. There is no need to specify particular test names or patterns, unless
it is required (running only particular test cases).

---

This week, I learned how to include
[images](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#images)
in my blog.

![cat](https://gitlab.computing.dcu.ie/sblott/2018-ca400-XXXX/raw/master/docs/blog/images/cat.jpg)

Here are the instructions:

- Add the image to your repo (probably using the `images` sub-directory here).
  The cat example above is in `./images/cat.jpg`.

- Commit that and push it to your repo.

- On Gitlab, navigate to your new image and click *Raw*.  You get the raw URL of your image.  Copy that URL.

- Add your image to this document using the following format:

    <pre>![alternative text](URL)</pre>

See the example [here](https://gitlab.computing.dcu.ie/sblott/2018-ca400-XXXX/raw/master/docs/blog/blog.md).

You can also mention other users (like me: @sblott).

## Including Code

Raw text:
```
Mary had a little lamb,
it's fleece was white as snow.
```

Syntax highlighting is also possible; for example...

Python:
```python
i = 0
while i < len(s):
   # So something.
   i = i + 1
```

Java:
```java
for (i=0; i<s.length(); i+=1) {
   // Do something.
}
```

Coffeescript:
```coffeescript
i = 0
while i < s.length
   # So something.
   i = i + 1
```

## Instructions

Once you've understood this sample, replace it with your own blog.
