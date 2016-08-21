var mongo = require('mongodb').MongoClient;

//counters for id numbers
mongo.connect('mongodb://localhost:27017/', function(err, db) {
    if (err) throw err;
    
    // clear existing data
    db.collection('counters').remove({});
    db.collection('urls').remove({});
    
    // create counters for sequencing ids
    db.collection('counters').insert(
       {
          _id: 'url_id',
          seq: 0
       }
    );
    
    db.close();
});