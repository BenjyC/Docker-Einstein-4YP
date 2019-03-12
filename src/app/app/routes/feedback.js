var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var fm = require('../fileMarker.js');
var noFile = false;

//HTTP Methods

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'No file provided' });
  //redirect to no file provided*

});

// Handle uploaded file
router.post('/', function(req, res, next) {

	var form = new formidable.IncomingForm();

    //Parse the uploaded form
    form.parse(req, function(err, fields, files){
    	if (err) return res.end('Error encountered');

        //If file is empty, render page
        if (files.upload.name == "") {
            res.render('feedback', { title: 'Upload feedback page', file: "No file supplied", status: 'N/A'});
        }

    });

    //Save to uploads directory
    form.on('fileBegin', function (name, file){
        if (file.name != ""){
            saveDir = path.join(__dirname, '../uploads/')
            file.path = saveDir + file.name;
        }
    });

    //Work with the file
    form.on('file', function (name, file){

        var fileName = file.name;

        if (fileName != ""){
            var uploadTimeout = setInterval(fileExists, 200);

            //Check if file has been uploaded
            function fileExists() {
                var filePath = path.join(__dirname, '../uploads/')

                //If file is uploaded, render feedback page and clear timeout
                if (fs.existsSync(filePath + fileName)) {
                
                    //Call file marker code and find out whether correct/incorrect
                    fm.checkForMarker(file, function(status){
                        if (status == 'correct') {
                            res.render('feedback', { title: 'Upload feedback page', file: fileName, status: 'Correct'});
                        }

                        else if (status == 'incorrect') {
                            res.render('feedback', { title: 'Upload feedback page', file: fileName, status: 'Incorrect'});
                        }

                        else {
                            res.render('feedback', { title: 'Upload feedback page', file: fileName, status: 'Invalid upload file name'});
                        }

                    clearInterval(uploadTimeout);

                    });
                }
            }      
        }   
    });
    
});

module.exports = router;
