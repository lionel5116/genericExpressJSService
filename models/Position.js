const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
    PositionName:{ type: String , required: true},
})


PositionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Position',PositionSchema);