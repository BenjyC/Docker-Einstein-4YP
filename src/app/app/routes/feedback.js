var express = require('express');
var formidable = require('formidable');
var router = express.Router();

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'Upload feedback page' });
});

// Handle uploaded file
router.post('/', function(req,res) {
	
	var form = new formidable.IncomingForm();
	form.uploadDir = "./uploads";
	form.keepExtensions = true;
	form.parse(req);

	form.on('fileBegin', function (name,file){
		file.path = __dirname + '/uploads/' + file.name;
	});

	form.on('file', function (name,file){
		console.log('Uploaded ' + file.name);
	});

	return res.render('feedback', { title: 'Upload feedback page' });
});

module.exports = router;
