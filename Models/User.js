
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
