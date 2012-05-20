
var config = require('../config');
var request = require('request');
var path = require('path');
var fs = require('fs');
var colors = require('colors');


// uh is used by some reddit API post methods
var info = {
	cookie: "", 
	uh: "", 
	login: ""
};

exports.login = function(username, password){
	var opts = {
		uri: "http://www.reddit.com/api/login/" + username,
		form:{
			user: username,
			passwd: password,
			api_type: "json" 
		},
		headers: config.headers,
		followAllRedirects: true
	};

	request.post(opts, function(err, res, body){
		if (err){
			console.error(err);
			return;
		}
		var data = JSON.parse(body);
		info.cookie = "reddit_session=" + data.json.data.cookie;
		info.login = username;
		info.uh = data.json.data.uh;
		writeLogin();
		console.log("logged in as ", info.login.cyan);
	});
}

exports.isLoggedIn = function(){
	return !!info.login;
}

exports.logout = function(){
	console.log("logging out ", info.login.cyan);
	info = {};
	writeLogin();
}

exports.getUser = function(){
	return info.login;
}

exports.getCookie = function(){
	return info.cookie;
}

exports.printInfo = function(){
	console.log("\nlogged in as:", info.login);
}

function readLogin(){
	if (!path.existsSync(config.loginFile)){
		return {};
	}
	var contents = fs.readFileSync(config.loginFile);
	return contents && JSON.parse(contents.toString());
}

function writeLogin(){
	var dataFile = fs.openSync(config.loginFile, 'w');
	fs.writeSync(dataFile, JSON.stringify(info));
}

// when importing this module, check the file system to see if we're logged in.
info = readLogin();
console.log(info.login ? "logged in as " + info.login : "");
