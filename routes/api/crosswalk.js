const express = require('express');
const router = express.Router();
const CrossWalk = require('../../models/Crossalk');
const config = require('config')
const {check, validationResult} = require('express-validator');


router.get('/fetchCrosswalkRecords', async(req,res) => {
    try {
        const crossWalk = await CrossWalk.find();
        if(!crossWalk) {
            return res.status(404).json({msg:'crossWalk Record not found'});
        }
        res.json(crossWalk);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'crossWalk Record not found'});
        }
        res.status(500).send('Server error')
    }
});



router.post('/AddOrUpdateCrosswalkRecord',
    [check("EmployeeID").not().isEmpty(),
    check("SchoolName").not().isEmpty(),
    
    ], 
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return res.status(500).json({message: 'Failed to add a CrossWalk, missing required field information.'});
        }
    
    
            const {
                EmployeeID,
                Position,
                SchoolName,
                DateAdded,
              }  = req.body;
    
        let existingCrossWalk;
        try {
            existingCrossWalk = await CrossWalk.findOne({EmployeeID : EmployeeID});
    
        } catch (error) {
            return res.status(500).json({message: 'Issue verifying if existing CrossWalk exists' + error});
        }
       
        if(existingCrossWalk){
            return res.status(500).json({message: 'existingCrossWalk Record exists already..'});
        }
        
    
        const createdCrosswalk = new CrossWalk({
            EmployeeID,
            Position,
            SchoolName,
            DateAdded,  
        });
    
        
        await createdCrosswalk.save().then(() => {
            res.status(201).json({CrossWalk: createdCrosswalk.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up Crosswalk record. please try again: -' + error});
        });
    
        res.status(201);
    
});


module.exports = router;