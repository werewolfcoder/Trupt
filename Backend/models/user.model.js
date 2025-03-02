const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userController = require('../controllers/user.controllers')
const userSchema = new mongoose.Schema({
      fullname:
      {
        firstname:
        {
            type: String,
            required:true,
            minlength:[3, 'first name must be atleast 3 chracters long']
        },
        lastname:
        {
            type:String,
            minlength:[3, 'first name must be atleast 3 chracters long']
        
        }
      },
      email:
      {
        type:String,
        required:true,
        unique:true,
        minlength:[3, 'first name must be atleast 3 chracters long']
      },
      password:
      {
        type:String,
        required:true,
        select:false
      },
      location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
      },
      socketId:{
        type:String
      }  
})


userSchema.methods.generateAuthToken = function ()
{
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET)
    return token;
}

userSchema.methods.comparePassword = async function(password)
{
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function(password)
{
    return await bcrypt.hash(password,10)
}


const userModel = mongoose.model('user',userSchema)

module.exports = userModel;