const User = require('../models/User');
const Team = require('../models/Team');
const Task = require('../models/Task');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const teamCount = await Team.countDocuments();
        const taskCount = await Task.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                userCount,
                teamCount,
                taskCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User removed'
        });
    } catch (error) {
        next(error);
    }
};
