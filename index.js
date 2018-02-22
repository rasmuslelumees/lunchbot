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

const sesoon = new FacebookSource('fork_and_knife', 'Sesoon', 'KohvikSesoon', params);
const apelsin = new FacebookSource('tangerine', 'Apelsini Raudtee', 'apelsiniraudtee', params);
const truhvel = new FacebookSource('coffee', 'Trühvel', '1829502837275034', params);
//const korsten = new FacebookSource('tokyo_tower', 'Korsten', 'Korstenresto', params);
const uulits = new FacebookSource('hamburger', 'Uulits', 'uulitsrestoran', params);
const lendav = new FacebookSource('satellite_antenna', 'Lendav Taldrik', '389723857828746', imageParams);

const services = [sesoon, apelsin, truhvel, uulits, lendav];
console.log('Starting LunchBot with ' + services.length + ' services');

bot.services = services;
bot.run();
