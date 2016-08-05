"use strict"

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../model/user.js');

//in most case after authentication, application doesn't need user's password or maybe some other information
//use a filter function to return necessary user information.
var getUser = function(user){
	return {
		_id: user._id,
		username: user.username 
	};
};

//use passport's local strategy, authenticating user by checking username and password, or equivlences.
//pass a verify callback that accepts parsed username and password to the local strategy constructor.
passport.use(new LocalStrategy(function(username, password, done){
	User.findByUsername(username, function(err, user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, {
				message: "Invalid Username/Password"
			});
		}
		if(user.checkPassword(password)){
			done(null, getUser(user));
		}else{
			done(null, false, {
				message: "Invalid Username/Password"
			});
		}
	});
}));

//session handling
//passport stores user id as a token in req.session.passport.
passport.serializeUser(function(user, done){
	done(null, user._id);
});

//retrieve the user object based on id token and set it as req.user
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, getUser(user));
	});
});

