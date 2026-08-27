const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@livora.ye' },
    update: {
      passwordHash: hash,
      name: 'مدير المتجر',
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'admin@livora.ye',
      passwordHash: hash,
      name: 'مدير المتجر',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✓ Admin ensured:', admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
