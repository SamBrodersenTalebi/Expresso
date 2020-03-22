//import express and create instance of express router
const express = require('express');

//Need access about specified employees from timesheet router => need to merge paramters 
//Want to be able to access employeeId paramter
const menuItemRouter = express.Router({mergeParams: true});

//import sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

menuItemRouter.get('/', (req,res,next)=>{
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const values = {$menuId: req.params.menuId}
    db.all(sql, values, (error, rows)=>{
        if(error){
            next(error);
        } else{
            res.status(200).json({menuItems: rows})
        }
    })
});


module.exports = menuItemRouter;