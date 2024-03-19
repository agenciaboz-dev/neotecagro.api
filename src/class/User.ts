import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Socket } from "socket.io";
import { WithoutFunctions } from "./helpers";
// import { User } from "./User";

export type UserPrisma = Prisma.UserGetPayload<{}>;

export class User {
  id: number;
  username: string;
  email: string;
  document: string;
  password: string;
  name: string;
  birth: Date | null;
  rg: string | null;
  phone: string | null;
  cep: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  number: string | null;
  image: string;
  uf: string | null;
  adm: boolean;
  sold: number;
  bought: number;
  rating: number;
  ratings: number;
  date: Date;
  crops: any[];
  mediatedCrops: any[];
  chats: any[];
  messages: any[];
  categories: any[];
  businessCategories: any[];
  business: any;
  agent: any;
  shipping: any;
  producer: any;

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const user = await prisma.user.findUnique({
      where: { id: this.id },
    });

    if (!user) {
      throw new Error("User not found");
    }
  }

  static async handleSignup(socket: Socket, data: UserForm) {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        document: data.document.replace(/\D/g, ""),
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });

    if (user) {
      socket.emit("signup:success");
    } else {
      socket.emit("signup:error");
    }
  }

  load(data: UserPrisma) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.document = data.document;
    this.password = data.password;
    this.name = data.name;
    this.birth = data.birth;
    this.rg = data.rg;
    this.phone = data.phone;
    this.cep = data.cep;
    this.address = data.address;
    this.city = data.city;
    this.district = data.district;
    this.number = data.number;
    this.image = data.image;
    this.uf = data.uf;
    this.adm = data.adm;
    this.sold = data.sold;
    this.bought = data.bought;
    this.rating = data.rating;
    this.ratings = data.ratings;
    this.date = data.date;
    // this.crops = data.crops;
    // this.mediatedCrops = data.mediatedCrops;
    // this.chats = data.chats;
    // this.messages = data.messages;
    // this.categories = data.categories;
    // this.businessCategories = data.businessCategories;
    // this.business = data.business;
    // this.agent = data.agent;
    // this.shipping = data.shipping;
    // this.producer = data.producer;
  }
}

export default User;

export type UserForm = Omit<WithoutFunctions<User>, "id"> & {
  username: string;
  password: string;
  document: string;
  name: string;
  email: string;
};
