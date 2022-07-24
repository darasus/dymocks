import * as dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const organization = await prisma.organization.create({
    data: {
      name: "Ultra",
    },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "Ilya",
      lastName: "Daraseliya",
      email: "idarase@gmail.com",
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
  });
  console.log(`Created user with id: ${user.id}`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
