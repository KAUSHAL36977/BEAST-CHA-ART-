const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userController = {
  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
      res.json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id }
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  },

  // Get user's workspaces
  async getUserWorkspaces(req, res) {
    try {
      const userId = req.user.userId;
      const workspaces = await prisma.workspace.findMany({
        where: {
          members: {
            some: {
              userId
            }
          }
        },
        include: {
          _count: {
            select: {
              pages: true,
              members: true
            }
          }
        }
      });

      res.json(workspaces);
    } catch (error) {
      console.error('Get user workspaces error:', error);
      res.status(500).json({ message: 'Error fetching workspaces' });
    }
  }
};

module.exports = userController; 