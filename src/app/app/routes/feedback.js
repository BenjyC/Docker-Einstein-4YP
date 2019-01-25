var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();
var upFile = {};

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'Upload feedback page' });
});

// Handle uploaded file
router.post('/', function (req, res) {
	
	var form = new formidable.IncomingForm();

	form.uploadDir = "../uploads/";
    form.parse(req);

    form.on('fileBegin', function (name, file){
    	saveDir = path.join(__dirname, '../uploads/')
        file.path = saveDir + file.name;
    });

    form.on('file', function (name, file){
    	upFile = file;
        console.log('Uploaded file', name, file);
    });

    return res.render('feedback', {title: 'Upload feedback page'});	

})

module.exports = router;
