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
        firstName: 'Admin',
        lastName: 'Admin',
        role: 'ADMIN',
        state: 'VERIFIED',
      },
      {
        email: 'student@gmail.com',
        username: 'student',
        firstName: 'Student',
        lastName: 'Student',
        password: 'Password@123',
        role: 'STUDENT',
        state: 'VERIFIED',
      },
      {
        email: 'lecturer@gmail.com',
        username: 'LECTURER',
        firstName: 'Lecturer',
        lastName: 'Lecturer',
        password: 'Password@123',
        role: 'LECTURER',
        state: 'VERIFIED',
      },
      {
        email: 'organization@gmail.com',
        username: 'Good Company',
        password: 'Password@123',
        role: 'ORGANIZATION',
        firstName: 'Good',
        lastName: 'Company',
        state: 'VERIFIED',
      },
    ],
  });

  const student = await prisma.user.findFirst({
    where: {
      role: 'STUDENT',
    },
  });

  await prisma.student.create({
    data: {
      school: 'University of Kigali',
      department: 'Computer Science',
      user: {
        connect: {
          id: student.id,
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
