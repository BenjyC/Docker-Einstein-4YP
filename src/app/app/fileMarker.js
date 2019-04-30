var path = require('path');
var fs = require('fs');
const { execFile } = require('child_process');
const { exec } = require('child_process');
const { promisify } = require('util');

//Marker directory
var markersPath = path.join(__dirname, '/markers/');

//Reading directories function
const readdir = promisify(fs.readdir);

function readdirAsync(path) {
  return new Promise(function (resolve, reject) {
    fs.readdir(path, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

async function checkForMarker(file, user, checkForMarkerCb){
	
	//Find specific marker
	var markerDir = markersPath + file.name;

	//Check if marker exists before continuing
	if(fs.existsSync(markerDir)){

		var files = await readdirAsync(markerDir);

		if (typeof files != undefined) {

			//Get results array which uses format [Status, ActualFileOutput, ExpectedFileOutput] per execution
			//Full results array will contain several of the triplets above
			var resultsArr = await getResults(file.name, files.length, markerDir, user);

			if (resultsArr){

				var pass = 0;
				for(var i=0;i<resultsArr.length;i++) {

					//Check status
					if (resultsArr[i][0] == "Correct"){
						pass += 1;
					}
				}

				var passRate = pass + '/' + files.length;

				if (pass == resultsArr.length){
					checkForMarkerCb('Correct', passRate, resultsArr);
				}

				else {
					checkForMarkerCb('Incorrect', passRate, resultsArr);
				}
					
			}
		}		
	}

	else {
		checkForMarkerCb('Invalid upload file name');
	}	
};

function executeFile(filename, stdin = "", user){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/');
	var userUpload = uploadPath + user;

	//Get file extension
	var fileExt = filename.split('.').pop();

	//Path to specific file
	var fileUpload = userUpload + '/' + filename;

	return new Promise(function(resolve,reject){

		//If Python file
		if (fileExt == 'py'){
			
			//Run test with input
			if (stdin != ""){
				const child = execFile('python', [fileUpload, stdin], (err,stdout,stderr) => {
					if (err) reject (err);

					else resolve(stdout);
				});
			}

			//Run test without input
			else{
				const child = execFile('python', [fileUpload], (err,stdout,stderr) => {
					if (err) reject (err);

					else resolve(stdout);
				});
			}
					
		}

		//If shell script
		else if (fileExt == 'sh'){

			//Shell execution
			var shFile = './' + filename;

			const child = exec(shFile, {cwd: userUpload}, (err,stdout,stderr) => {
				if (err) reject (err)
				
				else resolve(stdout);
			});
		}

	}).catch((error) => {
		console.log(error, 'Promise Error');
	});
}


async function getResults(filename, fileLength, markerDir, user) {

	resultsArr = [];
	outputsArr = []; 

	for(var i=1; i<=fileLength; i++) {
		var sampleOut = markerDir + '/test' + i + '/stdout.txt';
		var sampleIn = markerDir + '/test' + i + '/stdin.txt';

		//Grab marker stdout.txt
		var markerOut = fs.readFileSync(sampleOut, 'utf-8', function(err){
			if (err){
				throw err;
			};
		});

		var stdin = "";
		//Check if test case has stdin
		if (fs.existsSync(sampleIn)) {
			stdin = sampleIn;
		}

		//Run the file and wait for the output
		var fileOut = await executeFile(filename,stdin,user);

		if (markerOut == fileOut){
			resultsArr.push(['Correct', fileOut, markerOut]);
		}

		else {
			resultsArr.push(['Incorrect', fileOut, markerOut]);
		}
		
	}

	if (resultsArr.length == fileLength) {
		return resultsArr;
	}
}

module.exports = {
	checkForMarker: checkForMarker,
	executeFile: executeFile,
	getResults: getResults
};