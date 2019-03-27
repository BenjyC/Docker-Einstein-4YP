var path = require('path');
var fs = require('fs');
const { execFile } = require('child_process');
const { exec } = require('child_process');
const { promisify } = require('util');

//Marker directory
var markersPath = path.join(__dirname, '/markers/');

//Reading directories function
const readdir = promisify(fs.readdir);

async function checkForMarker(file, checkForMarkerCb){
	
	//Find specific marker
	var markerDir = markersPath + file.name;

	//Check if marker exists before continuing
	if(fs.existsSync(markerDir)){

		let files;
		try {
			
			{err, files} = await readdir(markerDir);
			if (err) {
				console.log(err);
			}

		} catch (e) {
			console.log("Exception: " + e);
		}

		if (files != undefined) {

			var resultsArr = await getArray(file, files.length, markerDir);

			if (resultsArr){
				for(var i=0;i<resultsArr.length;i++) {

					if (resultsArr[i] == "incorrect"){
						checkForMarkerCb('incorrect');
						break;
					}

					else if (i+1 == resultsArr.length) {
						checkForMarkerCb('correct');
					}
				}
			}
		}		
	}

	else {
		checkForMarkerCb('invalid');
	}	


};

async function getArray(file, fileLength, markerDir) {

	return await getResults(file, fileLength, markerDir);
}


function executeFile(filename, execFileCb){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/');

	//Find specific marker
	var markerDir = markersPath + filename;

	//Get file extension
	var fileExt = filename.split('.').pop();

	//If Python file
	if (fileExt == 'py') {

		//Specific path to file
		var pyUpload = uploadPath + filename;

		const child = execFile('python', [pyUpload], (err,stdout,stderr) => {
			if (err) {
				throw err;
			}

			execFileCb(stdout);
		});
	}

	//If Shell script
	if (fileExt == 'sh'){

		//Shell execution
		var shFile = './' + filename;

		const child = exec(shFile, {cwd: uploadPath}, (err,stdout,stderr) => {
			if (err) {
				throw err;
			}

			execFileCb(stdout);
		});
	}

}


async function getResults(file, fileLength, markerDir) {

	resultsArr = [];

	var count = 0
	for(var i=1; i<=fileLength; i++) {
		var sampleOut = markerDir + '/test' + i + '/stdout.txt';

		count++

		console.log('test' + i);

		//Grab marker stdout.txt
		var markerOut = fs.readFileSync(sampleOut, function(err){
			if (err){
				throw err;
			};
		});

		//Run the file and grab the output
		executeFile(file.name, function(fileOut){

			//Compare output with sample stdout
			if (markerOut == fileOut){
				resultsArr.push('correct');
			}

			else {
				resultsArr.push('incorrect');
			}
		});
	}

	if (resultsArr.length == fileLength) {
		console.log(resultsArr);
		return resultsArr;
	}
}

module.exports = {
	checkForMarker: checkForMarker,
	executeFile: executeFile,
	getResults: getResults
};