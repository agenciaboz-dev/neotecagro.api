import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";

import { User, UserForm } from "../../src/class/User";
import { Crop } from "../../src/class/Crop";

let io: SocketIoServer | null = null;

export const initializeIoServer = (server: HttpServer | HttpsServer) => {
  io = new SocketIoServer(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e8,
  });
  return io;
};

export const getIoInstance = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Please call initializeIoServer first."
    );
  }
  return io;
};

export const handleSocket = (socket: Socket) => {
  console.log(`new connection: ${socket.id}`);

  socket.on("disconnect", async (reason) => {
    console.log(`disconnected: ${socket.id}`);
  });

  // USER OPRTATIONS
  socket.on("user:signup", (data: UserForm) => User.handleSignup(socket, data));
  socket.on("user:login", (data) => {
    User.handleLogin(socket, data);
  });

  // PRODUCT OPERTATIONS

  // CROP OPERATIONS
  socket.on("crop:new", (data) => {
    Crop.create(socket, data);
  });

  socket.on("crop:list", () => {
    Crop.list(socket);
  });

  socket.on("crop:find", (id: number) => {
    Crop.find(socket, id);
  });
};
export default { initializeIoServer, getIoInstance, handleSocket };
