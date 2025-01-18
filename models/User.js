const Joi = require('joi');
const mongoose =require('mongoose');
const passwordComplexity = require("joi-password-complexity"); 
const UserSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true,
    trim:true,
    minligth:5,
    maxligth:50,
    unqiue:true,
  },
  email: {
    type:String,
    required:true,
    trim:true,
    minligth:5,
    maxligth:50,
    unqiue:true,
  },
  passwoard: {
    type:String,
    required:true,
    trim:true,
    minligth:5,
    maxligth:50,
    unqiue:true,
  },
  isAdmin : {
    type:Boolean,
    default:false,
    required:true,
  },
 isStoreOwner : {
type:Boolean,
default:false,
 },
  token: {
    type:String,
  }
},{timestamps:true});

const User = mongoose.model('User',UserSchema);

function validateRegister(obj) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required().trim(),
    email: Joi.string().min(5).max(50).required().trim().email(),
    passwoard: Joi.string().min(5).max(50).required().trim().passwordComplexity(),
    token: Joi.string().min(5).max(50).required(),
  })
  return schema.validate(obj);
}
function validateRegister(obj) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required().trim(),
    email: Joi.string().min(5).max(50).required().trim().email(),
    passwoard: passwordComplexity().required(),
    token: Joi.string(),
  })
  return schema.validate(obj);
}

function validateLogin(obj) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required().trim(),
    passwoard: Joi.string().required(),
  });
  return schema.validate(obj);
}

module.exports = { User, validateRegister, validateLogin };