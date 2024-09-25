const Message = require("../Models/Message");
const Chat = require("../Models/Chat");
const AppError = require("../utils/Error");

// *** sendMessage
// Purpose: Send a message within a chat.
const sendMessage = async (req, res, next) => {
  const { chatId, senderId, text } = req.body;

  try {
    const newMessage = new Message({
      chat: chatId, // Reference to the chat ID
      sender: senderId, // Reference to the sender ID
      message_text: text,
      status: "sent",
    });

    const savedMessage = await newMessage.save();

    // Update the corresponding chat to include the new message
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: savedMessage._id }, // Add message ID to the chat's messages array
    });
    // Populate the sender details for the saved message
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "sender",
      "name profile_image"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    next(new AppError("Error sending message", 500));
  }
};

// *** getChatHistory
// Purpose: Retrieve the entire message history for a specific chat.
const getChatHistory = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      model: Message,
      select: "sender  message_text sent_at status", // Select necessary fields
    });

    if (!chat) {
      return next(new AppError("Chat not found", 404));
    }

    // Return all messages in the chat
    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    next(new AppError("Error retrieving chat history", 500));
  }
};

// *** markMessageAsRead
// Purpose: Mark a specific message as read.
const markMessageAsRead = async (req, res, next) => {
  const { messageId } = req.params;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status: "read", read_at: Date.now() }, // Mark message as read and set the read_at timestamp
      { new: true }
    );

    if (!updatedMessage) {
      return next(new AppError("Message not found", 404));
    }

    // Return the updated message
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error marking message as read:", error);
    next(new AppError("Error marking message as read", 500));
  }
};

// *** getUnreadMessageCount
// Purpose: Get the count of unread messages for a specific user.
const getUnreadMessageCount = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const unreadCount = await Message.countDocuments({
      receiver: userId,
      status: { $ne: "read" }, // Messages that haven't been marked as read
    });

    // Return the count of unread messages
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread message count:", error);
    next(new AppError("Error getting unread message count", 500));
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  markMessageAsRead,
  getUnreadMessageCount,
};
