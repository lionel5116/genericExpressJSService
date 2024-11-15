const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const crosswalkSchema = new Schema({
    EmployeeID:{ type: String, required: true},
    Position:{ type: String , required: true},
    SchoolName:{ type: String , required: true},
    DateAdded:{ type: String },
})


crosswalkSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CrossWalk',crosswalkSchema);