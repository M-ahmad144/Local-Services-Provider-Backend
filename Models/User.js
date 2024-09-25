const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Store hashed password
    user_type: {
      type: String,
      enum: ["service provider", "buyer"],
      required: true,
    },
    profile_description: { type: String },
    verify: { type: Boolean, default: false },
    profile_image: {
      type: String,
      default: "default-profile.png",
    },
    location: { type: String },
    rating: { type: Number, default: 0 },
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

    language: [
      {
        name: { type: String, required: true },
        level: { type: String, required: true },
      },
    ],
    skills: [{ type: String }],
  },
  { timestamps: { created_at: "created_at", updated_at: "updated_at" } }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
