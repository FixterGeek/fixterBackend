const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editionSchema = new Schema({
	active:{
		type: Boolean,
		default:false
	},
	bootcamp:{
		type: Schema.Types.ObjectId,
		ref:'Bootcamp'
	},
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
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Edition", editionSchema);
