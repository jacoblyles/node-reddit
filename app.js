#!/usr/bin/env node

var _ = require('underscore');
var request = require('request');
var colors = require('colors');
var argv = require('optimist').argv;
var config = require('./config');

function printUsage(command){
	commands.forEach(function(item){
		console.log("\n" + item.usage.bold.cyan);
		console.log("description: ".bold.green + item.description);
	});
}

var commands = [
	{
		name: "login",
		usage: "reddit login <username> <password>",
		description: "logs in as <username>",
		func: require('./commands/login').login
	},
	{
		name: "logout",
		usage: "reddit logout",
		description: "logs out of reddit",
		func: require('./commands/login').logout
	},
	{
		name: "fetch",
		usage: "reddit fetch [subreddit]",
		description: "displays the top 25 stories from the front page, or an optional subreddit",
		func: require('./commands/fetch').fetch
	},
	{
		name: "orangered",
		usage: "reddit oragered",
		description: "displays your orangereds. Requires login.",
		func: require('./commands/messages').orangered
	},
	{
		name: "messages",
		usage: "reddit messages",
		description: "displays your last 10 messages. Requires login.",
		func: require('./commands/messages').messages
	},
	{
		name: "status",
		usage: "reddit status",
		description: "shows logged-in state",
		func: require('./commands/login').printInfo	
	},
	{
		name: "help",
		usage: "reddit help",
		description: "print this help text",
		func: printUsage
	}
]


if (require.main === module) {
	console.log("***********".rainbow);
	console.log("Node Reddit".cyan);
	console.log("***********\n\n".rainbow);
	config.ensureDataDir(function(){

		command = argv._[0] || "fetch";

		command = commands.filter(function(item){ return item.name === command})[0];
		if (!command){
			console.log("invalid command");
			printUsage();
		} else {
			command.func.apply({}, argv._.slice(1));	
		}
	});
}











