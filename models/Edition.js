const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editionSchema = new Schema({
	title:{
		type: String,
		required:true
	},
	body:{
		type: String,
		required:true
	},
	cover:{
		type: String
	},
	address: {
		type: String,
		required: "Agrega la ubicación del evento"
	},
	price: {
		type: Number,
		required: true
	},
	startDate: {
		type: Date,
	},
	endDate: {
		type: Date
	},
	onSaturday: {
		type: Boolean
	},
	// timetable: [
	// 	{
	// 		day: {
	// 			type: String,
	// 			required: "Agrega que dia que será el curso"
	// 		},
	// 		schedule: {
	// 			type: String,
	// 			required: "Agrega el horario del curso"
	// 		}
	// 	}
	// ]
}, {
	timestamps: true
});

module.exports = mongoose.model("Edition", editionSchema);
