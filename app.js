"use strict";

//application dependencies
var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('express-flash'),
	router = require('./routers/server.js'),
	apiRouter = require('./routers/api.js');

var app = module.exports = express();

app.disable('X-Powered-By');
//require passport configuration
require('./config/passport.js');

//application setting
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, "views"));

//generic middleware stacks
app.use(logger('dev'));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: process.env.SESSION_SECRET || "ThisIsDefaultSessionSecret",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//delegate routing to various router as sub-applications
app.use('/api', apiRouter);
app.use(router);

//404 handlers 
app.use(function(req, res, next){
	res.status(404).send('404 Not Found');
});

//error handlers
app.use(function(err, req, res, next){
	console.error(err);
	res.status(500).send("Server Internal Error");
});

//start server at port 3000 on localhost
app.listen(app.get('port'), function(){
	console.log("Server is listening on localhost at port " + app.get('port'));
});