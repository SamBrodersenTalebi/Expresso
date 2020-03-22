//import express and create instance of express router
const express = require('express');

//Need access about specified employees from timesheet router => need to merge paramters 
//Want to be able to access employeeId paramter
const timesheetRouter = express.Router({mergeParams: true});

//import sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

//router params
timesheetRouter.param('timesheetId',(req, res, next, timesheetId)=>{
    db.get('SELECT * FROM Timesheet WHERE Timesheet.id=$timesheetId',
    {
        $timesheetId:timesheetId
    },(error, timesheet)=>{
        if(error){
            next(error)
        }else if(timesheet){
            //attach to request object as employee
            req.timesheet = timesheet;
            //move on to next function 
            next();
        } else{
            res.sendStatus(404);
        }
    })
})

timesheetRouter.get('/', (req, res, next)=>{
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId';
    //have access to employeeId as we merged params
    const values = {$employeeId: req.params.employeeId};
    db.all(sql, values, (error, rows)=>{
        if(error){
            next(error);
        }else{
            res.status(200).json({timesheets: rows});
        }
    })
})


//post handler /
timesheetRouter.post('/', (req, res, next)=>{
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    if(!hours || !rate || !date){
        return res.sendStatus(400);
    }
    const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id)' +
    'VALUES ($hours, $rate, $date, $employeeId)';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: employeeId
    };
    db.run(sql, values, function(error){
        if(error){
            next(error);
        }else{
            //Select newly created row with this,lastID
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (error,row)=>{
                //send it in the response body with 201 status code
                res.status(201).json({timesheet:row});
            })
        }
    })
});

timesheetRouter.put('/:timesheetId', (req, res, next)=>{
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    if(!hours || !rate || !date){
        return res.sendStatus(400);
    }

    const sql = 'UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: employeeId,
        $timesheetId: req.params.timesheetId
    };
    db.run(sql, values, function(error){
        if(error){
            next(error)
        } else{
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`, (error,row)=>{
                if(error){
                    next(error);
                } else{
                    res.status(200).json({timesheet:row});
                }
            })
        }
    })
});





module.exports = timesheetRouter;