const express = require('express');
const router = express.Router();
const Position = require('../../models/Position');
const config = require('config')
const {check, validationResult} = require('express-validator');


router.get('/fetchPositions', async(req,res) => {
    try {
        const position = await Position.find();
        if(!position) {
            return res.status(404).json({msg:'Position Record not found'});
        }
        res.json(position);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Position Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.post('/createsPosition',
    [check("PositionName").not().isEmpty(),
    
    
    ], 
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return res.status(500).json({message: 'Failed to add a Position, missing required field information.'});
        }
    
    
            const {
                PositionName,
              }  = req.body;
    
        let existingPosition;
        try {
            existingPosition = await Position.findOne({PositionName : PositionName});
    
        } catch (error) {
            return res.status(500).json({message: 'Issue verifying if Position exists' + error});
        }
       
        if(existingPosition){
            return res.status(500).json({message: 'Position Record exists already..'});
        }
        
    
        const createdPosition = new Position({
            PositionName,
        });
    
        
        await createdPosition.save().then(() => {
            res.status(201).json({Position: createdPosition.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up Position record. please try again: -' + error});
        });
    
        res.status(201);
    
});


module.exports = router;