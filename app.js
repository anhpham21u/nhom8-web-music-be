const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const songRouter = require('./routes/songRoutes');
const userRouter = require('./routes/userRoutes');
const playlistRouter = require('./routes/playlistRoutes');
const searchRouter = require('./routes/searchRoutes');
const commentRouter = require('./routes/commentRoutes');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Địa chỉ của client
    methods: ["GET", "POST"]
  }
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
// Xử lý middleware  
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

io.on('connection', (socket) => {
  console.log('a user connected');
  

  // // Xử lý sự kiện từ client
  // socket.on('message', (msg) => {
  //   console.log('message: ' + msg);
  // });

  // // Gửi tin nhắn đến client
  socket.emit('test', 'Welcome to the socket.io server!');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/public', express.static('public'));

// Api 
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} tại máy chủ`, 404));
});

// Xử lý lỗi
app.use(globalErrorHandler);

module.exports = { server, io };