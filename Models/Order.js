const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      required: true,
    },
    price: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    delivery_date: { type: Date },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "order_date", updatedAt: "updated_at" } }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order