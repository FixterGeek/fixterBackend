const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editionSchema = new Schema({
	course: {
		type: Schema.Types.ObjectId,
		required: "Agrega el curso de esta edición"
	},
	address: {
		type: String,
		required: "Agrega la ubicación del evento"
	},
	endDate: {
		type: Date
	},
	startDate: {
		type: Date,
	},
	onSaturday: {
		type: Boolean
	},
	timetable: [
		{
			day: {
				type: String,
				required: "Agrega que dia que será el curso"
			},
			schedule: {
				type: String,
				required: "Agrega el horario del curso"
			}
		}
	]
}, {
	timestamps: true
});

module.exports = mongoose.model("Edition", editionSchema);
