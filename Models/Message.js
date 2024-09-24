const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message_text: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "sent_at" } }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message