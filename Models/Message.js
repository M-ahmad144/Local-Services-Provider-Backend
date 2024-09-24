const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message_text: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
    read_at: { type: Date },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },

  { timestamps: { createdAt: "sent_at" } }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
