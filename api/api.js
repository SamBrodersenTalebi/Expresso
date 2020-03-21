//import express and create instance of express router called apiRouter
const express = require('express')
const apiRouter = express.Router()
//import employeeRouter 
const employeeRouter = require('./employee');

//mount it at /employee
apiRouter.use('/employee', employeeRouter)

module.exports = apiRouter