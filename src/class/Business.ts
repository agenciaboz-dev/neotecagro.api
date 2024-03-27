import { Socket } from "socket.io";
import { Business, PrismaClient, User } from "@prisma/client";
import { fetch, include } from "../prisma";
import { ClientBag } from "../../definitions/client";
import { saveImage } from "../saveImage";

const prisma = new PrismaClient();

export const handleBusiness = async (
  socket: Socket,
  data: Business & { file: ArrayBuffer } & { user: User },
  clients: ClientBag
) => {
  const path = `user/${data.user.id}/business/images`;
  const filename = "profile";
  saveImage(path, data.file, filename);

  const business = await prisma.business.create({
    data: {
      document: data.document.replace(/\D/g, ""),
      email: data.email,
      name: data.name,
      phone: data.phone.replace(/\D/g, ""),
      service: data.service,
      store: data.store,
      userId: data.userId,
      image: `https://app.agenciaboz.com.br:4104/static/${path}/${filename}`,
    },
    include: include.business,
  });

  socket.broadcast.emit("business:new", business);
  socket.emit("business:new", business);

  const user = (await fetch.user.get(data.user.id)) as User;
  console.log(user);
  socket.emit("user:update", user);
  socket.broadcast.emit("users:update", user);
};
