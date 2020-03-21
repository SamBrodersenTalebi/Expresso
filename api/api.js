//import express and create instance of express router called apiRouter
const express = require('express')
const apiRouter = express.Router()
//import employeesRouter 
const employeesRouter = require('./employees');

//mount it at /employees
apiRouter.use('/employees', employeesRouter)

module.exports = apiRouter