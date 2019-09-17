const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learningSchema = new Schema({
  order: Number,
  link: String,
  tipo: {
    type: String,
    enum: ["VIDEO", "POST", "AUDIO", "LINK"],
    default: "VIDEO"
  },
  photoURL: String,
  title: {
    required: "Proporciona un titulo para el recurso",
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

module.exports = mongoose.model("Learning", learningSchema);
