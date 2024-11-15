const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const schoolListSchema = new Schema({
    EducationOrgNaturalKey:{ type: String, required: true},
    NameOfInstitution:{ type: String , required: true},
})


schoolListSchema.plugin(uniqueValidator);
module.exports = mongoose.model('School',schoolListSchema);