const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@broprogress.com' },
      update: {},
      create: {
        email: 'admin@broprogress.com',
        name: 'Admin User',
        password: adminPassword,
        attributes: {
          create: {
            physical: 0,
            mental: 0,
            intellect: 0,
            ambition: 0,
            discipline: 0,
            relationship: 0
          }
        }
      }
    });

    console.log('✅ Admin user created:', admin.email);

    // Create sample workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: 'My First Workspace',
        description: 'Welcome to your first workspace!',
        members: {
          create: {
            userId: admin.id,
            role: 'OWNER'
          }
        }
      }
    });

    console.log('✅ Sample workspace created:', workspace.name);

    // Create sample page
    const page = await prisma.page.create({
      data: {
        title: 'Welcome Page',
        workspaceId: workspace.id,
        authorId: admin.id,
        blocks: {
          create: [
            {
              type: 'HEADING1',
              content: { text: 'Welcome to BroProgress!' },
              order: 0,
              authorId: admin.id
            },
            {
              type: 'TEXT',
              content: { text: 'This is your first page. Start adding your goals and tracking your progress!' },
              order: 1,
              authorId: admin.id
            }
          ]
        }
      }
    });

    console.log('✅ Sample page created:', page.title);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 