var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var fm = require('../fileMarker.js');

//HTTP Methods

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'No file provided' });
  //redirect to no file provided*

});

// Handle uploaded file
router.post('/', function(req, res, next) {
	
	var form = new formidable.IncomingForm();

	form.uploadDir = "../uploads/";
    form.parse(req, function(err, fields, files){
    	if (err) return res.end('Error encountered');
    });

    form.on('fileBegin', function (name, file){
    	saveDir = path.join(__dirname, '../uploads/')
        file.path = saveDir + file.name;
    });

    form.on('file', function (name, file){
        //console.log('Uploaded file', file);
        fm.runFile(file);

        var fileName = file.name;

        var uploadTimeout = setInterval(fileExists, 200);

        //Check if file has been uploaded
        function fileExists() {
            var filePath = path.join(__dirname, '../uploads/')

            //If file is uploaded, render feedback page and clear timeout
            if (fs.existsSync(filePath + fileName)) {
                res.render('feedback', { title: 'Upload feedback page', file: fileName });
                clearInterval(uploadTimeout);

            }
        }      
    });

});

module.exports = router;
