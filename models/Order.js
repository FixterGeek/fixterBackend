const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      model: String,
      id: String
    }
  ],
  conektaId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  total: Number,
  paid: {
    type: Boolean,
    default: false
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model("Order", orderSchema);
