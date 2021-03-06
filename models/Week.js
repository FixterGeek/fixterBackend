const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekSchema = new Schema({
  order: Number,
  itemsOrder: [{
    type: Schema.Types.ObjectId,
    ref: "Learning"
  }],
  photoURL: String,
  startDate: Date,
  endDate: Date,
  title: {
    required: "Proporciona un titulo para la semana",
    type: String
  },
  description: String,
  instructor: {
    type: Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    default: false
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true
  },
}, {
  timestamps: true
});

weekSchema.virtual('learnings', {
  ref: 'Learning',
  localField: '_id',
  foreignField: 'week'
})

weekSchema.virtual('homeworks', {
  ref: 'Homework',
  localField: '_id',
  foreignField: 'week'
})

weekSchema.set('toObject', { virtuals: true });
weekSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Week", weekSchema);
