var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Cart = require('./app/models/Cart');
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

var router = express.Router();



router.route('/carts')
    .post(function(req, res) {
        var cart = new Cart();
        cart.name = req.body.name;
        cart.price = req.body.price;

        cart.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item added to cart' });
        });
    })
    .get(function(req, res) {
        Cart.find(function(err, carts) {
            if (err)
                res.send(err);

            res.json(carts);
        });
    });

router.route('/carts/:item_id')
    .get(function(req, res) {
        Cart.findById(req.params.item_id, function(err, Cart) {
            if (err)
                res.send(err);
            res.json(Cart);
        });
    })
    .put(function(req, res) {
        Cart.findById(req.params.item_id, function(err, cart) {

            if (err)
                res.send(err);

            cart.name = req.body.name;
            cart.price = req.body.price;

           
            cart.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Cart updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Cart.remove({
            _id: req.params.item_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);


var port = process.env.PORT || 8080;



app.listen(port);
