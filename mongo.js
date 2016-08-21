var mongo = require('mongodb').MongoClient;

module.exports = {
    insertIfNew: function(url, next){
        mongo.connect('mongodb://localhost:27017/', function(err, db) {
            if (err) throw err;
            
            // check if exists in collection
            module.exports.getid(url, function(result){
                // if dne, insert
                if(result == undefined) {
                    getNextSequence('url_id', function(id) {
                        db.collection('urls').insert(
                            {
                                _id: id
                                , url: url
                            }
                            , function(err, data){
                                if (err) throw err;
                                db.close();
                                next();
                        });
                    }); 
                }
                else {
                    next();
                }
            });
        });
    },
    
    getid: function(url, next){
        mongo.connect('mongodb://localhost:27017/', function(err, db) { 
            if (err) throw err;
            // return info on this URL
            db.collection('urls').find({
                url: url
            }).toArray(function(err, find) {
                if (err) throw err;
                db.close();
                
                next(find[0]);
            });
        });
    }, 
    
    geturl: function(id, next){
        mongo.connect('mongodb://localhost:27017/', function(err, db) { 
            if (err) throw err;
            // return info on this URL
            db.collection('urls').find({
                _id: +id
            }).toArray(function(err, find) {
                if (err) throw err;
                db.close();
                next(find[0]);
            });
        });
    }
    
};

function getNextSequence(id, next) {
    mongo.connect('mongodb://localhost:27017/', function(err, db) {
        if (err) throw err;
        db.collection('counters').findAndModify(
            { _id: id },
            {},
            { $inc: { seq: 1 } },
            { new: true },
            function(err, result){
                if(err) throw err;
                db.close();
                next(result.value.seq);
            }
        );
        db.close();
    });
}