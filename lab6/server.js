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
    res.send(wrapHtml(html, 'Status'));
  }else{
    var html = '<p>All tweets have been recorded. File has been closed.</p>';
    html += 'Start another read at <a href="start">localhost:3000/start</a>.';
    html += '<p>View the JSON file at <a href="file">localhost:3000/fileJSON</a></p>';
    html += '<p>Download the file at <a href="tweets.json">localhost:3000/tweets.json</a></p>'
    res.send(wrapHtml(html, 'Status'));
  }
});
app.get('/', function(req, res){
  var html = '<p>Please go to: <form action="start"> <input type="submit" value="Start Page"> </form> in order to start streaming tweets.</p>';
  html += '<p>View the file at: <form action="fileJSON"> <input type="submit" value="JSON File"> </form></p>'
  html += '<p>View the file at: <form action="fileCSV"> <input type="submit" value="CSV File"> </form></p>'
  html += '<p>Download the JSON file at: <form action="tweets.json"> <input type="submit" value="Download"> </form></p>'
  html += '<p>Download the CSV file at: <form action="tweets.csv"> <input type="submit" value="Download"> </form></p>'
  html += '<p>View the csv file at: <form action="toCSV"> <input type="submit" value="Go to CSV"> </form> </p>'
  res.send(wrapHtml(html, 'Home'));
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
res.send(wrapHtml(html, 'Start'));
});
app.get('/fileJSON', function(req, res)
{
  fs.readFile('tweets.json', 'UTF-8' ,function (err, data){
    if (err) throw err;
    var html = JSON.parse(data);
    res.send(html);
  });
});
app.get('/fileCSV', function(req, res)
{
  fs.readFile('tweets.csv', 'UTF-8' ,function (err, data){
    if (err) throw err;
    var html = data;
    res.send(html);
  });
});
app.get('/tweets.json', function(req, res){
  var file = __dirname + '/tweets.json';
  res.download(file);
});
app.get('/end', function(req, res){
  process.exit(0);
});
app.get('/tweets.csv', function(req, res){
  var file = __dirname + '/tweets.csv';
  res.download(file);
});
app.get('/end', function(req, res){
  process.exit(0);
});

app.get('/toCSV', function(req, res){

  fs.readFile('tweets.json', 'UTF-8' ,function (err, data){
    if (err) throw err;
    var arrayOfJSON = JSON.parse(data);
    writeJsonToCsv(arrayOfJSON);
  });
  var html = '<h2>The file has been created.</h2>';
  res.send(wrapHtml(html, 'To CSV'));
});

function wrapHtml(html, title){
  var newHtml = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>';
  newHtml += title;
  newHtml += '</title> <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"> </head> <body> <div class="container theme-showcase"> <div id="content" class="jumbotron">';
  newHtml += html;
  newHtml += '</div> </div> </body> </html>';

  return newHtml;
};

function writeJsonToCsv(arrayOfJSON){
  fs.writeFile('tweets.csv', '"reated_at","id","text","user.name","user.screen_name","user.location","user.followers_count","user.friends_count","user.created_at","user.time_zone","user.profile_background_color","user.profile_background_image_url","geo.coordinates.0","geo.coordinates.1","coordinates.coordinates.0","coordinates.coordinates.1","place.name"', function (err) {
    if (err) throw err;
  });
  
  for (var i = 0; i < arrayOfJSON.length; i++) {
    var line = '';
    line += '"' + arrayOfJSON[i].created_at + '", ';
    line += '"' + arrayOfJSON[i].id + '", ';
    line += '"' + arrayOfJSON[i].text + '", ';
    line += '"' + arrayOfJSON[i].user.name + '", ';
    line += '"' + arrayOfJSON[i].user.screen_name + '", ';
    line += '"' + arrayOfJSON[i].user.location + '", ';
    line += '"' + arrayOfJSON[i].user.followers_count + '", ';
    line += '"' + arrayOfJSON[i].user.friends_count + '", ';
    line += '"' + arrayOfJSON[i].user.created_at + '", ';
    line += '"' + arrayOfJSON[i].user.time_zone + '", ';
    line += '"' + arrayOfJSON[i].user.profile_background_color + '", ';
    line += '"' + arrayOfJSON[i].user.profile_background_image_url + '", ';
    if (arrayOfJSON[i].geo != null) {
      line += '"' + arrayOfJSON[i].geo.coordinates[0] + '", ';
      line += '"' + arrayOfJSON[i].geo.coordinates[1] + '", ';  
    } else {
      line += '"", ';
      line += '"", ';
    };

    if (arrayOfJSON[i].coordinates != null) {
      line += '"' + arrayOfJSON[i].coordinates.coordinates[0] + '", ';
      line += '"' + arrayOfJSON[i].coordinates.coordinates[1] + '", ';
    } else {
      line += '"", ';
      line += '"", ';
    };
    line += '"' + arrayOfJSON[i].place.name + '"';

    fs.appendFile('tweets.csv', '\n' + line, function (err) {
      if (err) throw err;
    });
  };
};


var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});