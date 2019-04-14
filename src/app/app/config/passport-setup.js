const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Import auth keys
const keys = require('./keys.js');

passport.serializeUser((user,done)=> {
	done(null, user.emails[0].value);
});


passport.deserializeUser((emailAddr,done)=> {
	done(null, emailAddr);
})

passport.use(
	new GoogleStrategy({
		//Options for the strategy
		callbackURL:'/auth/google/redirect',
		clientID:keys.google.clientID,
		clientSecret:keys.google.clientSecret
	}, (accessToken, refreshToken, email, done) => {
		//Passport callback function
		done(null, email)
	})
)