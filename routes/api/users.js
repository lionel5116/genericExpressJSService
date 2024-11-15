const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

//app.use(express.json({extended: false}));  -- make sure that this is added to your server.js file

const {check, validationResult} = require('express-validator')
const User = require('../../models/User')

//@route POST api/users
//@ desc  Regiter User
//@access Public
router.post('/', [
     check('name','Name is required')
     .not()
     .isEmpty(),
     check('email','Please include a valid email').isEmail(),
     check(
        'password',
        'Please enter a password with 6 or more characters')
        .isLength({min:6})

],
 async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // a return to get rid of the Server.Response Headers already sent error
        return res.status(400).json({errors:errors.array()});
    }
  

   const {name,email,password} = req.body;

    try {

        //See if user Exists
        let user = await User.findOne({email});  //do a mongodb search query on email address a the filter
        if(user) {
            return res.status(400).json({errors:[{msg:'User already exits'}]});
        }
    
        //Get users gravatar (image avator)
        //s = size
        //r = rating
        //m = gives you a default image
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
    
        //create new instance user (from line 35 let user =)
        //the values we are passing to the new user instance are comming from our request body (line 30)
        //the avatar value is coming from from line 44
        //you can check these by right-clicking and selecting find reference
        user = new User({
            name,
            email,
            avatar,
            password
        });
    
       //Encrypt password
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password,salt);
    
        //save user to your database
        await user.save();
    
     
        //Return jsonwebtoken.. WE ARE SIGNING OUR TOKEN PASSING IN OUR ID FROM OUR USER RECORD IN MONGO DB
        //create the payload to send to the jwt wire-up
        //grab the id returned from the instered record _id = id (mongoose allows you to leave the _ off of the _id field)
        const payload   = {
            user: {
              id: user.id,
            }
        } 
    
        //AFTER WE SIGN, WE SEND THE JWT TOKEN BACK AS A RESPONSE
        jwt.sign(
              payload,
              config.get('jwtSecretToken'),
              {expiresIn:'24h'},
              (err, token) => {
                 if(err) throw err;
                   res.json({token}) //AFTER WE SIGN, WE SEND THE JWT TOKEN BACK AS A RESPONSE
              }
            );
        
    
       }
       catch (err){
          console.error(err.message);
          res.status(500).send("Server error")
       }
   
   

});

module.exports = router;
