let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const helpSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    ta: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp"
    },
    chat: Object,
    paid: {
      type: Boolean,
      default: false
    },
    resolved: Boolean,
    question: String,
    satus: {
      type: String,
      enum: ["OPEN", "RESOLVED", "DISMISSED"],
      default: "OPEN"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Help", helpSchema);
