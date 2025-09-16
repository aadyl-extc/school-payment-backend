const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Types.ObjectId, required: true }, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    student_info: {
      name: String,
      id: String,
      email: String
    },
    collect_request_id: {
      type: String,
      unique: true,
      sparse: true
    },
    gateway_name: { type: String, required: true, default: "Edviron" },
    payment_url: { type: String},
    amount: { type: Number, required: true },
    callback_url: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
