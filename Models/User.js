const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ["freelancer", "buyer"], required: true },
    profile_description: { type: String },
    profile_image: { type: String },
    location: { type: String },
    rating: { type: Number },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] },
    ],
    freelancerOrders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] },
    ],
    reviews: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] },
    ],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", default: [] },
    ],
    messagesSent: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] },
    ],
    messagesReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
