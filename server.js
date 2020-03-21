//import packages 
const bodyParser = require('body-parser');
var cors = require('cors');
const express = require('express');
var morgan = require('morgan');
var errorhandler = require('errorhandler');

//import router 
const apiRouter = require('./api/api');

//create instance of express app
const app = express();

//use middleware functions
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());

//mount router at all routes starting at '/api'
app.use('/api',apiRouter);

app.use(errorhandler());
//create PORT 
const PORT = process.env.PORT || 4000;

//Start server on port 
app.listen(PORT, ()=>{
    console.log(`Server is listening at port ${PORT}`);
});

//Export app used in test file
module.exports = app;