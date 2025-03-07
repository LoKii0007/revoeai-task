import io from "socket.io-client";
import { useEffect } from "react";

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

  // cleanup function to disconnect socket when component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Cleaning up socket connection");
        socket.disconnect();
      }
    };
  }, [socket]);

  return socket;
};
