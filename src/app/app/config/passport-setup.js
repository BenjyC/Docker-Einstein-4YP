const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Import auth keys
const keys = require('./keys.js');

passport.use(
	new GoogleStrategy({
		//options for the strategy
		callbackURL:'/auth/google/redirect',
		clientID:keys.google.clientID,
		clientSecret:keys.google.clientSecret
	}, (accessToken, refreshToken, profile, done) => {
		//passport cb function
		console.log(profile);
	})
)