const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Import auth keys
const keys = require('./keys.js');

passport.serializeUser((user,done)=> {
	done(null, user.displayName);
});


passport.deserializeUser((displayName,done)=> {
	done(null, displayName);
})

passport.use(
	new GoogleStrategy({
		//Options for the strategy
		callbackURL:'/auth/google/redirect',
		clientID:keys.google.clientID,
		clientSecret:keys.google.clientSecret
	}, (accessToken, refreshToken, profile, done) => {
		//Passport callback function
		done(null, profile)
	})
)