const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    Name:{ type: String, required: true},
    Symbol:{ type: String, required: true},
    Industry:{ type: String},
    Price:{ type: Number},
    RSI:{ type: Number},
    RVI:{ type: Number},
    PurchaseDate:{ type: String},
    Bought:{ type: Number},
    SharesPurchased:{ type: Number},
    SoldDate:{ type: String},
    Sold:{ type: Number},
    SharesSold:{ type: Number},
    Notes:{ type: String},

})

stockSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Stock',stockSchema);