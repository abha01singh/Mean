var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// configuration =================

mongoose.connect('mongodb://localhost/meandb'); // connect to mongoDB database on modulus.io

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride());

app.use(express.static(__dirname + '/public'));


// define model =================
var User = mongoose.model('User', {
    firstName: String,
    lastName: String,
    address: String,
    number: Number
});

app.get('/api/users', function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.post('/api/users', function(req, res) {
    //save user
    var user = new User(req.body);
    user.save(function(err) {
        if (err)
            res.send(err);
        User.find(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });
    //create user
    // User.create({ "firstName": req.body.firstName, "lastName": req.body.lastName }, function(err, user) {
    //     if (err)
    //         res.send(err);
    //     res.json(user);
    // });

    // User.insert({ "firstName": req.body.firstName, "lastName": req.body.lastName ,"_id": "595dcf4a819caaa42a000001"}, function(err, user) {
    //     if (err)
    //         res.send(err);
    //     res.json(user);
    // });
});


app.delete('/api/user/:userId', function(req, res) {
    User.remove({
        _id: req.params.userId
    }, function(err, user) {
        if (err)
            res.send(err);
        User.find(function(err, users) {
            if (err)
                res.send(err)
            res.json(users);
        });
    });
});

app.put('/api/user/:userId', function(req, res) {
    var newUser = req.body;
    User.update({
        _id: req.params.userId
    }, { $set: newUser }, function(err, user) {
        if (err)
            res.send(err);
        res.json(user)
    });
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
