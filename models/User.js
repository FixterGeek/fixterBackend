let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema(
  {
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
    enrolled: Boolean,
    country: String,
    city: String
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
