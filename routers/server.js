"use strict"

var express = require('express'),
	passport = require('passport'),
 	User = require('../model/user.js'),
	router = express.Router();

//get string representation of partial session information, not so well written though, just for example purpose.
var stringify = function(obj){
	var key,
		result = "{\n";

	Object.keys(obj).forEach(function(key){
		result += key + ': ' + obj[key]+'\n';
	});

	return result + ' }'
};

var getSessionStr = function(session){
	var key,
		result = "{\n";

	for(key in session){
		switch(key){
			case 'cookie':
				result += key + ': ' + stringify(session[key])+'\n';
				break;
			case 'flash':
				result += key + ': ' + stringify(session[key]) +'\n';
				break;
			case 'passport':
				result += key + ': ' + stringify(session[key]) +'\n';
				break;
			default:
				break;
		}
	}

	result += " }";

	return result;
};


//router-level authentication middleware for protecting certain routes
//when user's trying to access some protected resourses, check if user is authenticated...
var ensureAuthenticated = function(req, res, next){
	//if authenticated, continue...
	if(req.isAuthenticated()){
		return next();
	}

	//if unauthenticated, redirect to login page  with 401 status code and flash message
	req.flash('error', "Please login to gain access to protected content.");
	res.status(401).redirect('/login');
};


//router-level middlewares for adding session and user tracking information into views
router.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

router.use(function(req, res, next){
	var user, session;

	if(req.user){
		user = JSON.stringify(req.user);
	}

	if(req.session){
		session = getSessionStr(req.session);
	}

	res.locals.userStr = user;
	res.locals.sessionStr = session;

	next();
});


//routing and request handlers for specified routes
//these request handlers are middlewares, usually the ending of entire middleware flow 
router.get('/', function(req, res){
	res.render('index', {
		title: "Auth Example"
	});
});

router.get('/login', function(req, res){
	res.render('login', {
		title: "Auth | login"
	});
});

router.get('/register', function(req, res){
	res.render('register', {
		title: "Auth | register"
	});
});

router.get('/logout', function(req, res){
	//passport.js populates this logout method in request object
	req.logout();
	res.redirect('/');
});

router.get('/protected', ensureAuthenticated, function(req, res){
	//only authenticated users get passed
	res.render('protected', {
		title: "Auth | protected content"
	});
});

//use passport.js and its local strategy to guard login section
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));


router.post('/register', function(req, res, next){
	var username = req.body.username,
		password = req.body.password,
		password2 = req.body.password2;

	//server-side application-level data validation
	//check all required fields
	if(!username || !password || !password2){
		req.flash('error', "Please fill in all fields and retry!");
		return res.redirect('/register');
	}

	password = password.trim();
	password2 = password2.trim();

	//check if password matches verify password
	if(password !== password2){
		req.flash('error', "Password and verify password are not matched.");
		return res.redirect('/register');
	}

	//dive into mocking database to check if given username has been registed?
	User.findByUsername(username, function(err, user){
		if(err){
			return next(err);
		}

		//if given username exists, issue a message to tell user that given username's been used.
		if(user){
			req.flash("error", "Username has been used, please try another one...");
			return res.redirect('/register');
		}

		//everything's fine, save user's info into database and redirect user to login page with success msg.
		User.save(new User(username, password));
		req.flash("info", "Register successful, now please login to continue...");
		res.redirect('/login');
	});
});

module.exports = router;