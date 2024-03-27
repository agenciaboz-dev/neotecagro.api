import { Socket } from "socket.io";
// import { ClientBag } from "../../definitions/client"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const newChat = async (
  socket: Socket,
  clients: ClientBag,
  data: NewChatBag
) => {
  const client = clients.get(socket);
  if (client) {
    const destination = clients.find(
      data.users.filter((user) => user.id != client.user.id)[0]
    );
    const chat = await prisma.chat.create({
      data: {
        channel: data.channel,
        messages: { create: { text: data.message, userId: client.user.id } },
        users: { connect: data.users.map((user) => ({ id: user.id })) },
      },
      include: {
        messages: { include: { user: true } },
        users: true,
      },
    });
    console.log(chat);

    socket.emit("chat:new", chat);
    destination?.socket.emit("chat:new", chat);
  }
};

export const handleChat = async (
  socket: Socket,
  clients: ClientBag,
  data: ChatBag
) => {};
