const express = require('express');
const router = express.Router();
const Notes = require('../../models/Notes');
const {check, validationResult} = require('express-validator');


router.post('/createNote',
        [check("Title").not().isEmpty(),
        check("Category").not().isEmpty(),
        check("Note").not().isEmpty(),
        ], 
        async (req,res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
             return res.status(500).json({message: 'Failed to add a note, missing required field information.'});
            }
        
        
                const {
                    Title,
                    Category,
                    Note,
                  }  = req.body;
        
            let existingNote;
            try {
                existingNote = await Notes.findOne({Title : Title});
        
            } catch (error) {
                return res.status(500).json({message: 'Issue verifying if note exists' + error});
            }
           
            if(existingNote){
                return res.status(500).json({message: 'note Record exists already..'});
            }
            
        
            const createdNote = new Notes({
                Title,
                Category,
                Note,
               
            });
        
            
            await createdNote.save().then(() => {
                res.status(201).json({note: createdNote.toObject({getters: true})});
            })
            .catch((error) => {
                return res.status(500).json({message: 'Failed add up note record. please try again: -' + error});
            });
        
            res.status(201);
        
});

router.post('/searchNoteRecord', 
            async (req,res) => {
            
                    const {
                        id,
                        Title,
                        Category,
                        SearchType
                    }  = req.body;
            
                let clientRecord;


             switch(SearchType){
                case 'id':
                    try {
                        noteRecord = await Notes.findById(id);
                        return res.status(200).json({note: noteRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                break;
                case 'Title' :
                    try {
                        noteRecord = await Notes.findOne({Title : Title});
                        return res.status(200).json({note: noteRecord.toObject({getters: true})});
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search'});
                    }
                case 'Category' :
                    try {
                  
                        noteRecord = await Notes.find({Category : Category}).sort({Title :1});
                        return res.status(200).json({note: noteRecord})
                
                    } catch (error) {
                        return res.status(500).json({message: 'No Records returned for your search' + error});
                    }
                    break;
                case 'All' :
                        try {
                      
                            noteRecord = await Notes.find();
                            return res.status(200).json({note: noteRecord})
                    
                        } catch (error) {
                            return res.status(500).json({message: 'No Records returned for your search' + error});
                        }
                        break;
              default :
                return res.status(500).json({message: 'No Records returned for your search' + error});
                    break;
                }

});

router.get('/:id', async(req,res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if(!note) {
            return res.status(404).json({msg:'Note Record not found'});
        }
        res.json(note);
    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'Note Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if(!note) {
            return res.status(404).json({msg:'note Record not found'});
        }
        await note.remove();
        res.json({msg:'note Record removed'});

    } catch (err) {
        console.log(err.message);
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'note Record not found'});
        }
        res.status(500).send('Server error')
    }
});

router.put('/:id', async(req,res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if(!note) {
            return res.status(404).json({msg:'note Record not found'});
        }

        const {     
            Title,
            Category,
            Note,
        } = req.body;

        const updatedNoteRecord = {
            Title,
            Category,
            Note,
        }

        Object.assign(note,updatedNoteRecord);
      
        await note.save();
        return res.json({msg:'note Record Information Updated'});

    } catch (err) {
        console.log(err.message);
        /*
        if(err.kind =='ObjectId') {
            return res.status(404).json({msg:'note Record not found'});
        }
        */
        res.status(500).send('Server error')
    }
});

module.exports = router;

