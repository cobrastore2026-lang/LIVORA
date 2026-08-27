const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetOrdersAndStats() {
  console.log('--- Resetting Orders and Analytics to 0 ---');
  
  // 1. Delete all order items & orders
  const deletedItems = await prisma.orderItem.deleteMany({});
  console.log(`Deleted ${deletedItems.count} order items.`);
  
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Deleted ${deletedOrders.count} orders.`);
  
  // 2. Clear analytics events so visits start cleanly at 0
  const deletedEvents = await prisma.analyticsEvent.deleteMany({});
  console.log(`Deleted ${deletedEvents.count} analytics events.`);
  
  // 3. Verify counts
  const orderCount = await prisma.order.count();
  const eventCount = await prisma.analyticsEvent.count();
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  
  console.log(`Current State:`);
  console.log(`- Orders: ${orderCount}`);
  console.log(`- Visits: ${eventCount}`);
  console.log(`- Products: ${productCount}`);
  console.log(`- Categories: ${categoryCount}`);
}

resetOrdersAndStats()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
