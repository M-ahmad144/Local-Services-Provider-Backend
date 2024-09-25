const express = require("express");

const {
  createChat,
  findChat,
  userChats,
  deleteChat,
} = require("../Controllers/chatController");

const router = express.Router();

// Route for creating a new chat
router.post("/create", createChat);

// Route for finding a specific chat
router.get("/find/:firstId/:secondId", findChat);

// Route for retrieving all chats for a user
router.get("/user/:userId", userChats);

// Route for deleting a chat
router.delete("/delete/:chatId", deleteChat);

module.exports = router;
