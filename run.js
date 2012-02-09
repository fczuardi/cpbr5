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
  var formattedTweet = tweet.text;
  if (tweet.entities.urls){
    tweet.entities.urls.forEach(function(item, index){
      if (item.expanded_url){
        formattedTweet =  formattedTweet.substring(0, item.indices[0]) +
                          '<a href="'+item.expanded_url+'">'+ item.display_url + '</a>' +
                          formattedTweet.substring(item.indices[1],formattedTweet.length);
      }
    })
  }
  var message = '<a href="http://twitter.com/' + tweet.user.screen_name + '">' + tweet.user.screen_name +'</a>: '+ formattedTweet;
  console.log(tweet.text);
  console.log(JSON.stringify(tweet.entities));
  try{
  everyone.now.receiveMessage(message);
  }catch(e){}
});

twitterStreamClient.start(['cpbr5', 'Cpbr5', 'CPBR5', 'cparty', 'campus party']);