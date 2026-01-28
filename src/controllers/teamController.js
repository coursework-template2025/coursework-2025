const Team = require('../models/Team');
const User = require('../models/User');
const Task = require('../models/Task');

// ... (existing code)

// @desc    Delete team and associated tasks
// @route   DELETE /api/teams/:id
// @access  Private (Owner only)
exports.deleteTeam = async (req, res, next) => {
    try {
        const teamId = req.params.id;
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check ownership
        if (team.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User is not authorized to delete this team' });
        }

        // Delete associated tasks
        await Task.deleteMany({ team: teamId });

        // Delete team
        await Team.findByIdAndDelete(teamId);

        res.status(200).json({
            success: true,
            message: 'Team and associated tasks deleted',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({ members: req.user.id });

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res, next) => {
    try {
        const { name } = req.body;

        const team = await Team.create({
            name,
            owner: req.user.id,
            members: [req.user.id] // Owner is also a member
        });

        res.status(201).json({
            success: true,
            data: team
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private (Owner only)
exports.addMember = async (req, res, next) => {
    try {
        const { email } = req.body;
        const teamId = req.params.id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check ownership
        if (team.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User is not authorized to add members to this team' });
        }

        const userToAdd = await User.findOne({ email });

        if (!userToAdd) {
            return res.status(404).json({ message: 'User with this email not found' });
        }

        // Check if already member
        if (team.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already a member of this team' });
        }

        team.members.push(userToAdd._id);
        await team.save();

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Private (Team members only)
exports.getTeamMembers = async (req, res, next) => {
    try {
        const teamId = req.params.id;
        const team = await Team.findById(teamId).populate('members', 'username email');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if requester is a member
        const isMember = team.members.some(member => member._id.toString() === req.user.id);

        if (!isMember) {
            return res.status(401).json({ message: 'Not authorized to view members of this team' });
        }

        res.status(200).json({
            success: true,
            count: team.members.length,
            data: team.members
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private (Owner only)
exports.removeMember = async (req, res, next) => {
    try {
        const { id: teamId, userId } = req.params;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check ownership
        if (team.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User is not authorized to remove members from this team' });
        }

        // Prevent removing self (owner)
        if (userId === req.user.id) {
            return res.status(400).json({ message: 'Owner cannot remove themselves from the team' });
        }

        // Check if user is in team
        if (!team.members.includes(userId)) {
            return res.status(404).json({ message: 'User is not a member of this team' });
        }

        // Remove member
        team.members = team.members.filter(member => member.toString() !== userId);
        await team.save();

        res.status(200).json({
            success: true,
            message: 'Member removed',
            data: team
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({ members: req.user.id });

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        next(error);
    }
};
