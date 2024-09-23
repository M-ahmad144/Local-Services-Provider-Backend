const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      required: true,
    },
    price: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    delivery_date: { type: Date },
    updated_at: { type: Date, default: Date.now },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", default: [] },
    ],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] }],
  },
  { timestamps: { createdAt: "order_date", updatedAt: "updated_at" } }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order