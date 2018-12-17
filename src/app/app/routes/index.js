var express = require('express');
var formidable = require('formidable');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Docker Einstein upload page' });
});

// Handle uploaded file
router.post('/', function(req,res) {
	var form = new formidable.IncomingForm();
	form.parse(req);

	form.on('fileBegin', function (name,file){
		file.path = __dirname + '/uploads/' + file.name;
	});

	form.on('file', function (name,file){
		console.log('Uploaded ' + file.name);
	});

	return res.status(200).json({});
});

module.exports = router;
