const Chat = require("../Models/Chat");
const AppError = require("../utils/Error");

// *** createChat
// Purpose: Create a new chat between two users if it doesn't already exist.
const createChat = async (req, res, next) => {
  const { senderId, receiverId } = req.body;
  try {
    // Check if a chat already exists between the two participants
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If chat exists, return the existing chat
    if (chat) {
      return res.status(200).json(chat);
    }

    // Create a new chat if one doesn't exist
    chat = new Chat({
      participants: [senderId, receiverId],
    });

    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    next(new AppError("Error creating chat", 500));
  }
};

// *** findChat
// Purpose: Find an existing single chat between two users.
const findChat = async (req, res, next) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [firstId, secondId] },
    });

    // Return chat if found
    if (chat) {
      return res.status(200).json(chat);
    } else {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    console.error("Error finding chat:", error);
    next(new AppError("Error finding chat", 500));
  }
};

// *** userChats

// Purpose: Retrieve all chats for a specific user.
const userChats = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({
      participants: { $in: [userId] },
    }).populate("participants", "name profile_image"); // Populate participant details

    // Return all chats for the user
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    next(new AppError("Error retrieving user chats", 500));
  }
};

// *** deleteChat
// Purpose: Delete a specific chat by its chat ID.
const deleteChat = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    // If the chat doesn't exist
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await Chat.findByIdAndDelete(chatId);

    // Return success message
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    next(new AppError("Error deleting chat", 500));
  }
};

module.exports = {
  createChat,
  findChat,
  userChats,
  deleteChat,
};
