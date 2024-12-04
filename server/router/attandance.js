const express=require('express')
const { markAttendance, getAttendance } = require('../controller/attandanceController')
const { isLoggedIn } = require('../middleware/employeMiddleware')
const router=express.Router()




router.route('/markattendance').post(isLoggedIn,markAttendance)
router.route('/attendancedetail/:id').get(isLoggedIn,getAttendance)

module.exports=router