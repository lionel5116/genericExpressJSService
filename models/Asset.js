const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
    Name:{ type: String, required: true},
    Type:{ type: String , required: true},
    Location:{ type: String},
    Balance:{ type: Number , required: true},
    ABANumber:{ type: String},
    Notes:{ type: String},
})


assetSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Asset',assetSchema);