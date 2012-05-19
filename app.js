#!/usr/bin/env node

/********************
 * Node-Reddit
 *
 * A simple CLI app that reads in Reddit's frontpage and colorizes it
 * with optional login info passed in at the command line 
 * username is passed with -u, --user, or first arg
 * passwd is passed with -p, --passwd, or second arg
 * 
 * by Kamran Ayub and Jacob Lyles
 * License: WTFPL (http://sam.zoy.org/wtfpl/)
 * Attribution is cool but not required
 ********************/

var cli     = require('cli'),
		http    = require('http'),
		request = require('request'),
		argv    = require('optimist').argv,
		colors  = require('colors');

var cookie, uh;
var USER = argv.u || argv.user || argv._[0];
var PASSWD = argv.p || argv.passwd || argv._[1];

var login = function(opts, cb){
		var apiOptions = {
		uri: "http://www.reddit.com/api/login/" + USER,
		user: USER,
		headers: {
			"Host": "www.reddit.com",
			"Connection": "Keep-Alive",
			"User-Agent": "logged-in node-reddit bot by /u/jacoblyles"
		},
		form:{
			user: USER,
			passwd: PASSWD,
			api_type: "json" 
		},
		followAllRedirects: true
	};

	request.post(apiOptions, function(err, res, body){
		if (err){
			console.error(err);
		}
		var data = JSON.parse(body);
		cookie = data.json.data.cookie;
		console.log("cookie is", cookie);
		console.log(body, res.headers);
		uh = data.modhash;
		cb();
	});

};


var fetch = function(opts, cb){
	apiOptions = {
		uri: 'http://reddit.com/.json',
		headers: {
			"Cookie": cookie,
			"User-Agent": "logged-in node-reddit bot by /u/jacoblyles",
			"Host": "www.reddit.com",
		}
	}

	console.log(apiOptions);

	request(apiOptions, function (err, res, body) {
		if (!err && res.statusCode === 200) {
			var reddit  = JSON.parse(body),
					stories = reddit.data.children.map(function (s) { 
											return s.data; 
										});
			
			// Descending score
			stories.sort(function (a, b) { return b.score - a.score; });

			stories.forEach(function (story) {
				var row = "",
					title = story.title.length > 100
								? story.title.substr(0, 100) + "..." 
								: story.title;

				// Build row
				// [score] [title] [comments] [subreddit]
				// This sucks
				row += story.score.toString().green + "\t";
				row += title.bold
				row += " (" + story.domain + ")";
				row += (" /r/" + story.subreddit).cyan;
				row += "\n\t";
				row += story.author.grey;     
				row += " " + (story.num_comments + " comments").italic.yellow;
				row += "\n";

				console.log(row);
			});
		}
	});
}


cli.main(function (args, options) {
	console.log("***********".rainbow);
	console.log("Node Reddit".cyan);
	console.log("***********\n\n".rainbow);
	
	if (USER && PASSWD){
		login({}, fetch);
	} else { 
		fetch();
	}
});

