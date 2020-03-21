//import express and create instance of express router
const express = require('express');
const employeesRouter = express.Router();

//import sqlite3
const sqlite3 = require('sqlite3');

//check if process.env.TEST_DATABASE has been set, and if so load that database instead
//it will be used for testing
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

//add get handler
employeesRouter.get('/', (req, res, next)=>{
    db.all('SELECT * FROM Employee WHERE Employee.is_current_employee=1', (err,rows)=>{
        //check for error
        if(err){
            //pass it to the next middleware function which is the errorhandler
            next(err);
        }else{
            res.status(200).json({employees:rows});
        }
    })
})



//export employeeRouter
module.exports = employeesRouter;