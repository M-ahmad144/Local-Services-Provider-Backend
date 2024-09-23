const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["successful", "pending", "failed"],
      required: true,
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
