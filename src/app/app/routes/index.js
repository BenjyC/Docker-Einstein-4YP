var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Docker Einstein Upload Page' });
});

module.exports = router;
