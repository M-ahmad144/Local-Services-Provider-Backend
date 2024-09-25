const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    delivery_time: { type: String, required: true },
    service_images: [{ type: String }],
    additional_features: { type: String }, // Optional field
    revision_count: { type: Number, default: 1 }, // Default revision count
    service_keywords: { type: String }, // Keywords for service
    service_tags: { type: String }, // Tags for service
    service_location: { type: String }, // Location of service
    availability_start: { type: String }, // Availability start date
    availability_end: { type: String }, // Availability end date
    detailed_pricing: { type: String }, // Details of pricing
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service