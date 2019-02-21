const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cuponSchema = new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  value:{
    type:Number,
    required:true
  },
  valid:{
    type:Boolean,
    default:true
  },
  users:[{
    type:Schema.Types.ObjectId,
    ref:'User'
  }]
},{
  timestamps:true
})

module.exports = mongoose.model('Cupon', cuponSchema)