const express = require('express');
const router = express.Router();
const Stock = require('../../models/Stock');
const config = require('config');
const {check, validationResult} = require('express-validator');

router.post('/createStock',
       [check("Name").not().isEmpty(),
        check("Symbol").not().isEmpty(),
        check("Price").not().isEmpty(),
       ],
       async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({message: 'Failed to add a stock, missing required field information.'});
        }

        const {
            Name,
            Symbol,
            Industry,
            Price,
            RSI,
            RVI,
            PurchaseDate,
            Bought,
            SharesPurchased,
            SoldDate,
            Sold,
            SharesSold,
            Notes,
          }  = req.body;
          
       

       let existStock;
       try {
        existStock = await Stock.findOne({Symbol : Symbol});
   
       } catch (error) {
           return res.status(500).json({message: 'Issue verifying if stock exists'});
       }
      
       if(existStock){
           return res.status(500).json({message: 'stock Record exists already..'});
       }

       const createStock = new Stock({
        Name,
        Symbol,
        Industry,
        Price,
        RSI,
        RVI,
        PurchaseDate,
        Bought,
        SharesPurchased,
        SoldDate,
        Sold,
        SharesSold,
        Notes,
      });

      await createStock.save().then(() => {
        res.status(201).json({stock: createStock.toObject({getters: true})});
        })
        .catch((error) => {
            return res.status(500).json({message: 'Failed add up stock record. please try again: -' + error});
        });

    res.status(201);

   });

router.get('/:id', async(req,res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if(!stock) {
            return res.status(404).json({msg:'stock Record not found'});
        }
        res.json(stock);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'stock Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if(!stock) {
            return res.status(404).json({msg:'stock Record not found'});
        }
        await stock.remove();
        res.json({msg:'stock Record removed'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'stock Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.put('/:id', async(req,res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if(!stock) {
            return res.status(404).json({msg:'Asset Record not found'});
        }

        const {     
            Name,
            Symbol,
            Industry,
            Price,
            RSI,
            RVI,
            PurchaseDate,
            Bought,
            SharesPurchased,
            SoldDate,
            Sold,
            SharesSold,
            Notes,
        } = req.body;

        const updatedStockRecord = {
            Name,
            Symbol,
            Industry,
            Price,
            RSI,
            RVI,
            PurchaseDate,
            Bought,
            SharesPurchased,
            SoldDate,
            Sold,
            SharesSold,
            Notes,
        }

        Object.assign(stock,updatedStockRecord);
      
        await stock.save();
        return res.json({msg:'stock Record Information Updated'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'stock Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.post('/searchStock', 
            async (req,res) => {
            
                const {
                    id,
                    Name,
                    Symbol,
                    Industry,
                    SearchType
                  }  = req.body;
            
                let assetRecord


             switch(SearchType){
                case 'id' :
                    try {
                        stockRecord = await Stock.findById(id);
                        return res.status(200).json({stock: stockRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                case 'Symbol' :
                        try {
                            stockRecord = await Stock.findOne({Symbol : Symbol});
                            return res.status(200).json({stock: stockRecord.toObject({getters: true})});
                    
                        } catch (error) {
                            return res.status(500).json({message: 'No Records returned for your search'});
                        }
                case 'Name' :
                    try {
                  
                        stockRecord = await Stock.findOne({Name : Name});
                        return res.status(200).json({stock: stockRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search' + error});
                    }
                    break;
                case 'All' :
                        try {
                      
                            stockRecord = await Stock.find();
                            return res.status(200).json({stock: stockRecord})
                    
                        } catch (error) {
                            return res.status(500).json({message: 'No Records returned for your search' + error});
                        }
                        break;
                case 'Industry' :
                            try {
                          
                                stockRecord = await Stock.find({Industry : Industry});
                                return res.status(200).json({stock: stockRecord})
                        
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