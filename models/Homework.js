const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
  question: {
    type: String
  },
  options: [{
    type: String
  }],
  answer: {
    type: String
  },
  order: Number,
  link: String,
  tipo: {
    type: String,
    enum: ["HOMEWORK", "EXAM"],
    default: "HOMEWORK"
  },
  photoURL: String,
  title: {
    required: "Proporciona un titulo para la tarea",
    type: String,
    required: true
  },
  description: String,
  instructor: {
    type: Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    default: true
  },
  week: {
    type: Schema.Types.ObjectId,
    ref: "Week",
    required: true
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp"
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Homework", homeworkSchema);
