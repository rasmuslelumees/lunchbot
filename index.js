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

// Frenchy
const frenchy = new FacebookSource('fr', 'Frenchy', "593232130762873", params);

// La Tabla
const latabla = new FacebookSource('es', 'La Tabla', "827767180609816", params);

// KPK
//const kpk = new FacebookSource('scissors', 'Kivi Paber Käärid', 'kivipaberkaarid', params);

// Apelsini Raudtee
const apelsin = new FacebookSource('tangerine', 'Apelsini Raudtee', 'apelsiniraudtee', params);

// F-Hoone
const fhoone = new FacebookSource('house', 'F-Hoone', 'Fhoone', params);

// Kärbes
const karbes = new FacebookSource('bee', 'Kärbes', 'karbeskitchenandbar', params);

// Trühvel, special because only posts once a week (on Mondays)
const truhvel = new FacebookSource('coffee', 'Trühvel', '1829502837275034', params);

//Fabrik / Gustav Kalamaja
const fabrik = new FacebookSource('gear', 'Gustav Kalamaja', 'gustavkalamaja', params);

// Lendav Taldrik
const lendav = new FacebookSource('satellite_antenna', 'Lendav Taldrik', '389723857828746', imageParams);

const services = [frenchy, latabla, apelsin, fhoone, truhvel, karbes, fabrik, lendav];
console.log('Starting LunchBot with ' + services.length + ' services');

bot.services = services;
bot.run();
