const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  .virtual('weeks', {
    ref: 'Week',
    localField: '_id',
    foreignField: 'bootcamp'
  });

module.exports = mongoose.model("Bootcamp", bootCampSchema);
