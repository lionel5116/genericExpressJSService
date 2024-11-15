const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema( {
    AppDate:{ type: String, required: true},
    AppType:{ type: String, required: true},
    ContactPerson:{ type: String, required: true},
    ContactPhone:{ type: String, required: true},
    Status:{ type: String},
    Location:{ type: String},
    Cost:{ type: Number},
    Notes:{ type: String}
});

appointmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Appointment',appointmentSchema);