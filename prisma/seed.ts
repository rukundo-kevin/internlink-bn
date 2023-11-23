import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedDown = async () => {
  await prisma.user.deleteMany({});
};

const seedUp = async () => {
  await seedDown();
  //seed users
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        username: 'Admin',
        password: 'Password@123',
        role: 'ADMIN',
        state: 'VERIFIED',
      },
      {
        email: 'citizen@gmail.com',
        username: 'citizen',
        password: 'Password@123',
        role: 'CITIZEN',
        state: 'VERIFIED',
      },
      {
        email: 'police@gmail.com',
        username: 'police',
        password: 'Password@123',
        role: 'POLICE',
        state: 'VERIFIED',
      },
      {
        email: 'orphanage@gmail.com',
        username: 'orphanage',
        password: 'Password@123',
        role: 'COMMUNITY',
        state: 'VERIFIED',
      },
      {
        email: 'district@gmail.com',
        username: 'district',
        password: 'Password@123',
        role: 'DISTRICTAUTHORITY',
        state: 'VERIFIED',
      },
      {
        email: 'ngo@gmail.com',
        username: 'ngo',
        password: 'Password@123',
        role: 'NGO',
        state: 'VERIFIED',
      },
    ],
  });

  //seed orphanage
  const orphanageManager = await prisma.user.findUnique({
    where: {
      email: 'orphanage@gmail.com',
    },
  });

  await prisma.orphanage.create({
    data: {
      communityName: 'Sample Orphange',
      province: 'Kigali',
      district: 'Gasabo',
      sector: 'Kimironko',
      address: 'Kigali 123',
      manager: {
        connect: {
          id: orphanageManager.id,
        },
      },
    },
  });

  //seed ngo
  const ngoManager = await prisma.user.findUnique({
    where: {
      email: 'ngo@gmail.com',
    },
  });

  await prisma.nGO.create({
    data: {
      ngoName: 'Sample Ngo',
      province: 'Kigali',
      ngoDescription: 'Sample description',
      district: 'Gasabo',
      sector: 'Kimironko',
      address: 'Kigali 123',
      manager: {
        connect: {
          id: ngoManager.id,
        },
      },
    },
  });

  //seed police
  const police = await prisma.user.findUnique({
    where: {
      email: 'ngo@gmail.com',
    },
  });

  await prisma.police.create({
    data: {
      province: 'Kigali',
      district: 'Gasabo',
      sector: 'Kimironko',
      user: {
        connect: {
          id: police.id,
        },
      },
    },
  });

  //seed ngo
  const districtAuthority = await prisma.user.findUnique({
    where: {
      email: 'district@gmail.com',
    },
  });

  await prisma.districtAuthority.create({
    data: {
      district: 'Gasabo',
      user: {
        connect: {
          id: districtAuthority.id,
        },
      },
    },
  });
};

seedUp().then(() => {
  console.log('Seeding completed');
  prisma.$disconnect();
  process.exit(0);
});

export { seedDown, seedUp };
