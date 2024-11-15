const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const path =require('path')

const app = express();

//Connect to Database
connectDB();

//Init Middleware
//https://stackoverflow.com/questions/59997685/postman-can-not-read-request-body
app.use(express.json({extended: false}));

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
  }));

app.get('/',(req,res) => res.send('API SERVICE IS RUNNING!!'));

//define Routes - PORT 5500 *

//http://localhost:5500/api/users
app.use('/api/users', require('./routes/api/users'));
//http://localhost:5000/api/auth
app.use('/api/auth', require('./routes/api/auth'));
//http://localhost:5000/api/asset
app.use('/api/asset', require('./routes/api/asset'));
//http://localhost:5000/api/travel
app.use('/api/travel', require('./routes/api/travel'));
//http://localhost:5000/api/client
app.use('/api/client', require('./routes/api/client'));
//http://localhost:5000/api/stock
app.use('/api/stock', require('./routes/api/stock'));
//http://localhost:5000/api/note
app.use('/api/note', require('./routes/api/note'));
//http://localhost:5000/api/appointment
app.use('/api/appointment', require('./routes/api/appointment'));


//for crosswalk

//http://localhost:5500/api/school
app.use('/api/school', require('./routes/api/school'));
app.use('/api/employeetable', require('./routes/api/employeetable'));
app.use('/api/position', require('./routes/api/position'));
app.use('/api/crosswalk', require('./routes/api/crosswalk'));


/*
//Server static assets in production
if(process.env.NODE_ENV === 'production')
{
    //Set static folder (our public folder)
    app.use(express.static('client/dist'));
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','dist','index.html')); 
    })

}
*/

//HEROKU LOOKS AT THE porcess.env.PORT
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));