var path = require('path');
var fs = require('fs');
const { execFile } = require('child_process');
const { exec } = require('child_process');

function outputFile(file){
	console.log(file.path);
}

function checkForMarker(file, callback){

	//Filename with extension removed - Directory name of file's marker
	var dirName = file.name.split('.').slice(0,-1).join('.');
	
	//Check for dir matching filename in markers dir
	var markersPath = path.join(__dirname, '/markers/');

	//Find specific marker
	var markerDir = markersPath + dirName;

	//Grab the expected stdout
	var sampleOutput = markerDir + '/stdout.txt';

	//Check if marker exists before continuing
	if(fs.existsSync(markerDir)){

		//Grab marker stdout.txt
		var markerOut = fs.readFileSync(sampleOutput, function(err){
			if (err){
				throw err;
			};
		});

		//Run the file and grab the output
		executeFile(file.name, function(fileOut) {

			//console.log('FILE OUTPUT ' + fileOut);
			//console.log('MARKER OUTPUT ' + markerOut);
	
			//Compare output with sample stdout
			if (markerOut == fileOut){
				callback('correct');
			}

			else {
				callback('incorrect');
			}
		});
	}

	else {
		callback('invalid');
	}
};

function executeFile(filename, callback){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/');

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

			callback(stdout);
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

			callback(stdout);
		});
	}

}

module.exports = {
	outputFile: outputFile,
	checkForMarker: checkForMarker,
	executeFile: executeFile
};