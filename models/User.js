let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema(
  {
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
      enum: ["ADMIN", "GUEST", "PREMIUM", "STUDENT"],
      default: "GUEST"
    },
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
    homeworks: Object,
    country: String,
    city: String
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
