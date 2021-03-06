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
}, {
  timestamps: true
});

bootCampSchema.virtual('weeks', {
  ref: 'Week',
  localField: '_id',
  foreignField: 'bootcamp'
});

bootCampSchema.virtual('exam', {
  ref: 'Exam',
  localField: '_id',
  foreignField: 'bootcamp'
});

bootCampSchema.set('toObject', { virtuals: true });
bootCampSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Bootcamp", bootCampSchema);
