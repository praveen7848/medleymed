module.exports = app =>{
const modulecontrollers = require('../controllers/modulecontrollers_tbl_controller')
var router = require('express').Router();


router.get("/", modulecontrollers.findAll)


app.use('/api/modulecontrollers', router)    
}