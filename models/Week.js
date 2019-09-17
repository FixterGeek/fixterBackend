const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekSchema = new Schema({
  order: Number,
  photoURL: String,
  startdate: Date,
  endDate: Date,
  title: {
    required: "Proporciona un titulo para la semana",
    type: String
  },
  description: String,
  instructor: {
    type: Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    default: false
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp"
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Week", weekSchema);
