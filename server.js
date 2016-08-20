var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'static')));

// home page
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

// redirect for valid short urls

// create new short url

app.listen(process.env.PORT || 8080);