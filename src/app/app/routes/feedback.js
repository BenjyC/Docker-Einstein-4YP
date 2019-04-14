var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var fm = require('../fileMarker.js');

//HTTP Methods

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Docker Einstein Upload Page' });
  //res.render('feedback', { title: 'No file provided' });

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
            tmpDir = path.join(__dirname, '../uploads/');
            file.path = tmpDir + file.name;
        }

    });

    //Work with the file
    form.on('file', function (name, file){

        var fileName = file.name;

        var filePath = path.join(__dirname, '../uploads/');

        if (fileName != ""){
            var uploadTimeout = setInterval(fileExists, 1000);

            //Check if file has been uploaded
            function fileExists() {
    
                var filePath = path.join(__dirname, '../uploads/')
                var fileLocation = filePath + fileName

                //Get authenticated users name
                var email = req.app.locals.emailAddr
                var user = email.substring(0, email.lastIndexOf('@')); 
                var names = user.split('.');

                //Create directory in student data 
                var studentDir = path.join(__dirname, '../studentdata/'); 
                var userSaveDir = studentDir + names[0] + names[1];

                //If file is uploaded, render feedback page and clear timeout
                if (fs.existsSync(fileLocation)) {

                    //Call file marker code and find out whether correct/incorrect
                    fm.checkForMarker(file, function(status, passRate){

                        //If file is valid
                        if (status != "invalid"){

                            //Read file to display output
                            var fileContents = fs.readFileSync(fileLocation, function(err){
                                if(err){
                                    throw err;
                                };
                            });

                            //Path to where filed is saved
                            userSavePath = userSaveDir + '/' + fileName;

                            //Check if user directory exists, create if not
                            if (!fs.existsSync(userSaveDir)){  
                                fs.mkdirSync(userSaveDir);    
                            }

                            //Copy file to user specific storage    
                            fs.copyFile(fileLocation, userSavePath, function(err){
                                if (err) {
                                   throw err;
                                }
                            });
                        }
                        
                        if (status == 'correct') {
                            res.render('feedback', { title: 'Upload Feedback', file: fileName, status: 'Correct', passRate:passRate, contents: fileContents});
                        }

                        else if (status == 'incorrect') {
                            res.render('feedback', { title: 'Upload Feedback', file: fileName, status: 'Incorrect', passRate:passRate, contents: fileContents});
                        }

                        else {
                            res.render('feedback', { title: 'Upload Feedback', file: fileName, status: 'Invalid upload file name'});
                        }

                    clearInterval(uploadTimeout);

                    });
                }
            }      
        }   
    });
});

module.exports = router;
