"use strict";
//mocking database by creating user class and using array to store all use instances.

var bcrypt = require('bcryptjs');
//salt generation round constant
var SALT_ROUND = 10;


//helper function to transform plain password to hashed one
//this function works async because normally 10-round salt encryption needs some time, like around 10 secs
//during this time, you don't want to let it block the entire thread.
var getHashedPassword = function(password, done){
	bcrypt.genSalt(SALT_ROUND, function(err, salt){
		if(err){
			return done(err);
		}

		bcrypt.hash(password, salt, function(err, hash){
			if(err){
				return done(err);
			}

			return done(null, hash);
		});
	});
};


//every user instance contains three fields: unique id, username and hashed password
var User = function(username, password){
	this._id = User.getId();
	this.username = username;
	if(password){
		this.password = password;
		this.setPassword(password);
	}
};

//also augment this User function object as the container for data storage.
User.collection = User.collection || [];
User.id = User.id || 1;
User.getId = function(){
	return this.id++;
};
//save method mocks saving an user isntance into database
User.save = function(user){
	if(!user){return false;}

	var curr, i;
	for(i=0; i<this.collection.length; i++){
		curr = this.collection[i];
		if(curr._id === user._id){
			this.collection[i] = user;
			return true;
		}
	}
	this.collection.push(user);
	return true;
};
//findById method mocks finding an user instance from database based on its id
User.findById = function(id, done){
	if(!id || id<1 || id>this.id){
		return done(new Error('Invalid id'));
	}

	var curr, i;
	for(i=0; i<this.collection.length; i++){
		curr = this.collection[i];
		if(curr._id === id){
			return done(null, curr);
		}
	}

	done(null, null);
};
//findByUsername method mocks finding an user instance from database based on its username
User.findByUsername = function(username, done){
	if(!username){
		return done(new Error('Invalid username'));
	}

	var curr, i;
	for(i=0; i<this.collection.length; i++){
		curr = this.collection[i];
		if(curr.username === username){
			return done(null, curr);
		}
	}

	done(null, null);
};


//add methods of user objects to their prototype object
(function(){
	//methods for User instance work in sync way.

	//set password 
	this.setPassword = function(password){
		if(!password){return false;}

		//cache the reference to user 
		var user = this;

		return getHashedPassword(password, function(err, hash){
			if(err){
				return false;
			}

			//use user variable to reference invoked user object, we can't use this, 
			//because callback works as function, so this's pointing to global object. 
			user.password = hash;
			return true;
		});		
	};

	//check if given password input matches stored user's password
	this.checkPassword = function(input){
		return bcrypt.compareSync(input, this.password);
	};

}).call(User.prototype);


module.exports = User;