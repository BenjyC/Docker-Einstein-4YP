var express = require('express');
var router = express.Router();

const passport = require('passport');

/* GET users listing. */
router.get('/login', (req,res,next) => {
	res.render('login', { title1: 'Docker Einstein', title2: 'Authentication' });
});

//Authentication logout
router.get('/logout', (req,res,next) => {
	res.send('logging out');
});

//Authentication with Google
router.get('/google', passport.authenticate('google', {
	scope: ['email'],
	accessType: 'offline',
	approvalPrompt: 'force'
}));

//Callback route for Google redirect
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
	//Save user email in req.app.locals to use in feedback route
	req.app.locals.emailAddr = req.user.emails[0].value;
	res.redirect('/')
});

module.exports = router;
