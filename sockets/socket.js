const { Server } = require("socket.io");
const { sendMessage, markMessageAsRead, getUnreadMessageCount } = require('../Controllers/messageCotroller');
const { createChat, findChat, userChats, deleteChat } = require('../Controllers/chatController');
const Message = require('../Models/Message');
const Chat = require('../Models/Chat');
const AppError = require("../utils/Error");

const sockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://myneighbourly.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
// user 1 66f6b3665bdea8d787820e7e
// user 2 66f6b3d95bdea8d787820e83
  io.on("connection", (socket) => {
    console.log("User connected to socket.io:", socket.id);

    // Event for creating a chat
    socket.on("createChat", async ({ senderId, receiverId }) => {
      try {
        // Call the createChat controller function
        const chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] },
        });

        if (chat) {
          socket.emit("chatExists", chat); // Return existing chat
        } else {
          const newChat = await createChat({ body: { senderId, receiverId } }, { status: () => {} }, () => {});
          socket.emit("chatCreated", newChat); // Emit the newly created chat to the client
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        socket.emit("error", "Error creating chat");
      }
    });

    // Event for sending a message
    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      try {
        console.log(chatId, senderId, text)
        // Use sendMessage controller function to send message
        const newMessage = await sendMessage({ body: { chatId, senderId, text, status: 'sent' } });
        io.to(chatId).emit("messageReceived", newMessage); // Emit the message to the users in the chat
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Error sending message");
      }
    });

    // Event for joining a specific chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

    // Event for fetching chat history
    socket.on("getChatHistory", async (chatId) => {
      try {
        const chatHistory = await Chat.findById(chatId).populate({
          path: "messages",
          model: Message,
          select: "sender message_text sent_at status",
        });

        if (!chatHistory) {
          socket.emit("error", "Chat not found");
        } else {
          socket.emit("chatHistory", chatHistory.messages); // Send the chat history to the client
        }
      } catch (error) {
        console.error("Error retrieving chat history:", error);
        socket.emit("error", "Error retrieving chat history");
      }
    });

    // idhr tk ho chuka hy

    // Event for marking a message as read
    socket.on("markMessageAsRead", async (messageId) => {
      try {
        const updatedMessage = await markMessageAsRead({ params: { messageId } }, { status: () => {} }, () => {});
        io.emit("messageRead", updatedMessage); // Notify users that a message was read
      } catch (error) {
        console.error("Error marking message as read:", error);
        socket.emit("error", "Error marking message as read");
      }
    });

    // Event for fetching unread message count
    socket.on("getUnreadMessageCount", async (userId) => {
      try {
        const unreadCount = await getUnreadMessageCount({ params: { userId } }, { status: () => {} }, () => {});
        socket.emit("unreadMessageCount", unreadCount); // Send unread count to the client
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        socket.emit("error", "Error fetching unread messages");
      }
    });

    // Event for retrieving all user chats
    socket.on("userChats", async (userId) => {
      try {
        const chats = await userChats({ params: { userId } }, { status: () => {} }, () => {});
        socket.emit("userChats", chats); // Send all user chats to the client
      } catch (error) {
        console.error("Error retrieving user chats:", error);
        socket.emit("error", "Error retrieving user chats");
      }
    });

    // Event for deleting a chat
    socket.on("deleteChat", async (chatId) => {
      try {
        await deleteChat({ params: { chatId } }, { status: () => {} }, () => {});
        io.emit("chatDeleted", chatId); // Notify all users that a chat has been deleted
      } catch (error) {
        console.error("Error deleting chat:", error);
        socket.emit("error", "Error deleting chat");
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected from socket.io:", socket.id);
    });
  });

  return io;
};

module.exports = sockets;
