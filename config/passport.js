var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

// Create a JSON file in the config directory named configVars.json which contains
// a single object with keys named facebookClientID, facebookClientSecret,
// googleClientID and googleClientSecret (see configVars.sample). The values assigned to each key must be obtained
// from your own Google Developer and Facebook Developer accounts.
var configVars = require('./configVars.json');

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
		done(err, user);
	});
});

var localStrategy = new LocalStrategy(function(username, password, done){

	User.findOne({username: username}, function(err, user){

		if(err) return done(err);

	    if(!user) return done(null, false);

	    user.comparePassword(password, function(err, isMatch){

	    	if(err) return done(err);

	    	if(isMatch){
	    		return done(err, user);
	    	}
	    	else {
	    		return done(null, false);
	    	}
	    });
	});
});

passport.use(localStrategy);

passport.use(new FacebookStrategy({
    	clientID: configVars.facebookClientID,
    	clientSecret: configVars.facebookClientSecret,
    	callbackURL: "http://localhost:3000/auth/facebook/callback"
	},
  
	function(accessToken, refreshToken, profile, done) {
    	console.log(profile);
    	User.findOne({username: profile.id}, function(err, user) {

      		if (err) { return done(err); }

    		if (user) {
        		console.log('exists')
        		done(null, user);
    		}
      		else {
				var newUser = new User({username: profile.id});
        		newUser.save(function(err, saved){
          			console.log('save')
          			console.log(err)
          			done(null, saved);
        		})
      		}
    	});
  	})
);

passport.use(new GoogleStrategy({
		clientID	 : configVars.googleClientID,
		clientSecret : configVars.googleClientSecret,
		callbackURL  : 'http://localhost:3000/auth/google/callback'
	},

	function(accessToken, refreshToken, profile, done) {
		console.log(profile.id);
    	User.findOne({ username: profile.id }, function(err, user) {

      		if (err) { return done(err); }

      		if (user) {
        		done(null, user);
      		}
      		else {
        		var newUser = new User({username: profile.id});
        		newUser.save(function(err, saved) {
        			done(null, saved);
        		});
			}
		});
	})
);

module.exports = {
	ensureAuthenticated: function(req, res, next){

		if(req.isAuthenticated()){

      		return next();
		}

		res.redirect('/login');
	}
};