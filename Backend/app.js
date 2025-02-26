const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db')
const userRoutes = require('./routes/user.routes')
const orgRoutes = require('./routes/org.routes')
const cookieParser = require('cookie-parser')
const mapRoutes = require('./routes/maps.routes')
const donationRoutes = require('./routes/donation.routes')

app.use(cookieParser())

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectToDb()

app.get('/',(req,res)=>{
    res.send("kallu")
})

app.use('/users', userRoutes)
app.use('/orgs', orgRoutes)
app.use('/maps', mapRoutes)
app.use('/donations', donationRoutes)
app.use('/uploads', express.static('uploads'))
module.exports = app;