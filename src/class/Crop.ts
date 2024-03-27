import { Prisma, Producer } from "@prisma/client";
import { prisma } from "../prisma";
import { Socket } from "socket.io";
import { WithoutFunctions } from "./helpers";

export type CropPrisma = Prisma.CropGetPayload<{}>;

export const include = {
  crops: {
    producer: true,
    mediated: { include: { agent: true } },
    categories: true,
  },
};

export class Crop {
  id: number;
  name: string;
  description: string;
  weight: number;
  price: number;
  image: string;
  gallery: string;
  rating: number;
  ratings: number;
  date: Date;
  sold: number;

  producerId: number;

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const crop = await prisma.crop.findUnique({
      where: { id: this.id },
    });

    if (!crop) {
      throw new Error("Crop not found");
    }
  }

  static async create(socket: Socket, data: Crop) {
    try {
      const cropPrisma = await prisma.crop.create({
        data: {
          ...data,
        },
      });
      const crop = new Crop(cropPrisma.id);
      crop.load(cropPrisma);
      socket.broadcast.emit("crop:new", crop);
      socket.emit("crop:new", crop);
    } catch (error) {
      socket.emit("crop:error", error);
      console.error(error);
      throw error;
    }
  }

  static async list(socket: Socket) {
    const crops = await prisma.crop.findMany({ include: include.crops });
    socket.emit("crop:list", crops);
  }

  static async find(socket: Socket, id: number) {
    const cropPrisma = await prisma.crop.findUnique({
      where: { id },
      include: include.crops,
    });
    if (!cropPrisma) {
      const error = new Error(`Crop with ID ${id} not found.`);
      socket.emit("crop:find:failure", error.message);
      console.error(error);
    } else {
      console.log(cropPrisma);
      socket.emit("product:find:successful", cropPrisma);
    }
  }

  load(data: CropPrisma) {
    this.name = data.name;
    this.description = data.description;
    this.weight = data.weight;
    this.price = data.price;
    this.image = data.image;
    this.gallery = data.gallery;
    this.rating = data.rating;
    this.ratings = data.ratings;
    this.date = data.date;
    this.sold = data.sold;
    this.producerId = data.producerId;
  }
}

export type CropForm = Omit<WithoutFunctions<Crop>, "id"> & {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  date: Date;

  producerId: number;
};
