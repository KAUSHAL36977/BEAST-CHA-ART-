const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test database connection
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  testConnection
}; 