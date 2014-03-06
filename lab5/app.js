var fs = require('fs');
var express = require('express');
var app = express();

// app.get('/hello.txt', function(req, res){
//   var body = 'Hello World';
//   res.setHeader('Content-Type', 'text/plain');
//   res.setHeader('Content-Length', Buffer.byteLength(body));
//   res.end(body);
// });

fs.writeFile('message.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

// app.listen(3000);
// console.log('Listening on port 3000');