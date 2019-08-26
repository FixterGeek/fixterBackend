const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  tel: String,
  email: String,
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order"
  },
  paid: {
    type: Boolean,
    default: false
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model("Student", studentSchema);
