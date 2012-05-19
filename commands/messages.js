var request = require('request');
var login = require('./login');

exports.messages = function(){
	if(!login.isLoggedIn()){
		console.log('you must be logged in to get messages!'.red);
	}

	
};

exports.orangered = function(){
	if(!login.isLoggedIn()){
		console.log('you must be logged in to get orangered!'.red);
	}


};