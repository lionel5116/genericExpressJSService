const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const config = require('config')
const {check, validationResult} = require('express-validator')

router.post('/createAppointment',
        [check("AppDate").not().isEmpty(),
        check("AppType").not().isEmpty(),
        check("ContactPerson").not().isEmpty(),
        ], 
        async (req,res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
             return res.status(500).json({message: 'Failed to add a client, missing required field information.'});
            }
        
                const {
                    AppDate,
                    AppType,
                    ContactPerson,
                    ContactPhone,
                    Status,
                    Location,
                    Cost,
                    Notes,
                  }  = req.body;
        
            let existingAppointment;
            try {
                existingAppointment = await Appointment.findOne({ContactPerson : ContactPerson});
        
            } catch (error) {
                return res.status(500).json({message: 'Issue verifying if appointment exists'});
            }
           
            if(existingAppointment){
                return res.status(500).json({message: 'Appointment Record exists already..'});
            }
            
        
            const createdAppointment = new Appointment({
                    AppDate,
                    AppType,
                    ContactPerson,
                    ContactPhone,
                    Status,
                    Location,
                    Cost,
                    Notes,
            });
        
            
            await createdAppointment.save().then(() => {
                res.status(201).json({appointment: createdAppointment.toObject({getters: true})});
            })
            .catch((error) => {
                return res.status(500).json({message: 'Failed add up Appointment record. please try again: -' + error});
            });
        
            res.status(201);
        
});

router.post('/searchAppointment', 
            async (req,res) => {
            
                    const {
                        id,
                        AppType,
                        Status,
                        ContactPerson,
                        SearchType
                    }  = req.body;
            
                let appointmentRecord;
      
                console.log(req.body)

             switch(SearchType){
                case 'id' :
                    try {
                        appointmentRecord = await Appointment.findById(id);
                        return res.status(200).json({appointment: appointmentRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                    break;
                case 'All':
                try {
                    appointmentRecord = await Appointment.find();
                    return res.status(200).json({ appointment: appointmentRecord });
                } catch (error) {
                    return res
                    .status(500)
                    .json({ message: 'No Records returned for your search' });
                }
                break;
                case 'AppType' :
                    try {
                        //multi-record returns are coded as below:
                        appointmentRecord = await Appointment.find({AppType : AppType});
                       return res.status(200).json({appointment: appointmentRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                    break;
                case 'Status' :
                    try {
                  
                        appointmentRecord = await Appointment.find({Status : Status});
                        return res.status(200).json({appointment: appointmentRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search' + error});
                    }
                    break;
                case 'ContactPerson' :
                    try {
                  
                        //single record returns are coded as below:
                        appointmentRecord = await Appointment.findOne({ContactPerson : ContactPerson});
                        return res.status(200).json({appointment: appointmentRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                    break;
                }

});

router.get('/:id', async(req,res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) {
            return res.status(404).json({msg:'appointment Record not found'});
        }
        res.json(appointment);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'appointment Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) {
            return res.status(404).json({msg:'appointment Record not found'});
        }
        await appointment.remove();
        res.json({msg:'appointment Record removed'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'appointment Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.put('/:id', async(req,res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) {
            return res.status(404).json({msg:'appointment Record not found'});
        }

        const {
            AppDate,
            AppType,
            ContactPerson,
            ContactPhone,
            Status,
            Location,
            Cost,
            Notes,
          }  = req.body;

        const updatedAppointmentRecord = {
            AppDate,
            AppType,
            ContactPerson,
            ContactPhone,
            Status,
            Location,
            Cost,
            Notes,
        }

        Object.assign(appointment,updatedAppointmentRecord);
        await appointment.save();
        return res.json({msg:'appointment Record Information Updated'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'appointment Record not found'});
        }
        res.status(500).send('Server error')
    }
});

module.exports = router;


