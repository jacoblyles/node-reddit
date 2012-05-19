// 
// reddit ["fetch"]  - fetches frontpage
// reddit fetch <subreddit>
// reddit login username password
// reddit logout
// reddit orangred - requires login
// reddit messages - requires login
// 

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var colors = require('colors');
var cli = require('cli');

var argv = require('optimist').argv;

var reddit_cookie, reddit_user;

var defaults = {
	headers: {
		"User-Agent": "node-reddit bot by /u/jacoblyles",
		"Host": "www.reddit.com"
	}
};


var login = exports.login = function(login, passwd, cb){
	var opts = _.extend(defaults, {
		uri: "http://www.reddit.com/api/login/" + login,
		form:{
			user: login,
			passwd: passwd,
			api_type: "json" 
		},
		followAllRedirects: true
	});

	request.post(opts, function(err, res, body){
		if (err){
			console.error(err);
			return;
		}
		var data = JSON.parse(body);
		console.log(data);
		reddit_cookie = data.json.data.cookie;
		reddit_user = login;
		storeCookie(reddit_cookie, reddit_user);
	});
};

function storeCookie(cookie, user){
	var fs = require('fs');
	var dataFile = fs.openSync('./data/myData', 'w');
	fs.writeSync(dataFile, JSON.stringify({
		cookie: cookie,
		user: user
	}));
	console.log(cookie,user);
}

function readCookie(){
	if (!path.existsSync('./data/myData')){
		return;
	}
	var contents = fs.readFileSync('./data/myData');
	console.log(contents.toString());
	return contents && JSON.parse(contents.toString());
}

function _logout(){
	console.log("logging out " + reddit_user);
	reddit_cookie = null;
	reddit_user = null;
	fs.unlinkSync('./data/myData');
}

function _login(){

}

require('http').createServer(function(req, res){
	console.log(req.headers);
}).listen(8888);

exports.fetch = function(subreddit){
	console.log(subreddit);
	var jar = request.jar();
	var cookie = request.cookie("reddit_session=12502917%2C2012-05-19T02%3A28%3A56%2C86eada60d62621ff5dbb84e5ec7eb6a6398ea49b");
	jar.add(cookie);

	var opts  = _.extend(defaults, {
		uri : subreddit ? "http://reddit.com/r/" + subreddit + "/.json" : "http://www.reddit.com/.json",
		jar: jar
	});

	console.log(opts);

	request(opts, function(err, res, body){
		if (err){
			console.log(err);
		}
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


var commands = {};
commands["login"] = exports.login;
commands["fetch"] = exports.fetch;


cli.main(function (args, options) {
	console.log("***********".rainbow);
	console.log("Node Reddit".cyan);
	console.log("***********\n\n".rainbow);
	var userData = readCookie();
	if (userData){
		reddit_user = userData.user;
		reddit_cookie = userData.cookie;
	}

	command = argv._[0] || "fetch";
	if(commands[command]){
		console.log("command is", command);
		console.log(argv);
		commands[command].apply({}, argv._.slice(1));
	} else {
		console.log("invalid command")
	}
});












