// frontend/src/services/socket.js
import { io } from "socket.io-client";

// Backend Socket.IO server
const SOCKET_URL = "http://localhost:5000";

// 🔹 Create socket instance (single connection for the app)
const socket = io(SOCKET_URL, {
  autoConnect: false, // connect only after login
  transports: ["websocket"], // reliable transport
});

// ---------------- Helper Functions ----------------

// ✅ Connect socket with userId
export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", { user_id: userId, room: userId });
  }
};

// ✅ Disconnect socket (logout or close app)
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ✅ Send message to a room (chat between two users)
export const sendSocketMessage = ({ senderId, receiverId, text }) => {
  const room = [senderId, receiverId].sort().join("_"); // same room name for both
  socket.emit("send_message", { sender_id: senderId, receiver_id: receiverId, text, room });
};

// ✅ Listen for incoming messages
export const onReceiveMessage = (callback) => {
  socket.on("receive_message", (msg) => {
    callback(msg);
  });
};

// ✅ Listen for system events (like join status)
export const onStatus = (callback) => {
  socket.on("status", (data) => {
    callback(data);
  });
};

// ✅ Remove listeners (important when leaving a chat screen)
export const offSocketEvents = () => {
  socket.off("receive_message");
  socket.off("status");
};

export default socket;
