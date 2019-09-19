const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Week = require('./Week')

const bootCampSchema = new Schema({
  current: Boolean,
  photoURL: String,
  startdate: Date,
  endDate: Date,
  duration: Number,
  price: Number,
  title: {
    required: "Proporciona un titulo para el curso",
    type: String
  },
  description: String,
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
    }
  ],
  instructors: [{
    type: Schema.Types.ObjectId
  }],
  active: {
    type: Boolean,
    default: true
  }
  // weeks: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "Week"
  // }]
}, {
  timestamps: true
});

bootCampSchema
  .virtual('weeks').get(async function () {
    let weeks = await Week.find({ bootcamp: this._id })
    console.log("virtual: ", weeks)
    return weeks
  });

module.exports = mongoose.model("Bootcamp", bootCampSchema);
