const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    Title:{ type: String, required: true},
    Category:{ type: String, required: true},
    Note:{ type: String},
})

noteSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Note',noteSchema);