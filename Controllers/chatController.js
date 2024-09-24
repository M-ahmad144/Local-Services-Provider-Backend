const Chat = require("../Models/Chat");
const Message = require("../Models/Message");

//***createChat -->Purpose: Creates a new chat between a client and a freelancer. Checks if the chat already exists to prevent duplicates.Parameters: senderId, receiverId.Returns: The chat object or existing chat if found

export const createChat = async (req, res) => {
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
    //if chat does not exist, create a new chat
    chat = new Chat({
      participants: [senderId, receiverId],
    });

    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Error creating chat" });
  }
};
//***  sendMessage -->Purpose: Sends a message from a client or freelancer in a specific chat and emits it via Socket.IO for real-time updates.Parameters: chatId, senderId, text.Returns: The sent message object.
export const sendMessage = async (req, res) => {
  const { chatId, senderId, message } = req.body;

  try {
  } catch (error) {}
};
//***getChatHistory -->Purpose: Retrieves the entire message history for a specific chat between the client and freelancer.Parameters: chatId.Returns: An array of messages

//***markMessageAsRead-->Purpose: Marks a specific message as read, updating its status accordingly. This helps clients and freelancers know which messages have been seen.Parameters: messageId.Returns: The updated message object.

//***getUnreadMessageCount-->Purpose: Counts the number of unread messages for a specific user (either client or freelancer).Parameters: userId.Returns: Count of unread messages.

//***userChats-->Purpose: Retrieves all chats that a specific user (client or freelancer) is involved iParameters: userId.Returns: An array of chats.

//***findChat -->Purpose: Finds an existing chat between two specific users (client and freelancer). Parameters: firstId, secondId. Returns: The chat object if found.

//***deleteChat deleteChat-->   Purpose: Allows a user to delete a chat if necessary (with confirmation) Parameters: chatId. Returns: A success message or an error

// ***getActiveUsers -->Purpose: Retrieves a list of active users (clients or freelancers) currently online or available for chat. -->Returns: An array of user objects.
