// Config and Server Details
var config = {
	channels: ["#phntm", "#worldcoin"],
	server: "irc.freenode.net",
	botName: "CoinBot"
};

// Require the libraries
var irc = require("irc");
var $ = require('jquery');

// Create the bot's skeleton
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels,
    port: 8001
});

//Listen for channel kicks
bot.addListener('kick', function(channel, nick, by, reason, message) {

        bot.say(to, 'Oooooo! Someone just got kicked!');
});

//Listen for help command
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!help') > -1
    ) {
        bot.say(to, 'To check the price of BTC, just say "!btc". To check the price of WDC, just say "!wdc".');
    }
});

//Listen for mentions
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('CoinBot') > -1
    || message.indexOf('coinbot') > -1
    || message.indexOf('Coinbot') > -1
    || message.indexOf('COINBOT') > -1
    ) {
        bot.say(to, 'Hey there, my name is CoinBot!');
    }
});

//BTC Price Check Command
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!btc') > -1
    || message.indexOf('!BTC') > -1
    || message.indexOf('!Btc') > -1
    ) {

        $.getJSON("http://data.mtgox.com/api/2/BTCUSD/money/ticker_fast", function(data) {
    var gox = data;
    var goxprice = data.data.last.display;
        $.getJSON("https://www.bitstamp.net/api/ticker/", function(data) {
    var bit = data;
    var bitprice = data.ask;
    var mbtcp = bitprice*0.01;
    bot.say(to, "1 BTC in USD currently costs " + goxprice + " on MtGox and $" + bitprice + " on BitStamp. Therefore, 1 USD is equal to " + mbtcp + "mBTC.");
});
});
    }
});

//WDC Price Check Command
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!wdc') > -1
    || message.indexOf('!WDC') > -1
    || message.indexOf('!Wdc') > -1
    ) {
    $.getJSON("http://pubapi.cryptsy.com/api.php?method=singleorderdata&marketid=14", function(data) {
    var wdc = data;
    console.log(result["wdc"].WDC.sellorders[0]);
    bot.say(to, "1 WDC currently trades for SOME FUCKING AMOUNT OF MONEY GO LOOK IT UP");
});
    }
});