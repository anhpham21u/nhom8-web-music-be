const SongComment = require('../models/commentModel');

exports.createSongComment = async (req, res) => {
    try {
        const { songId, userId, comment } = req.body;
        const newComment = await SongComment.create({ songId, userId, comment });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCommentsBySongId = async (req, res) => {
    try {
        const { songId } = req.params;
        const comments = await SongComment.find({ songId }).populate('userId', 'name'); // Lấy các nhận xét và thêm thông tin người dùng (ví dụ: username)
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