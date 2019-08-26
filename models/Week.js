const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekSchema = new Schema({
  photoURL: String,
  startdate: Date,
  endDate: Date,
  title: {
    required: "Proporciona un titulo para el curso",
    type: String
  },
  description: String,
  instructor: {
    type: Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    default: true
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp"
  },
  learnings: [{
    type: Schema.Types.ObjectId,
    ref: "Learning"
  }]
}, {
    timestamps: true
  });

module.exports = mongoose.model("Week", weekSchema);
