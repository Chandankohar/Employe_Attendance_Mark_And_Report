const express=require('express')
const {getAttendance, punchinAttendance, punchoutAttendance } = require('../controller/attandanceController')
const { isLoggedIn } = require('../middleware/employeMiddleware')
const router=express.Router()




router.route('/punchinattendance').post(isLoggedIn,punchinAttendance)
router.route('/punchoutattendance').post(isLoggedIn,punchoutAttendance)
router.route('/attendancedetail/:id').get(isLoggedIn,getAttendance)

module.exports=router