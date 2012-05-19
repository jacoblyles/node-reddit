var config = require('../config');
var login = require('./login');
var request = require('request');
var colors = require('colors');
var _ = require('underscore');

exports.fetch = function(subreddit){
	
	// use cookie if available
	var jar = request.jar();
	if (login.isLoggedIn()){
		var cookie = request.cookie("reddit_session=" + login.getCookie());
		jar.add(cookie);
	}

	var opts  = {
		uri : subreddit ? "http://reddit.com/r/" + subreddit + "/.json" : "http://www.reddit.com/.json",
		jar: jar,
		headers: config.headers
	};

	request(opts, function(err, res, body){
		if (err){
			console.log(err);
		}
		if (!err && res.statusCode === 200) {
			var reddit  = JSON.parse(body),
				stories = reddit.data.children.map(function (s) { 
											return s.data; 
										});
			
			stories.forEach(function (story) {
				var row = "",
					title = story.title.length > 100
								? story.title.substr(0, 100) + "..." 
								: story.title;

				// Build row
				// [score] [title] [comments] [subreddit]
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



