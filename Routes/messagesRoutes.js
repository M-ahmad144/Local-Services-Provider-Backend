const express = require("express");
const {
  getChatHistory,
  sendMessage,
  markMessageAsRead,
  getUnreadMessageCount,
} = require("../Controllers/messageCotroller");

const router = express.Router();

// Route for sending a message
router.post("/send", sendMessage);

// Route for retrieving chat history
router.get("/chats/:chatId/history", getChatHistory);

// Route for marking a message as read
router.patch("/:messageId/read", markMessageAsRead);

// Route for getting unread message count
router.get("/users/:userId/unread-count", getUnreadMessageCount);

module.exports = router;
