import io from "socket.io-client";

export const useSocket = () => {
  const socket = io("http://localhost:5000");

  if (!socket) {
    console.error("Socket not connected");
  }

  socket.on("connect", () => {
    console.log("Connected to socket");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });

  return socket;
};
