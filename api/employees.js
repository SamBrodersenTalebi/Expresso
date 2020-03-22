//import express and create instance of express router
const express = require('express');
const employeesRouter = express.Router();
const timesheetRouter = require('./timesheet.js')

//import sqlite3
const sqlite3 = require('sqlite3');

//check if process.env.TEST_DATABASE has been set, and if so load that database instead
//it will be used for testing
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

//Mount timesheetRouter at /:employeeId/timesheets
employeesRouter.use('/:employeeId/timesheets', timesheetRouter);

//router params
employeesRouter.param('employeeId',(req, res, next, employeeId)=>{
    db.get('SELECT * FROM Employee WHERE Employee.id=$employeeId',
    {
        $employeeId:employeeId
    },(error, employee)=>{
        if(error){
            next(error)
        }else if(employee){
            //attach to request object as employee
            req.employee = employee;
            //move on to next function 
            next();
        } else{
            res.sendStatus(404);
        }
    })
})

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

//post handler
employeesRouter.post('/', (req, res, next)=>{

    //select fields from req.body
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;

    //check if is current_employee is set to 1 if not do it!
    //Use ternary operator
    const isCurrentEmployee = req.body.isCurrentEmployee === 0 ? 0 : 1;

    if(!name || !position || !wage){
        res.sendStatus(400);
    }

    const sql = 'INSERT INTO Employee (name, position, wage, is_current_employee) VALUES($name, $position, $wage, $isCurrentEmployee)';
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee
    };
    //insert data into employee table
    db.run(sql, values, function(error){
        //pass potential error to errorhandler
        if(error){
            next(error);
        } else{
            //Select newly created row with this,lastID
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (error,row)=>{
                //send it in the response body with 201 status code
                res.status(201).json({employee:row});
            })
        }
    })
})

//get handler /api/employees/:employeeId
employeesRouter.get('/:employeeId', (req,res,next)=>{
    console.log(req.employee)
    //the router param handles error handling and receives the employee at req.employee
    res.status(200).json({employee:req.employee})
})

//put handler /api/employees/:employeeId
employeesRouter.put('/:employeeId', (req,res,next)=>{
    //select fields from req.body
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
        
    //check if is current_employee is set to 1 if not do it!
    //Use ternary operator
    const isCurrentEmployee = req.body.isCurrentEmployee === 0 ? 0 : 1;
    if(!name || !position || !wage){
        res.sendStatus(400);
    }
    const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $EmployeeId';
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee,
        $EmployeeId: req.params.employeeId
    };
    console.log(req.params.employeeId);

    db.run(sql, values, function(error){
        if(error){
            next(error)
        }else{
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (error,row)=>{
                console.log(row);
                res.status(200).json({employee:row});
            })
        }
    })
});

//delete handler /api/employees/:employeeId
employeesRouter.delete('/:employeeId', (req, res, next)=>{
    const sql = 'UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $EmployeeId';
    const values = {$EmployeeId: req.params.employeeId};
    db.run(sql, values, function(error){
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (error,row)=>{
                res.status(200).json({employee:row});
            })
        }
    })
});

//export employeeRouter
module.exports = employeesRouter;