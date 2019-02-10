let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const appSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true
    },
    course: String,
    comments: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("App", appSchema);
