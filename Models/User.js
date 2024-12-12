
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Store hashed password
    user_type: {
      type: String,
      enum: ["service provider", "buyer", "admin"],
      
    },
    profile_description: { type: String },
    verify: { type: Boolean, default: false },
    profile_image: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    is_google: { type: Boolean, default: false },
    location: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    language: [
      {
        name: { type: String, required: true },
        level: { type: String },

        
      },
    ],
    skills: [{ type: String }],
  },
  { timestamps: { created_at: "created_at", updated_at: "updated_at" } }
);


const User = mongoose.model("User", userSchema);
module.exports = User;
