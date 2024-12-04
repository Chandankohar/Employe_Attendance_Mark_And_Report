const express=require('express')
const router=express.Router()

router.use('/employe',require('./employe.js'))
router.use('/attendance',require('./attandance.js'))




module.exports=router