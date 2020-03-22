//import express and create instance of express router called apiRouter
const express = require('express')
const apiRouter = express.Router()
//import employeesRouter 
const employeesRouter = require('./employees');
//import menuRouter
const menuRouter = require('./menu.js');

//mount it at /employees
apiRouter.use('/employees', employeesRouter)

//mount menuRouter at /menus
apiRouter.use('/menus', menuRouter);


module.exports = apiRouter