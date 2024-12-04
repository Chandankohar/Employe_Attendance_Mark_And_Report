const express=require('express')
const app=express()
const cors=require('cors')
require('dotenv').config()
const databaseConnect = require('./database/databaseConn')
databaseConnect()
app.use(cors())
app.use(express.json())
app.use('/api',require('./router'))
app.listen(process.env.PORT,()=>{
    console.log("listenport",process.env.PORT)
})
module.exports=app