import { Prisma } from "@prisma/client";

export const crops = Prisma.validator<Prisma.CropInclude>()({
  producer: true,
  mediated: { include: { agent: true } },
  categories: true,
});
