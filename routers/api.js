"use strict";

var express = require('express'),
	User = require('../model/user.js'),
	router = express.Router();

//api used for registeration page, check if given username has been used and send json result back.
router.get('/username/:username', function(req, res){
	var username = req.params.username;

	if(!username || username.trim().length === 0){
		return res.json({
			available: false,
			message: "Please fill username field..."
		});
	}

	User.findByUsername(username, function(err, user){
		if(err || user){
			return res.json({
				available: false,
				message: err?"Server Error":"Given username has been used..."
			});
		}

		res.json({
			available: true
		});
	});
});

module.exports = router;