var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.app.locals.emailAddr){
  	res.render('index', { title: 'Upload Page', user: req.app.locals.emailAddr });
  }
  else {
  	res.redirect('/auth/login');
  }
});

module.exports = router;
