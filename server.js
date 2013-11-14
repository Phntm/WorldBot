// Config and Server Details
var config = {
	channels: ["#phntm"],
	server: "irc.freenode.net",
	botName: "WorldBot"
};

// Require the libraries
var irc = require("irc");
var $ = require('jquery');
var parser = require('xml2json');

//xml2json Options
var options = {
    object: true,
    reversible: false,
    coerce: true,
    sanitize: true,
    trim: true,
    arrayNotation: false
};

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

//Announce bitcoin price every hour, 3600000 ms in one hour
setInterval ("announce()", 5000);
function announce() {
  $.getJSON("http://data.mtgox.com/api/2/BTCUSD/money/ticker_fast", function(data) {
    var gox = data;
    var goxprice = data.data.last.display;
        $.getJSON("https://www.bitstamp.net/api/ticker/", function(data) {
    var bit = data;
    var bitprice = data.ask;
    var mbtcp = bitprice*0.01;
    mbtcp = mbtcp.toFixed(3);
    bot.say(to, "Hourly Update: 1 BTC in USD currently costs " + goxprice + " on MtGox and $" + bitprice + " on BitStamp.");
});
});
}
}

//WDC MCXnow Price Check Command
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!mcx') > -1
    || message.indexOf('!Mcx') > -1
    || message.indexOf('!MCX') > -1
    ) {
    $.ajax({
        type: "GET",
        url: "https://mcxnow.com/orders?cur=WDC",
        dataType: "xml",
        success: function(xml) {
            var JSON = parser.toJson(xml);
            bot.say(to, JSON.doc.buy[0]);
        }
    });
    }
});