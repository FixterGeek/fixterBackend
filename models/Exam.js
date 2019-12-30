const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examSchema = new Schema({
  photoURL: String,
  startDate: Date,
  endDate: Date,
  title: {
    required: "Proporciona un titulo para el examen",
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
    ref: "Bootcamp",
    required: true
  },
  questions: Array,
}, {
  timestamps: true
});

module.exports = mongoose.model("Exam", examSchema);
