var express = require('express');
var jade = require('jade');
var mongoose = require('mongoose');
var fs = require('fs');
var crypto = require('crypto');

mongoose.connect('mongodb://heroku_app5178075:33onkov0bfgofgp3qpuo4voi13@ds033887.mongolab.com:33887/heroku_app5178075');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CacheBit = mongoose.model('CacheBit', new Schema({
    bit: Boolean,
    timestamp: Number,
}));

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.send('Hello World!');
});

app.get('/user/friends/flip', function(request, response) {
    CacheBit.findOne({}, function(error, doc) {
        if (error || doc == null) {
            // Create the CacheBit
            doc = new CacheBit();
        }

        doc.timestamp = Math.round(new Date().getTime() / 1000.0);
        doc.bit = !doc.bit;

        doc.save();

        response.send(200);
    });
});

app.get('/user/1/friends', function(request, response) {
    response.contentType('application/json');

    var template;
    
    var response_callback = function(bit) {
        if (bit.bit) {
            template = 'views/friend.jade';
        } else {
            template = 'views/friend2.jade';
        }

        response.header('X-Partial-Generated', bit.timestamp)

        fs.readFile(template, 'ascii', function(error, data) {
            response.send({
                'html': jade.compile(data)(),
                'resources': [
                    {
                        'friend': 'Scott Ferguson',
                        'email': 'scott.ferguson@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('scott.ferguson@vokalinteractive.com').digest('hex'),
                    },
                    {
                        'friend': 'Bracken Spencer',
                        'email': 'bracken.spencer@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('bracken.spencer@vokalinteractive.com').digest('hex'),
                    },
                    {
                        'friend': 'Jaime Calder',
                        'email': 'jaime.calder@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('jaime.calder@vokalinteractive.com').digest('hex'),
                    },
                    {
                        'friend': 'Bill Best',
                        'email': 'bill.best@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('bill.best@vokalinteractive.com').digest('hex'),
                    },
                    {
                        'friend': 'Sean Wolter',
                        'email': 'sean.wolter@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('sean.wolter@vokalinteractive.com').digest('hex'),
                    },
                    {
                        'friend': 'Colin Young',
                        'email': 'colin.young@vokalinteractive.com',
                        'avatar_hash': crypto.createHash('md5').update('colin.young@vokalinteractive.com').digest('hex'),
                    },
                ],
            });
        });
    };

    CacheBit.findOne({}, function(error, doc) {
        if (error || doc == null) {
            // Create the CacheBit
            doc = new CacheBit();
            doc.timestamp = Math.round(new Date().getTime() / 1000.0);
            doc.bit = false;

            doc.save();
        }

        response_callback(doc);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
