const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
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
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "sent_at", updatedAt: true } }
);

// Method to mark message as read
messageSchema.methods.markAsRead = function () {
  this.read_at = Date.now();
  this.status = "read";
  return this.save();
};

// Optional indexing for performance
messageSchema.index({ chat: 1, sent_at: -1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
