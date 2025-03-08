import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<any | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Connected to socket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures it runs only once

  return socket;
};
