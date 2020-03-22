//import express and create instance of express router
const express = require('express');
const menuRouter = express.Router();

//import sqlite3
const sqlite3 = require('sqlite3');

//check if process.env.TEST_DATABASE has been set, and if so load that database instead
//it will be used for testing
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

menuRouter.get('/', (req,res,next)=>{
    const sql = 'SELECT * FROM Menu';
    db.all(sql, (error,rows)=>{
        if(error){
            next(error);
        } else{
            res.status(200).json({menus: rows})
        }
    })
});

module.exports = menuRouter;