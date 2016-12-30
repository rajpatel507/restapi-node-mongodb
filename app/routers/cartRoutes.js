var express = require('express');
var Cart = require('../models/Cart');

var routes = function() {
    var cartRouter = express.Router();

    cartRouter.route('/')
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

    cartRouter.route('/:item_id')
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
    return cartRouter;
};

module.exports = routes;
