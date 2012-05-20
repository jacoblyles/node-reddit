var request = require('request');
var login = require('./login');
var config = require('../config');
var _ = require('underscore');
var colors = require('colors');
var wrap = require('wordwrap')(20,80);

exports.messages = function(orangered){
	if(!login.isLoggedIn()){
		console.log('you must be logged in to get messages!\n'.red);
		return;
	}
	
	request({
		uri: orangered ? 'http://www.reddit.com/message/unread/.json' 
						: 'http://www.reddit.com/message/inbox/.json',
		headers: _.extend(config.headers, {
			cookie: login.getCookie()
		})
	}, function(err, res, body){
		if (err){
			console.log(err);
			return;
		}
		if (res.statusCode === 200){
			var data = JSON.parse(body);
			if (!data.data.children.length) {
				console.log("no messages available\n");
			}
			data.data.children.forEach(function(item) { 
				var list = '\n' + item.data.author.bold.grey; 
				list += ('\t\t(/r/' + item.data.subreddit + ')').cyan; 
				list += ('\t' + item.data.subject + '\n').italic.yellow;
				list += 'content: '.cyan + wrap(item.data.body);
				console.log(list);
			})
		}
	});
};

exports.orangered = function(){
	if(!login.isLoggedIn()){
		console.log('you must be logged in to get orangered!'.red);
		return;
	}
	exports.messages(true);
};