var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Docker Einstein upload page' });
});

/* Handle uploaded file */
router.post('/', function (req, res){
    
    var form = new formidable.IncomingForm();

	form.uploadDir = "../uploads/";
    form.parse(req);

    console.log('hello');

    form.on('fileBegin', function (name, file){
    	saveDir = path.join(__dirname, '../uploads/')
        file.path = saveDir + file.name;
    });

    console.log('helpme');

    form.on('file', function (name, file){
        console.log('Uploaded file', name, file);
    });

    console.log('please');

    return res.status(200).json({});
});


module.exports = router;
