const Task = require('../models/Task');
const Team = require('../models/Team');

// @desc    Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate, teamId, assigneeId, status } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (!team.members.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not a member of this team' });
        }

        const task = await Task.create({
            title,
            description,
            priority: priority || 'Medium',
            status: status || 'Todo',
            dueDate,
            team: teamId,
            author: req.user.id,
            assignee: assigneeId || null
        });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Get tasks for a team
exports.getTasks = async (req, res, next) => {
    try {
        const { teamId } = req.query;
        if (!teamId) return res.status(400).json({ message: 'Please provide a teamId' });

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (!team.members.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not a member of this team' });
        }

        const tasks = await Task.find({ team: teamId })
            .populate('author', 'username')
            .populate('assignee', 'username')
            .populate('comments.author', 'username') // Populate comment authors
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const team = await Team.findById(task.team);
        if (!team.members.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not a member of this team' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'username')
            .populate('assignee', 'username')
            .populate('comments.author', 'username');

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const team = await Team.findById(task.team);
        if (!team.members.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not a member of this team' });
        }

        await task.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const team = await Team.findById(task.team);
        if (!team.members.includes(req.user.id)) {
            return res.status(401).json({ message: 'User is not a member of this team' });
        }

        const newComment = {
            text,
            author: req.user.id
        };

        task.comments.push(newComment);
        await task.save();

        // Re-fetch to populate author
        const updatedTask = await Task.findById(req.params.id)
            .populate('author', 'username')
            .populate('assignee', 'username')
            .populate('comments.author', 'username');

        res.status(201).json({
            success: true,
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
};
