var twitter = require('ntwitter');
var fs = require('fs');
var express = require('express');
var app = express();

var NUMBER_OF_TWEETS = 10;
var streaming = false;

var twit = new twitter({
  consumer_key: 'WZJHVqj0JwafP6PTm0kA',
  consumer_secret: 'mijPrzupm0TVQABvxhoRplMVfvk26UxdefpQfI',
  access_token_key: '1474571802-sqyxiUw4Fq5PdoHrmbIZgQF53FD3KhiLLpBzZ8p',
  access_token_secret: 'gDCiTAhQIWyuQhSbPWJObMYrzgDccI6AW1GKeGkQN7JKO'
});

var count = 0;
app.get('/status', function(req, res){
  if(streaming){
    var html = '<p>' + count + ' tweets have been recorded.</p>';
    html += '<p><a href="status">refresh</p>';
    res.send(html);
  }else{
    var html = '<p>All tweets have been recorded. File has been closed.</p>';
    html += 'Start another read at <a href="start">localhost:3000/start</a>.';
    html += '<p>View the file at <a href="file">localhost:3000/file</a></p>'
    html += '<p>Download the file at <a href="tweets.json">localhost:3000/tweets.json</a></p>'
    res.send(html);
  }
});
app.get('/', function(req, res){
  var html = 'Please go to <a href="start">localhost:3000/start</a> in order to start streaming tweets.';
  html += '<p>View the file at <a href="file">localhost:3000/file</a></p>'
  html += '<p>Download the file at <a href="tweets.json">localhost:3000/tweets.json</a></p>'
  res.send(html);
});
app.get('/start', function(req, res){
  count = 0;
  streaming = true;
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
          console.log('A tweet was appended to the file!');
        });
        ++count;
      }
      if (count >= NUMBER_OF_TWEETS)
      {
        fs.appendFile('tweets.json', "\n]", function (err) {
          if (err) throw err;
          streaming = false;
          console.log('The ' + NUMBER_OF_TWEETS + 'th tweet as been added, file is complete!');
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
var html = '<p>Tweet streaming has begun to tweets.json.</p>';
html += 'Go to <a href="status">localhost:3000/status</a> to view current status.';
res.send(html);
});
app.get('/file', function(req, res)
{
  fs.readFile('tweets.json', 'UTF-8' ,function (err, data){
    if (err) throw err;
    var html = JSON.parse(data);
    res.send(html);
  });
});
app.get('/tweets.json', function(req, res){
  var file = __dirname + '/tweets.json';
  res.download(file);
});


var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});