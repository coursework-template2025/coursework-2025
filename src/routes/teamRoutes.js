const express = require('express');
const { createTeam, addMember, getTeamMembers, getTeams, removeMember, deleteTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All team routes are protected

router.route('/')
    .post(createTeam)
    .get(getTeams);
router.delete('/:id', deleteTeam);
router.post('/:id/members', addMember);
router.get('/:id/members', getTeamMembers);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
