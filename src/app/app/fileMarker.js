var path = require('path');
var fs = require('fs');

//var exports = module.exports{};

function outputFile(file){
	return file.name;
}

function runFile(file){

	//Filename with extension removed - Directory name of file's marker
	var dirName = file.name.split('.').slice(0,-1).join('.');
	console.log(dirName);
	
	//Check for dir matching filename in markers dir
	var markerPath = path.join(__dirname, '/markers/');

	if(fs.existsSync(markerPath + dirName)){
		console.log('Exists');

	}

	else {
		console.log('Marker does not exist')
	}


		//If it does not exist, handle filename errors
		//Wrong filename format etc

		//Else access marker dir
		//Run file
		//Check stdout.txt

}

module.exports = {
	outputFile: outputFile,
	runFile: runFile
};