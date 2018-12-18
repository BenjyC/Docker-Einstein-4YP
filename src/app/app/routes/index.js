var express = require('express');
var formidable = require('formidable');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Docker Einstein upload page' });
});

module.exports = router;
