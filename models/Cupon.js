const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cuponSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 20
  },
  value: {
    type: Number,
    required: true
  },
  valid: {
    type: Boolean,
    default: true
  },
  used: {
    type: Object,
    default: { 0: true }
  },
  // 2021
  exchanged:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  validUntil: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: Number
  //
}, {
    timestamps: true
  })

module.exports = mongoose.model('Cupon', cuponSchema)