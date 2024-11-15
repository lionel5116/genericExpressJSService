const express = require('express');
const router = express.Router();
const EmployeeTable = require('../../models/EmployeeTable');
const config = require('config')
const {check, validationResult} = require('express-validator');


router.get('/fetchAllEmployees', async(req,res) => {
    try {
        const employeetable = await EmployeeTable.find();
        if(!employeetable) {
            return res.status(404).json({msg:'Employee Record not found'});
        }
        res.json(employeetable);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Employee Record not found'});
        }
        res.status(500).send('Server error')
    }
});



router.post('/createEmployee',
    [check("EmployeeID").not().isEmpty(),
    check("SchoolName").not().isEmpty(),
    
    ], 
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return res.status(500).json({message: 'Failed to add a employee, missing required field information.'});
        }
    
    
            const {
                EmployeeID,
                SchoolName,
                EmployeeName,
                Role,
                Certification,
              }  = req.body;
    
        let existingEmployeeTable;
        try {
            existingEmployeeTable = await EmployeeTable.findOne({EmployeeID : EmployeeID});
    
        } catch (error) {
            return res.status(500).json({message: 'Issue verifying if employee exists' + error});
        }
       
        if(existingEmployeeTable){
            return res.status(500).json({message: 'Employee Record exists already..'});
        }
        
    
        const createdEmployee = new EmployeeTable({
            EmployeeID,
            SchoolName,
            EmployeeName,
            Role,
            Certification,   
        });
    
        
        await createdEmployee.save().then(() => {
            res.status(201).json({EmployeeTable: createdEmployee.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up Employee record. please try again: -' + error});
        });
    
        res.status(201);
    
});


module.exports = router;