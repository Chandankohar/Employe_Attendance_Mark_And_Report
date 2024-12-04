const express=require('express')
const { register, login } = require('../controller/employeController')
const { checkWiFiConnection } = require('../middleware/checkwifiConnection')
const router=express.Router()

router.route('/register').post(register)
router.route('/login').post(checkWiFiConnection,login)


module.exports=router