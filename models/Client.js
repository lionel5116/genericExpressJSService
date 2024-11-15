const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


const clientSchema = new Schema({
    ClientCode:{ type: String, required: true},
    LastName:{ type: String , required: true},
    FirstName:{ type: String , required: true},
    Address:{ type: String},
    City:{ type: String},
    State:{ type: String},
    Zip:{ type: String},
    Phone:{ type: String},
    Phone2:{ type: String},
    Cell:{ type: String},
    Email:{ type: String},
    Notes:{ type: String}
});

clientSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Client',clientSchema);
