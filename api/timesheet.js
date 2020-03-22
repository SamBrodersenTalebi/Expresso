//import express and create instance of express router
const express = require('express');

//Need access about specified employees from timesheet router => need to merge paramters 
//Want to be able to access employeeId paramter
const timesheetRouter = express.Router({mergeParams: true});

//import sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')




module.exports = timesheetRouter;