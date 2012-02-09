var html = require('fs').readFileSync(__dirname+'/helloworld.html');
var config = require('./config');
var server = require('http').createServer(function(req, res){
  res.end(html);
});
server.listen(8003);

var nowjs = require("now");
var everyone = nowjs.initialize(server, {socketio: {transports: ['xhr-polling', 'jsonp-polling']}});

var Twitter = require('node-twitter');

var twitterStreamClient = new Twitter.StreamClient(
    config.consumer_key,
    config.consumer_secret,
    config.access_token_key,
    config.access_token_secret
);

twitterStreamClient.on('close', function() {
  var message = 'Connection closed.';
  console.log(message);
  try{
  everyone.now.receiveMessage(message);
  }catch(e){}
});
twitterStreamClient.on('end', function() {
  var message = 'End of Line.';
  console.log(message);
  try{
  everyone.now.receiveMessage(message);
  }catch(e){}
});
twitterStreamClient.on('error', function(error) {
  message = 'Error: ' + (error.code ? error.code + ' ' + error.message : error.message);
  console.log(message);
  try{
  everyone.now.receiveMessage(message);
  }catch(e){}
});
twitterStreamClient.on('tweet', function(tweet) {
  var message = tweet.user.screen_name+': '+tweet.text;
  console.log(message);
  try{
  everyone.now.receiveMessage(message);
  }catch(e){}
});

twitterStreamClient.start(['cpbr5', 'Cpbr5', 'CPBR5', 'cparty', 'campus party']);