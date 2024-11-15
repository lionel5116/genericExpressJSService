const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator')

//@route GET api/auth
//http://localhost:5000/api/auth
//@ desc  Test route
//@access private/protected ****
router.get('/', auth, async (req,res) => {
    try {
     const user = await User.findById(req.user.id).select('-password');
     res.json(user)
    }
    catch(err){
    console.err(err.message);
     res.status(500).send('Server error!!!!')
    }
  });

 //@route POST api/auth
//@ desc Authenticate User & get token
//http://localhost:5000/api/auth
//@access Public
router.post('/', [
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()

],
 async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
   
    const { email, password} = req.body;

   try {

    //See if user Exists , search by email
    let user = await User.findOne({email});  
    if(!user) {
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }

    //match the password (decrypt the password and match it up against what's enterd in request body)
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) {
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }
   
    //we grab the userID from the MongoDB user to sign with a new token
    const payload   = {
        user: {
          id: user.id,
        }
    } 

    //sign and create a new token with the user found
    jwt.sign(
          payload,
          config.get('jwtSecretToken'),
          {expiresIn:'24h'},
          (err, token) => {
             if(err) throw err;
               res.json({token})
          }
        );

   }
   catch (err){
      console.error(err.message);
      res.status(500).send("Server error")
   }

});




module.exports = router;