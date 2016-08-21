var express = require('express');
var app = express();
var path = require('path');
var validUrl = require('valid-url');
var mongo = require('./mongo');

app.use(express.static(path.join(__dirname, 'static')));

// home page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// redirect for valid short urls
app.get('/:id', function(req, res) {
    var id = req.params.id;
    if(parseInt(id, 10)) {
        mongo.geturl(id, function(result){
            if (result != undefined){
                res.redirect(result.url);
            }
        });
    }
    else {
        res.send("This is not a valid shortened url");
    }
});

// create new short url
app.get('/new/:url*', function(req, res) {
    var original = req.originalUrl;
    var url = original.split('/new/')[1];
    if(!validUrl.isUri(url)){
        res.send("Invalid url format: '" + url + "'. Please try again and make sure to include a valid protocol.");
    } else
    {
        // insert this data into mongo if does not exist
        mongo.insertIfNew(url, function(){
            // grab the id to return to user
            mongo.getid(url, function(result){
                var domain = req.headers.host;
                res.send(JSON.stringify({
                    original_url: result.url
                    , short_url: 'https://' + domain + '/' + result._id
                }));
            });
        });
    }
});

app.listen(process.env.PORT || 8080);