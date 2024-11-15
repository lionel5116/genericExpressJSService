const express = require('express');
const router = express.Router();
const Asset = require('../../models/Asset');
const config = require('config')
const {check, validationResult} = require('express-validator')

router.post('/createAsset',
       [check("Name").not().isEmpty(),
        check("Type").not().isEmpty(),
        check("Balance").not().isEmpty(),
       ],
       async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({message: 'Failed to add a asset, missing required field information.'});
        }

        const {
            Name,
            Type,
            Location,
            Balance,
            ABANumber,
            Notes
          }  = req.body;
          
       

       let existAsset;
       try {
            existAsset = await Asset.findOne({Name : Name});
   
       } catch (error) {
           return res.status(500).json({message: 'Issue verifying if asset exists'});
       }
      
       if(existAsset){
           return res.status(500).json({message: 'Asset Record exists already..'});
       }

       const createAsset = new Asset({
        Name,
        Type,
        Location,
        Balance,
        ABANumber,
        Notes
      });

      await createAsset.save().then(() => {
        res.status(201).json({Asset: createAsset.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up Asset record. please try again: -' + error});
        });

    res.status(201);

   });

   router.get('/:id', async(req,res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if(!asset) {
            return res.status(404).json({msg:'Asset Record not found'});
        }
        res.json(asset);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Asset Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if(!asset) {
            return res.status(404).json({msg:'Asset Record not found'});
        }
        await asset.remove();
        res.json({msg:'Asset Record removed'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Asset Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.put('/:id', async(req,res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if(!asset) {
            return res.status(404).json({msg:'Asset Record not found'});
        }

        const {
            Name,
            Type,
            Location,
            Balance,
            ABANumber,
            Notes
        } = req.body;

        const updatedAssetRecord = {
            Name,
            Type,
            Location,
            Balance,
            ABANumber,
            Notes
        }

        Object.assign(asset,updatedAssetRecord);
      
        await asset.save();
        return res.json({msg:'Asset Record Information Updated'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Asset Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.post('/searchAsset', 
            async (req,res) => {
            
                const {
                    id,
                    SearchType,
                    Type
                  }  = req.body;
            
                let assetRecord


             switch(SearchType){
                case 'id' :
                    try {
                        assetRecord = await Asset.findById(id);
                        return res.status(200).json({asset: assetRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                case 'Type' :
                    try {
                  
                        assetRecord = await Asset.find({Type : Type});
                        return res.status(200).json({asset: assetRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search' + error});
                    }
                    break;
                case 'All' :
                        try {
                      
                            assetRecord = await Asset.find();
                            return res.status(200).json({asset: assetRecord})
                    
                        } catch (error) {
                            return res.status(500).json({message: 'No Records returned for your search' + error});
                        }
                        break;
                 default:
                    return res.status(500).json({message: 'No Records returned for your search'});
                    break;
                }

});


       module.exports = router;
