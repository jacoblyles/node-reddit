var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// default headers for web requests
exports.headers = {
	"User-Agent": "node-reddit bot by /u/jacoblyles",
	"Host": "www.reddit.com"
}

var loginFile = "~/.reddit/login";
exports.loginFile = loginFile.replace(/^~\//, process.env.HOME + '/');
var dataDir = "~/.reddit";
exports.dataDir = dataDir.replace(/^~\//, process.env.HOME + '/');

exports.ensureDataDir = function(cb){
	if (!path.existsSync(exports.dataDir)){ 
		exec('mkdir '+ exports.dataDir, function(err, stdout, stderr){
			return;
		});
	}
	cb();
}