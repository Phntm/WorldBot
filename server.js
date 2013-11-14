// Config and Server Details
var config = {
	channels: ["#phntm","#worldcoin"],
	server: "irc.freenode.net",
	botName: "WorldBot"
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
        bot.say(to, 'To check the prices of BTC, LTC, or WDC, just say !btc, !ltc, or !wdc.');
    }
});

//Listen for mentions
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('WorldBot') > -1
    || message.indexOf('worldbot') > -1
    || message.indexOf('Worldbot') > -1
    || message.indexOf('WORLDBOT') > -1
    ) {
        bot.say(to, 'Hey there, my name is WorldBot!');
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
    mbtcp = mbtcp.toFixed(3);
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
    var wdcprice = data["return"].WDC.buyorders[0].price;
    $.getJSON("https://www.bitstamp.net/api/ticker/", function(data) {
    var bit = data;
    var bitprice = data.ask;
    var mbtcusdinBTC = bitprice*0.00001;
    var wdcusd = mbtcusdinBTC/wdcprice;
    wdcusd = wdcusd.toFixed(2);
    bot.say(to, "1 WDC currently trades for " + wdcprice + "BTC on Cryptsy. Therefore, 1 USD is equal to " + wdcusd + "WDC at Bitstamp prices.");
});
});
    }
});

//LTC Price Check Command
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!ltc') > -1
    || message.indexOf('!LTC') > -1
    || message.indexOf('!Ltc') > -1
    ) {
    $.getJSON("http://pubapi.cryptsy.com/api.php?method=singleorderdata&marketid=3", function(data) {
    var ltc = data;
    var ltcprice = data["return"].LTC.buyorders[0].price;
    $.getJSON("https://www.bitstamp.net/api/ticker/", function(data) {
    var bit = data;
    var bitprice = data.ask;
    var mbtcusdinBTC = bitprice*0.00001;
    var ltcusd = mbtcusdinBTC/ltcprice;
    ltcusd = ltcusd.toFixed(2);
    bot.say(to, "1 LTC currently trades for " + ltcprice + "BTC on Cryptsy. Therefore, 1 USD is equal to " + ltcusd + "LTC at Bitstamp prices.");
});
});
    }
});