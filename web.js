var express = require('express');
var jade = require('jade');
var mongoose = require('mongoose');
var fs = require('fs');

mongoose.connect('mongodb://heroku_app5178075:33onkov0bfgofgp3qpuo4voi13@ds033887.mongolab.com:33887/heroku_app5178075');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Friend = new Schema({
    email  : ObjectId,
    avatar : String,
    name   : String,
});

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.send('Hello World!');
});

app.get('/user/1/friends', function(request, response) {
    response.contentType('application/json');
    response.header('Partial-Generated', Math.round(new Date().getTime() / 1000.0))

    fs.readFile('views/friend.jade', 'ascii', function(error, data) {
        response.send({
            'html': jade.compile(data)(),
            'friends': [
                {
                    'friend': 'Bob',
                    'email': 'bob@email.net',
                },
                {
                    'friend': 'Joe',
                    'email': 'joe@email.net',
                },
                {
                    'friend': 'Jim',
                    'email': 'jim@email.net',
                },
                {
                    'friend': 'Johnny',
                    'email': 'johnny@email.net',
                },
                {
                    'friend': 'Bruce',
                    'email': 'bruce@email.net',
                },
                {
                    'friend': 'Brucey',
                    'email': 'brucey@email.net',
                },
                {
                    'friend': 'Cassandra',
                    'email': 'cassandra@email.net',
                },
                {
                    'friend': 'Bill',
                    'email': 'bill@email.net',
                },
            ],
        });
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
