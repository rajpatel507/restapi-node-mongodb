var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CartSchema   = new Schema({
    name: String,
    price: Number
});

module.exports = mongoose.model('Cart', CartSchema);