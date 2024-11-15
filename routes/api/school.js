const express = require('express');
const router = express.Router();
const School = require('../../models/School');
const config = require('config')
const {check, validationResult} = require('express-validator');


router.get('/fetchSchoolListings', async(req,res) => {
    try {
        const school = await School.find();
        if(!school) {
            return res.status(404).json({msg:'school Record not found'});
        }
        res.json(school);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'school Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.post('/createschool',
    [check("EducationOrgNaturalKey").not().isEmpty(),
    check("NameOfInstitution").not().isEmpty(),
    
    ], 
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return res.status(500).json({message: 'Failed to add a school, missing required field information.'});
        }
    
    
            const {
                EducationOrgNaturalKey,
                NameOfInstitution,
              }  = req.body;
    
        let existingSchool;
        try {
            existingSchool = await School.findOne({EducationOrgNaturalKey : EducationOrgNaturalKey});
    
        } catch (error) {
            return res.status(500).json({message: 'Issue verifying if school exists' + error});
        }
       
        if(existingSchool){
            return res.status(500).json({message: 'School Record exists already..'});
        }
        
    
        const createdSchool = new School({
            EducationOrgNaturalKey,
            NameOfInstitution,   
        });
    
        
        await createdSchool.save().then(() => {
            res.status(201).json({School: createdSchool.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up School record. please try again: -' + error});
        });
    
        res.status(201);
    
});


module.exports = router;