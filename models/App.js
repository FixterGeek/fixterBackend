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
    course: {
    	type: Schema.Types.ObjectId,
			ref: "Edition"
		},
    comments: String,
    paid:{
      type:Boolean,
      default:false
    },
    cost:Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("App", appSchema);
