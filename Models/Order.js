const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service_provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      required: true,
    },
    description : {type:String , required:true},
    price: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    appointment_date: { type: Date },
    appointment_time : {type:String , required:true},
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "order_date", updatedAt: "updated_at" } }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order