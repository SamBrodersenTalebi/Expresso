//import packages 
const bodyParser = require('body-parser');
var cors = require('cors');
const express = require('express');
var morgan = require('morgan');
var errorhandler = require('errorhandler');

//create instance of express app
const app = express();

//create PORT 
const PORT = process.env.PORT || 4000;

//Start server on port 
app.listen(PORT, ()=>{
    console.log(`Server is listening at port ${PORT}`);
});

//Export app used in test file
module.exports = app;