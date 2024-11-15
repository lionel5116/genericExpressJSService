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

router.get('/fetchEmployeeDataBySchoolName/:SchoolName', async(req,res) => {
    try {
        const employeetable = await EmployeeTable.find({SchoolName:req.params.SchoolName});
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


router.get('/:id', async (req, res) => {
    try {
      const travel = await Travel.findById(req.params.id);
      if (!travel) {
        return res.status(404).json({ msg: 'Travel Record not found' });
      }
      res.json(travel);
    } catch (err) {
      console.log(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(404).json({ msg: 'Travel Record not found' });
      }
      res.status(500).send('Server error');
    }
  });

router.post('/searchTravelRecord', async (req, res) => {
    const { All, BookingCode, Airline, APCode, Year, Status, SearchType } =
      req.body;
  
    let clientRecord;
  
    switch (SearchType) {
      case 'All':
        try {
          travelRecord = await Travel.find();
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      case 'BookingCode':
        try {
          travelRecord = await Travel.findOne({ BookingCode: BookingCode });
          return res
            .status(200)
            .json({ travel: travelRecord.toObject({ getters: true }) });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      case 'Airline':
        try {
          travelRecord = await Travel.find({ Airline: Airline });
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' + error });
        }
        break;
      case 'APCode':
        try {
          travelRecord = await Travel.find({ APCode: APCode });
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      case 'Status':
        try {
          travelRecord = await Travel.find({ Status: Status });
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      case 'Year':
        try {
          travelRecord = await Travel.find({ Year: Year });
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      case 'Status':
        try {
          travelRecord = await Travel.find({ Status: Status });
          return res.status(200).json({ travel: travelRecord });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'No Records returned for your search' });
        }
        break;
      default:
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
    }
  });

//fetchEmployeeDataBySchoolName

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
                Position,
                CrossWalked,
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
            Position,
            CrossWalked,
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