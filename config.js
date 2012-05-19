

// default headers for web requests
exports.headers = {
	"User-Agent": "node-reddit bot by /u/jacoblyles",
	"Host": "www.reddit.com"
}

exports.loginFile = require("path").resolve(__dirname, "./data/login");