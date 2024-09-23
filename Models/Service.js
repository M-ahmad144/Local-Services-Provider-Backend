const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    delivery_time: { type: String, required: true },
    service_images: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service