import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { socketAuth } from "./middleware/socketAuth.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { getAccessibleConversation } from "./services/conversationService.js";
import { sendMessage } from "./services/messageService.js";
import { AppError } from "./utils/apperror.js";
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});
// Authenticate every new Socket.IO connection.
io.use(socketAuth);




io.on("connection", (socket) => {
  const user = socket.data.user;

  console.log(
    `Authenticated socket connected: ${socket.id}, user: ${user.id}, role: ${user.role}`
  );

  // Join a conversation only after checking participant permissions.
  socket.on("conversation:join", async (payload = {}) => {
    try {
      const { conversationId } = payload;

      if (
        typeof conversationId !== "string" ||
        !conversationId.trim()
      ) {
        throw new AppError("A valid conversation ID is required", 400);
      }

      await getAccessibleConversation({
        conversationId,
        userId: user.id,
        role: user.role,
      });

      socket.join(`conversation:${conversationId}`);

      socket.emit("conversation:joined", { conversationId });
    } catch (error) {
      socket.emit("chat:error", {
        event: "conversation:join",
        message:
          error instanceof AppError
            ? error.message
            : "Unable to join this conversation",
      });
    }
  });

  // Send a message and deliver it to sockets in that conversation.
  socket.on("message:send", async (payload = {}) => {
    try {
      const { conversationId, content } = payload;

      if (
        typeof conversationId !== "string" ||
        !conversationId.trim()
      ) {
        throw new AppError("A valid conversation ID is required", 400);
      }

      const room = `conversation:${conversationId}`;

      // Require the socket to join the conversation first.
      if (!socket.rooms.has(room)) {
        throw new AppError(
          "Join the conversation before sending a message",
          403
        );
      }

      const message = await sendMessage({
        conversationId,
        userId: user.id,
        role: user.role,
        content,
      });

      io.to(room).emit("message:new", message);
    } catch (error) {
      socket.emit("chat:error", {
        event: "message:send",
        message:
          error instanceof AppError
            ? error.message
            : "Unable to send the message",
      });
    }
  });

  // Leave a conversation when it is no longer open in the UI.
  socket.on("conversation:leave", (payload = {}) => {
    const { conversationId } = payload;

    if (typeof conversationId === "string" && conversationId.trim()) {
      socket.leave(`conversation:${conversationId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});