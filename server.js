var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cartRouter = require('./app/routers/cartRoutes');
var jwt = require('jsonwebtoken');
//var authRouter = require('./app/routers/authRoutes');
var User = require('./app/models/User');
var helmet = require('helmet')
var apiRoutes = express.Router();
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
app.use(helmet());

app.get('/', function(req, res) {
    res.send("Root Working fine");
});

// app.post('/api/addUser',function(req,res){
// 	var user = new User({ 
//     name: 'Rajesh', 
//     password: 'password',
//     admin: true 
//   });

// 	user.save(function(err){
// 		if (err) throw err;

//     	console.log('User saved successfully');
//     	res.json({ success: true });
// 	})

// });

app.post('/api/authenticate', function(req, res) {
    User.findOne({ name: req.body.name }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                var token = jwt.sign(user, process.env.KEY, {
                    expiresIn: 18000 // expires in 60*5 minute
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    })
});


apiRoutes.use(function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {

        jwt.verify(token, process.env.KEY, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

//Order is important to bypass/api/authenticate from token
app.use('/api', apiRoutes);
//app.use('/api/authenticate', userRouter(apiRoutes));
app.use('/api/carts', cartRouter(apiRoutes));


var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log("Server Running on " + port);
});
