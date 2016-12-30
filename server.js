var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cartRouter = require('./app/routers/cartRoutes');
require('dotenv').config();

var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
};


mongoose.connect(process.env.MLAB_URL, options);

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
    console.log("connection opened");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function(req, res) {
    res.send("Root Working fine");
});

app.use('/api/carts', cartRouter());


var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log("Server Running on " + port);
});
