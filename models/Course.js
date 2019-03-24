const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	duration: Number,
	price: Number,
	title: {
		required: "Proporciona un titulo para el curso",
		type: String
	},
	instructor: {
		required: "Proporciona un instructor",
		type: Schema.Types.ObjectId
	},
	active: {
		type: Boolean,
		default: true
	},
	modules: [{
		type: Schema.Types.ObjectId
	}]
}, {
		timestamps: true
	});

module.exports = mongoose.model("Course", courseSchema);
