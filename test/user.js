
var User = require('../model/user.js'),
	chai = require('chai'),
	expect = chai.expect;

//suite 
describe("User as module", function(){
	it("is a function", function(){
		expect(User instanceof Function).to.equal(true);
	});
});

//suite
describe("User as constructor", function(){
	var user;
	beforeEach(function(){
		user = new User("username", "password");
	});

	it("returns object with new prefix", function(){
		expect(typeof user).to.equal("object");
	});

	it("every user instance has implicit _id property", function(){
		expect(!!user._id).to.equal(true);
	});

	it("username field is correctly set", function(){
		expect(user.username).to.equal("username");
	});

	it("password field is set", function(){
		expect(!!user.password).to.equal(true);
	});
});

//suite
describe("User as mocking database", function(){
	var user1, user2;
	beforeEach(function(){
		user1 = new User("username1", "password123");
		user2 = new User("username2", "password456");
	});

	it("has collection", function(){
		expect(!!User.collection).to.equal(true);
		expect(Array.isArray(User.collection)).to.equal(true);
	});

	it("getId method works fine", function(){
		expect(typeof User.getId()).to.equal('number');
	});

	it("save method works fine", function(){
		User.save(user1);
		User.save(user2);
		User.save(new User("name", "ps"));
		expect(User.collection.length).to.equal(3);
	});
});