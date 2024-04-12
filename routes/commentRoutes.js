const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const songCommentController = require('../controllers/commentController');

router
  .route('/')
  .post(authController.protect, songCommentController.createSongComment);
router
  .route('/:songId')
  .get(authController.protect, songCommentController.getCommentsBySongId)
  .delete(authController.protect, songCommentController.deleteComment);

  module.exports = router;
