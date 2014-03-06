var twitter = require('ntwitter');
var fs = require('fs');
var express = require('express');
var app = express();

var NUMBER_OF_TWEETS = 10;

var twit = new twitter({
  consumer_key: 'WZJHVqj0JwafP6PTm0kA',
  consumer_secret: 'mijPrzupm0TVQABvxhoRplMVfvk26UxdefpQfI',
  access_token_key: '1474571802-sqyxiUw4Fq5PdoHrmbIZgQF53FD3KhiLLpBzZ8p',
  access_token_secret: 'gDCiTAhQIWyuQhSbPWJObMYrzgDccI6AW1GKeGkQN7JKO'
});

// var http=require('http');

// var httpServer = http.createServer(function(request, response) {
//  response.writeHead(200, {
//   'Content-type': 'text/plain'
// });
//  response.end(count + ' tweets have been recorded.');
// }).listen(8000);
// console.log('Listening on http://127.0.0.1:8000');
var count = 0;
app.get('/status', function(req, res){
  if(count < NUMBER_OF_TWEETS){
    res.send(count + ' tweets have been recorded.');
  }else{
    res.send('All tweets have been recorded. File has been closed.');
  }
});
app.get('/', function(req, res){
  res.send('Please go to localhost:3000/start in order to start streaming tweets.');
});
app.get('/start', function(req, res){
  count = 0;
var sw='-73.68,42.72', ne='-73.67,42.73'; //  RPI
twit.stream('statuses/filter', {'locations':sw +','+ne},
  function(stream) {
    stream.on('data', function (response) {
      if(count == 0)
      {
        fs.writeFile('tweets.json', "[\n" + JSON.stringify(response), function (err) {
          if (err) throw err;
          console.log('File created and first tweet json added!');
        });
        ++count;
      }
      else 
      {
        fs.appendFile('tweets.json', ",\n" + JSON.stringify(response), function (err) {
          if (err) throw err;
          console.log('The tweet json was appended to file!');
        });
        ++count;
      }
      if (count >= NUMBER_OF_TWEETS)
      {
        fs.appendFile('tweets.json', "\n]", function (err) {
          if (err) throw err;
          console.log('The file is complete!');
        });
        stream.destroy();
      }
    });
    stream.on('end', function (response) {
    // Handle a disconnection
  });
    stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
    
  });
res.send('Tweet streaming has begun to tweets.json.');
res.send('Go to localhost:3000/status to view current status.');
});
app.get('/file', function(req, res){
  fs.readFile('tweets.json', 'UTF-8' ,function (err, data) {
  if (err) throw err;
  // console.log(data);
  res.send(JSON.parse(data));
});
});


var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});