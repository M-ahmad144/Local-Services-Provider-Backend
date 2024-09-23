const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message_text: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "sent_at" } }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message