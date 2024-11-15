const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {

   //GET THE TOKEN FROM THE HEADER ***
   const token = req.header('x-auth-token');
   
   //Check if no token
   if(!token) {
       return res.status(401).json({msg:'No token, authorization denied'});
   }

   //verify token (if it finds a token in header)
   //DECODE THE TOKEN ***** AND THEN ONCE DECODED, WE WILL USE THE REQ.USER THROUGHOUT OUR APPLICATION
   try {
    const decoded = jwt.verify(token,config.get('jwtSecretToken'));
    req.user = decoded.user;
    next();
   }
   catch(err) {
     res.status(401).json({msg:'Token is not valid'})
   }
}
