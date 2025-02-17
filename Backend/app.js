const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db')
const userRoutes = require('./routes/user.routes')
const orgRoutes = require('./routes/org.routes')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectToDb()

app.get('/',(req,res)=>{
    res.send("kallu")
})

app.use('/users', userRoutes)
app.use('/orgs', orgRoutes)
module.exports = app;