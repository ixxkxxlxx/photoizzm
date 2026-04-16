import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@convo.com' },
    update: {},
    create: {
      email: 'admin@convo.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  console.log('Admin created:', admin.email);

  // Create packages
  const packages = [
    {
      name: 'prewedding',
      description: 'Capture your love story before the big day',
      price: 2500000,
      duration: '4-6 hours',
      includes: '2 locations, 50+ edited photos, online gallery',
    },
    {
      name: 'wedding',
      description: 'Complete coverage of your special day',
      price: 5000000,
      duration: 'Full day',
      includes: 'Unlimited photos, 2 photographers, album',
    },
    {
      name: 'portrait',
      description: 'Professional portraits for any occasion',
      price: 750000,
      duration: '1-2 hours',
      includes: '1 location, 20+ edited photos, online gallery',
    },
    {
      name: 'product',
      description: 'High-quality product photography for your business',
      price: 500000,
      duration: '2-3 hours',
      includes: '10+ products, white background, lifestyle shots',
    },
  ];

  for (const pkg of packages) {
    const created = await prisma.package.upsert({
      where: { name: pkg.name },
      update: {},
      create: pkg,
    });
    console.log('Package created:', created.name);
  }

  // Create sample booking
  const booking = await prisma.booking.create({
    data: {
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+62 812 3456 7890',
      packageName: 'prewedding',
      date: new Date('2024-04-15'),
      time: '10:00',
      location: 'Bali Beach',
      notes: 'Romantic sunset theme',
      totalPrice: 2500000,
    },
  });

  console.log('Sample booking created:', booking.id);
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
