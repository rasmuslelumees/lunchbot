// index.js

var LunchBot = require('./lib/lunchbot');
var FacebookSource = require('./lib/sources/facebook');
var Parsers = require('./lib/parsers');
var Filters = require('./lib/filters');

var config = require('config');
var Promise = require('bluebird');

var token = config.get('slack.api');
var name = config.get('slack.name');

process.on('uncaughtException', function(err) {
    console.log(err);
});

process.on('exit', function() {
    console.log('Process exiting');
});

var bot = new LunchBot({
    token: token,
    name: name,
    usesReactionVoting: config.get('slack.usesReactionVoting')
});

var params = {
    chains: [
        {
            parser: Parsers.weeklyMenu,
            filter: Filters.startOfWeek
        },
        {
            parser: Parsers.basicPrice,
            filter: Filters.sameDay
        }
    ]
};

var imageParams = {
	chains: [
		{
			parser: Parsers.imageOnly,
			filter: Filters.sameDay
		}
	]
};

//
//  Sources
//

// Apelsini Raudtee
const apelsin = new FacebookSource('tangerine', 'Apelsini Raudtee', 'apelsiniraudtee', params);
const sesoon = new FacebookSource('fork_and_knife', 'Sesoon', 'KohvikSesoon', params);
//const korsten = new FacebookSource('tokyo_tower', 'Korsten', 'Korstenresto', params);
const uulits = new FacebookSource('hamburger', 'Uulits', 'uulitsrestoran', params);

const services = [sesoon, apelsin, uulits];
console.log('Starting LunchBot with ' + services.length + ' services');

bot.services = services;
bot.run();
