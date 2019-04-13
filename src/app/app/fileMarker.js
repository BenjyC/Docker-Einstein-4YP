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

async function checkForMarker(file, checkForMarkerCb){
	
	//Find specific marker
	var markerDir = markersPath + file.name;

	//Check if marker exists before continuing
	if(fs.existsSync(markerDir)){

		var files = await readdirAsync(markerDir);

		if (typeof files != undefined) {

			var resultsArr = await getResults(file.name, files.length, markerDir);

			if (resultsArr){
				var pass = 0;
				for(var i=0;i<resultsArr.length;i++) {

					if (resultsArr[i] == "correct"){
						pass += 1;
					}
				}

				var passRate = pass + '/' + files.length;

				if (pass == resultsArr.length){
					checkForMarkerCb('correct', passRate);
				}

				else {
					checkForMarkerCb('incorrect', passRate);
				}
					
			}
		}		
	}

	else {
		checkForMarkerCb('invalid');
	}	
};

function executeFile(filename){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/');

	//Find specific marker
	var markerDir = markersPath + filename;

	//Get file extension
	var fileExt = filename.split('.').pop();

	return new Promise(function(resolve,reject){

		//If Python file
		if (fileExt == 'py') {

			//Specific path to file
			var pyUpload = uploadPath + filename;

			const child = execFile('python', [pyUpload], (err,stdout,stderr) => {
				if (err) reject (err);

				else resolve(stdout);
			});	
		}

		//If shell script
		else if (fileExt == 'sh'){

			//Shell execution
			var shFile = './' + filename;

			const child = exec(shFile, {cwd: uploadPath}, (err,stdout,stderr) => {
				if (err) reject (err)
				
				else resolve(stdout);
			});
		}
	});
}


async function getResults(filename, fileLength, markerDir) {

	resultsArr = [];

	for(var i=1; i<=fileLength; i++) {
		var sampleOut = markerDir + '/test' + i + '/stdout.txt';

		//Grab marker stdout.txt
		var markerOut = fs.readFileSync(sampleOut, 'utf-8', function(err){
			if (err){
				throw err;
			};
		});

		//Run the file and wait for the output
		var fileOut = await executeFile(filename);
			
		if (markerOut == fileOut){
			resultsArr.push('correct');
		}

		else {
			resultsArr.push('incorrect');
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