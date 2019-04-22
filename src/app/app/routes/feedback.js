var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var fm = require('../fileMarker.js');

//HTTP Methods

/* GET feedback page. */
router.get('/', function(req, res, next) {
    
    // If template variables exist, DropZone is finished so render page
    // with variables returned from fileMarker.js
    if (req.app.locals.status) {
        res.render('feedback', { 
            title: 'Upload Feedback', 
            file: req.app.locals.fileName, 
            status: req.app.locals.status, 
            passRate:req.app.locals.passRate, 
            contents: req.app.locals.fileContents, 
            output: req.app.locals.output
        });
    }

    //If no variables exist, user is making plain GET request to feedback, therefore redirect to root
    else {
        res.redirect('/');
    }
  

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

    //Get authenticated users name
    var email = req.app.locals.emailAddr
    var user = email.substring(0, email.lastIndexOf('@')); 
    var names = user.split('.');
    var userName = names[0] + names[1];

    //Save to uploads directory
    form.on('fileBegin', function (name, file){
        if (file.name != ""){

            tmpDir = path.join(__dirname, '../uploads/' + userName + '/');
            if(!fs.existsSync(tmpDir)){
                fs.mkdirSync(tmpDir);
            }

            //Set path of file to ../uploads/user/filename
            file.path = tmpDir + file.name;
        }

    });

    //Work with the file
    form.on('file', function (name, file){

        var fileName = file.name;

        if (fileName != ""){

            var uploadTimeout = setInterval(fileExists, 1000);

            //Check if file has been uploaded
            function fileExists() {

                var fileLocation = file.path;

                //Create directory in student data 
                var studentDir = path.join(__dirname, '../studentdata/'); 
                var userSaveDir = studentDir + userName + '/';

                //If file is uploaded, render feedback page and clear timeout
                if (fs.existsSync(fileLocation)) {

                    //Make file executable
                    fs.chmodSync(fileLocation, 777);

                    //Call file marker code and find out whether correct/incorrect
                    fm.checkForMarker(file, userName, function(status, passRate, output){

                        //If file is valid
                        if (status != 'Invalid upload file name'){

                            //Read file to display output
                            var fileContents = fs.readFileSync(fileLocation, function(err){
                                if(err){
                                    throw err;
                                };
                            });

                            //Path to where filed is saved
                            userSavePath = userSaveDir + fileName;

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

                        var fileCopiedRetry = setInterval(fileCopied, 1000);

                        //Wait until file has been copied
                        function fileCopied(){

                            //When file has been copied, delete from uploads
                            if (fs.existsSync(userSavePath)){
    
                                fs.unlinkSync(fileLocation);

                                //Set variables for rendering template
                                req.app.locals.fileName = fileName;
                                req.app.locals.status = status;
                                req.app.locals.passRate = passRate;
                                req.app.locals.fileContents = fileContents;
                                req.app.locals.output = output;
                                
                                clearInterval(fileCopiedRetry);
                                return res.status(200).end('File has been uploaded');
                            };
                        }
                    });

                    clearInterval(uploadTimeout);
                }
            }      
        }  
    });
});

module.exports = router;
