const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes (existing ones)
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const donationRoutes = require('./routes/donation.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const conversationRoutes = require('./routes/conversation.routes');
const messageRoutes = require('./routes/message.routes');
const notificationRoutes = require('./routes/notification.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Socket.io Real-time Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', (data) => {
        // Broadcast to the conversation room
        io.to(`conversation_${data.conversation_id}`).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 BeatFund Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io is ready for real-time messaging`);
});