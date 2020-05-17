const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailItemSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("MailItem", mailItemSchema);
