const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; "
    + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    + "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    + "font-src 'self' https://fonts.gstatic.com; "
    + "img-src 'self' data:; "
    + "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
    + "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
    + "connect-src 'self' ws: wss:;"
  );
  next();
});

// Explicitly set MIME type for CSS files
app.use('*.css', (req, res, next) => {
    res.type('text/css');
    next();
});

// Serve static files from the src directory at the root
app.use(express.static(path.join(__dirname, 'src')));

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from the node_modules directory
app.use('/node_modules', express.static('node_modules'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 7777;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 