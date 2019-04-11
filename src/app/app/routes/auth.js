var express = require('express');
var router = express.Router();

const passport = require('passport');

/* GET users listing. */
router.get('/login', (req,res,next) => {
	res.render('login');
});

//Authentication logout
router.get('/logout', (req,res,next) => {
	res.send('logging out');
});

//Authentication with Google
router.get('/google', passport.authenticate('google', {
	scope: ['profile'],
	accessType: 'offline',
	approvalPrompt: 'force'
}));

//Callback route for Google redirect
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
	res.render('index');
});

module.exports = router;
