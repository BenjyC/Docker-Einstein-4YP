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
	console.log('Marker Directory: ' + dirName);
	
	//Check for dir matching filename in markers dir
	var markerPath = path.join(__dirname, '/markers/');
	var uploadPath = markerPath + file.name;

	if(fs.existsSync(markerPath + dirName)){
		console.log('Marker exists');
		executeFile(file.name);

	}

	else {
		console.log('Marker does not exist')
		//TODO Return incorrect filename page render
	}

		//Else access marker dir
		//Run file
		//Check stdout.txt

}

function executeFile(filename){

	//Get path to uploaded file
	var uploadPath = path.join(__dirname, '/uploads/' + filename);

	const child = execFile('python', [uploadPath], (err,stdout,stderr) => {
		if (err) {
			throw err;
		}

		console.log(stdout);
	});

}

module.exports = {
	outputFile: outputFile,
	checkForMarker: checkForMarker,
	executeFile: executeFile
};