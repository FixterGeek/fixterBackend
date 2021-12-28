let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema(
  {
    payments: [
      {
        type: String
      }
    ],
    changePass: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "GUEST", "PLUS", "STUDENT"],
      default: "GUEST"
    },
    plusDate: Date,
    email: String,
    facebookId: String,
    googleId: String,
    displayName: String,
    photoURL: String,
    enrolled: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student"
      }
    ],
    bootcamps: [{
      type: Schema.Types.ObjectId,
      ref: "Bootcamp"
    }],
    editions: [{
      type: Schema.Types.ObjectId,
      ref: "Edition"
    }],
    homeworks: Object,
    country: String,
    city: String,
    exams: Object
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
