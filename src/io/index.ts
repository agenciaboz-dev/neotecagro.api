import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";

import { User, UserForm } from "../../src/class/User";

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

  // PRODUCT OPERTATIONS
};
export default { initializeIoServer, getIoInstance, handleSocket };
