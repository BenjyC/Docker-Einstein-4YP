var path = require('path');
var fs = require('fs');
//const spawn = require('child_process').spawn;
const { execFile } = require('child_process');

//const { exec } = require('child_process');

function outputFile(file){
	console.log(file.path);
}

function checkForMarker(file){

	//Filename with extension removed - Directory name of file's marker
	var dirName = file.name.split('.').slice(0,-1).join('.');

	console.log('Marker directory to be checked: ' + dirName);
	
	//Check for dir matching filename in markers dir
	var markersPath = path.join(__dirname, '/markers/');

	//Find specific marker
	var markerDir = markersPath + dirName;

	//Grab the expected stdout
	var sampleOutput = markerDir + '/stdout.txt';

	//Check if marker exists before continuing
	if(fs.existsSync(markerDir)){
		//console.log('Marker exists');

		//Grab marker stdout.txt
		var markerOut = fs.readFileSync(sampleOutput, function(err){
			if (err){
				throw err;
			};
		});

		//Run the file and grab the output
		executeFile(file.name, function(fileOut) {

			console.log('FILE OUTPUT ' + fileOut);
			console.log('MARKER OUTPUT ' + markerOut);
	
			//Compare output with sample stdout
			if (markerOut == fileOut){
				console.log('Correct');
			}

			else {
				console.log('Incorrect');
			}
		});
	}

	else {
		console.log('Marker does not exist')
		//TODO Return incorrect filename page render
	}
	
}

function executeFile(filename, callback){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/' + filename);

	//Get file extension
	var fileExt = filename.split('.').pop();
	
	//If Python file
	if (fileExt == 'py') {

		const child = execFile('python', [uploadPath], (err,stdout,stderr) => {
			if (err) {
				throw err;
			}

			callback(stdout);
		});
	}

	//If shell script
	//if (fileExt == 'sh'){}

}

module.exports = {
	outputFile: outputFile,
	checkForMarker: checkForMarker,
	executeFile: executeFile
};