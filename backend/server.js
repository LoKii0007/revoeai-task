import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sheetsRoutes from "./routes/sheetsRoutes.js";
import { Server } from "socket.io";
import http from "http";
dotenv.config();

const app = express();
const server = http.createServer(app);


const allowedOrigins = [process.env.FRONTEND_URL , "http://localhost:3000", "http://localhost:5173"];


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Configure Socket.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle client events
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

io.on("error", (err) => {
  console.error("Socket.IO server error:", err);
});


//? Connect to database
connectDB();


//? API routes
app.use("/api/auth", authRoutes);
app.use("/api/sheets", sheetsRoutes);


//? Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});