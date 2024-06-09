const SongComment = require('../models/commentModel');
const { io } = require('./../app');

exports.createSongComment = async (req, res) => {
    try {
        const { songId, userId, comment } = req.body;
        const newComment = await SongComment.create({ songId, userId, comment });
        const populatedComment = await SongComment.findById(newComment._id).populate('userId', 'name');

        io.emit('new message', populatedComment);
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCommentsBySongId = async (req, res) => {
    try {
        const { songId } = req.params;
        const comments = await SongComment.find({ songId })
            .populate('userId', 'name') // Lấy các nhận xét và thêm thông tin người dùng (ví dụ: username)
            .sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await SongComment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Nhận xét không tồn tại' });
        }
        res.status(200).json({ message: 'Nhận xét đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};