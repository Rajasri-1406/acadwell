import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Single socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// Connect socket with JWT token
export const connectSocket = (token) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", { token });
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

// Send message to a user
export const sendMessageSocket = ({ sender_id, receiver_id, text }) => {
  socket.emit("send_message", { sender_id, receiver_id, text });
};

// Listen for messages
export const onReceiveMessage = (callback) => {
  socket.on("receive_message", (msg) => callback(msg));
};

// Remove listeners
export const offSocketEvents = () => {
  socket.off("receive_message");
};

export default socket;
