const express = require('express');
const router = express.Router();
const Client = require('../../models/Client');
const config = require('config')
const {check, validationResult} = require('express-validator')


router.post('/createClientRecord',
        [check("ClientCode").not().isEmpty(),
        check("Email").normalizeEmail().isEmail(),
        check("LastName").not().isEmpty(),
        check("FirstName").not().isEmpty(),
        ], 
        async (req,res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
             return res.status(500).json({message: 'Failed to add a client, missing required field information.'});
            }
        
        
                const {
                    ClientCode,
                    LastName,
                    FirstName,
                    Address,
                    City,
                    State,
                    Zip,
                    Phone,
                    Phone2,
                    Cell,
                    Notes,
                    Email,
                  }  = req.body;
        
            let existingUser;
            try {
                existingUser = await Client.findOne({Email : Email});
        
            } catch (error) {
                return res.status(500).json({message: 'Issue verifying if user exists'});
            }
           
            if(existingUser){
                return res.status(500).json({message: 'Client Record exists already..'});
            }
            
        
            const createdClient = new Client({
                ClientCode,
                LastName,
                FirstName,
                Address,
                City,
                State,
                Zip,
                Phone,
                Phone2,
                Cell,
                Notes,
                Email,
            });
        
            
            await createdClient.save().then(() => {
                res.status(201).json({client: createdClient.toObject({getters: true})});
            })
            .catch((error) => {
                return res.status(500).json({message: 'Failed add up client record. please try again: -' + error});
            });
        
            res.status(201);
        
});

router.post('/searchClientRecord', 
            async (req,res) => {
            
                    const {
                        ClientCode,
                        LastName,
                        FirstName,
                        SearchType
                    }  = req.body;
            
                let clientRecord;


             switch(SearchType){
                case 'All':
                try {
                    clientRecord = await Client.find();
                    return res.status(200).json({ client: clientRecord });
                } catch (error) {
                    return res
                    .status(500)
                    .json({ message: 'No Records returned for your search' });
                }
                break;
                case 'ClientCode' :
                    try {
                        clientRecord = await Client.findOne({ClientCode : ClientCode});
                        return res.status(200).json({client: clientRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                case 'LastName' :
                    try {
                  
                         clientRecord = await Client.find({LastName : LastName});
                        //return res.status(200).json({client: clientRecord.toObject({getters: true})});
                        //toObject cannot be used with find
                        return res.status(200).json({client: clientRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search' + error});
                    }
                    break;
                case 'FirstName' :
                    try {
                  
                        clientRecord = await Client.find({FirstName : FirstName});
                        return res.status(200).json({client: clientRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                    break;
                }

});

router.get('/:id', async(req,res) => {
            try {
                const client = await Client.findById(req.params.id);
                if(!client) {
                    return res.status(404).json({msg:'Client Record not found'});
                }
                res.json(client);
            } catch (err) {
                console.log(err.message);
                if(err.kind =='ObjectId') {
                    return res.status(404).json({msg:'Client Record not found'});
                }
                res.status(500).send('Server error')
            }
})

router.delete('/:id', async(req,res) => {
            try {
                const client = await Client.findById(req.params.id);
                if(!client) {
                    return res.status(404).json({msg:'Client Record not found'});
                }
                await client.remove();
                res.json({msg:'Client Record removed'});

            } catch (err) {
                console.log(err.message);
                if(err.kind =='ObjectId') {
                    return res.status(404).json({msg:'Client Record not found'});
                }
                res.status(500).send('Server error')
            }
})

router.put('/:id', async(req,res) => {
            try {
                const client = await Client.findById(req.params.id);
                if(!client) {
                    return res.status(404).json({msg:'Client Record not found'});
                }

                const {
                    ClientCode,
                    LastName,
                    FirstName,
                    Address,
                    City,
                    State,
                    Zip,
                    Phone,
                    Phone2,
                    Cell,
                    Notes,
                    Email,
                } = req.body;

                const updatedClientRecord = {
                    ClientCode,
                    LastName,
                    FirstName,
                    Address,
                    City,
                    State,
                    Zip,
                    Phone,
                    Phone2,
                    Cell,
                    Notes,
                    Email,
                }

                Object.assign(client,updatedClientRecord);
                //res.send({client: req.body})
                await client.save();
                return res.json({msg:'Client Record Information Updated'});

            } catch (err) {
                console.log(err.message);
                if(err.kind =='ObjectId') {
                    return res.status(404).json({msg:'Client Record not found'});
                }
                res.status(500).send('Server error')
            }
})

      


module.exports = router;