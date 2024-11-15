const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeTableSchema = new Schema({
    EmployeeID:{ type: String, required: true},
    SchoolName:{ type: String , required: true},
    EmployeeName:{ type: String , required: true},
    Role:{ type: String , required: true},
    Position:{ type: String , required: true},
    CrossWalked:{ type: String , required: true},
    Certification:{ type: String},
})



module.exports = mongoose.model('EmployeeTable',EmployeeTableSchema);