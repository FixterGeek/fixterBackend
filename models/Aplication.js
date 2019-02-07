const mongoose = require('mongoose')
const Schema = mongoose.Schema

const aplicationSchema = new Schema({
  course:{
    type:Schema.Types.ObjectId,
    ref:'Course'
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  status:{
    type:String,
    enum:['PENDING', 'APPROVED'],
    default:'PENDING'
  },
  paid:{
    type:Boolean,
    default:false
  },
  cost:{
    type:Number    
  }
},{
  timestamps:true
})

module.exports = mongoose.model('Aplication', aplicationSchema)