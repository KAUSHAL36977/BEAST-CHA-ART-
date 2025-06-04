require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('./middleware/auth');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const goalRoutes = require('./routes/goals');
const attributeRoutes = require('./routes/attributes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-page', (pageId) => {
    socket.join(pageId);
  });

  socket.on('block-update', (data) => {
    socket.to(data.pageId).emit('block-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Authentication Routes
app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Workspace Routes
app.post('/api/workspaces', auth, async (req, res) => {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: true
      }
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Page Routes
app.post('/api/pages', auth, async (req, res) => {
  try {
    const page = await prisma.page.create({
      data: {
        title: req.body.title,
        workspaceId: req.body.workspaceId,
        authorId: req.user.id,
        parentId: req.body.parentId
      }
    });
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pages/:id', auth, async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        },
        children: true
      }
    });
    res.json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Block Routes
app.post('/api/blocks', auth, async (req, res) => {
  try {
    const block = await prisma.block.create({
      data: {
        type: req.body.type,
        content: req.body.content,
        order: req.body.order,
        pageId: req.body.pageId,
        authorId: req.user.id
      }
    });
    
    // Notify other users in real-time
    io.to(req.body.pageId).emit('block-created', block);
    
    res.status(201).json(block);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/blocks/:id', auth, async (req, res) => {
  try {
    const block = await prisma.block.update({
      where: { id: req.params.id },
      data: {
        content: req.body.content,
        type: req.body.type,
        order: req.body.order
      }
    });
    
    // Notify other users in real-time
    io.to(block.pageId).emit('block-updated', block);
    
    res.json(block);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Comment Routes
app.post('/api/comments', auth, async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        authorId: req.user.id,
        pageId: req.body.pageId,
        blockId: req.body.blockId
      },
      include: {
        author: true
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Notification Routes
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/attributes', attributeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 