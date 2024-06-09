const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

// Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err);
  

  process.exit(1);
});

const songRouter = require('./routes/songRoutes');
const userRouter = require('./routes/userRoutes');
const playlistRouter = require('./routes/playlistRoutes');
const searchRouter = require('./routes/searchRoutes');
const commentRouter = require('./routes/commentRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const express = require('express');
const { server, app } = require('./app');

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

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => {
  console.log('Kết nối database thành công');
});

const server1 = server.listen(process.env.PORT || 8080, () => {
  console.log(`Hoạt động tại cổng ${process.env.PORT || 8080}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server1.close(() => {
    process.exit(1);
  });
});