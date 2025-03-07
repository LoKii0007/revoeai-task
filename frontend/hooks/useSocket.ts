import io from "socket.io-client";

export const useSocket = () => {
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000");

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
