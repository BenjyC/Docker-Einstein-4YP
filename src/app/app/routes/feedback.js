var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();
var mw = require('../fileGrab.js');

// Middleware
router.use(function(req, res, next) {
	console.log('@@@@@@@@@@@@' + res.locals.name);
	next();
});

//HTTP Methods

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'Upload feedback page' });

});

// Handle uploaded file
router.post('/', function(req, res, next) {
	
	var form = new formidable.IncomingForm();

	form.uploadDir = "../uploads/";
    form.parse(req, function(err, fields, files){
    	if (err) return res.end('Error encountered');
    	res.locals.name = files.upload.name;
    });

    form.on('fileBegin', function (name, file){
    	saveDir = path.join(__dirname, '../uploads/')
        file.path = saveDir + file.name;
    });

    form.on('file', function (name, file){
        //console.log('Uploaded file', file);
        res.locals.name = file.name;
    });

    res.render('feedback', {title: 'Upload feedback page'});
});

module.exports = router;
