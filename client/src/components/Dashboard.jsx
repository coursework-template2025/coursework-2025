import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import TaskModal from './TaskModal';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null); // ID only
    const [selectedTeamObj, setSelectedTeamObj] = useState(null); // Full object for owner check
    const [teamMembers, setTeamMembers] = useState([]);

    // Inputs
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    // UI State
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInviteInput, setShowInviteInput] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchUsersTeams();
        }
    }, [user, navigate]);

    const fetchUsersTeams = async () => {
        try {
            const res = await api.get('/teams');
            setTeams(res.data.data);
            return res.data.data;
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTeam = async () => {
        if (!window.confirm("Are you sure you want to delete this team? All tasks will be lost.")) return;
        try {
            await api.delete(`/teams/${selectedTeam}`);
            const updatedTeams = teams.filter(t => t._id !== selectedTeam);
            setTeams(updatedTeams);
            setSelectedTeam(null);
            setSelectedTeamObj(null);
            alert("Team deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting team');
        }
    };

    const createTeam = async () => {
        if (!newTeamName.trim()) return;
        try {
            const res = await api.post('/teams', { name: newTeamName });
            setTeams([...teams, res.data.data]);
            handleTeamSelect(res.data.data._id); // Auto-select logic needs refinement as handleTeamSelect expects ID. 
            // Better to just refresh list or verify if handleTeamSelect performs fetch.
            // Simplified:
            setNewTeamName('');
            setTeamMembers([user.user]);
            // Actually, handleTeamSelect triggers everything nicely if we call it
            // handleTeamSelect(res.data.data._id); // We need to be careful about state updates
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating team');
        }
    };

    const fetchTasks = async (teamId) => {
        if (!teamId) return;
        try {
            const res = await api.get(`/tasks?teamId=${teamId}`);
            setTasks(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMembers = async (teamId) => {
        if (!teamId) return;
        try {
            const res = await api.get(`/teams/${teamId}/members`);
            setTeamMembers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTeamSelect = (teamId) => {
        setSelectedTeam(teamId);
        const teamObj = teams.find(t => t._id === teamId);
        setSelectedTeamObj(teamObj);

        fetchTasks(teamId);
        fetchMembers(teamId);
        setShowInviteInput(false);
        setInviteEmail('');
    };

    const inviteMember = async () => {
        if (!inviteEmail.trim()) return;
        try {
            await api.post(`/teams/${selectedTeam}/members`, { email: inviteEmail });
            alert('Member added successfully');
            setInviteEmail('');
            setShowInviteInput(false);
            fetchMembers(selectedTeam);
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding member');
        }
    };

    const removeMember = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            await api.delete(`/teams/${selectedTeam}/members/${userId}`);
            fetchMembers(selectedTeam);
        } catch (err) {
            alert(err.response?.data?.message || 'Error removing member');
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await api.post('/tasks', {
                title: newTaskTitle,
                teamId: selectedTeam,
                priority: newTaskPriority,
                status: 'Todo'
            });
            setNewTaskTitle('');
            setNewTaskPriority('Medium');
            fetchTasks(selectedTeam);
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating task');
        }
    };

    const openTaskModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const updateStatus = async (taskId, currentStatus) => {
        const statusMap = {
            'Todo': 'In Progress',
            'In Progress': 'Done',
            'Done': 'Todo'
        };
        const nextStatus = statusMap[currentStatus];

        try {
            const updatedTasks = tasks.map(t =>
                t._id === taskId ? { ...t, status: nextStatus } : t
            );
            setTasks(updatedTasks);
            await api.put(`/tasks/${taskId}`, { status: nextStatus });
        } catch (err) {
            console.error(err);
            fetchTasks(selectedTeam);
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            setTasks(tasks.filter(t => t._id !== taskId));
            await api.delete(`/tasks/${taskId}`);
        } catch (err) {
            console.error(err);
            fetchTasks(selectedTeam);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const todoTasks = tasks.filter(t => t.status === 'Todo');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');

    return (
        <>
            <nav className="nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontWeight: 900, background: '#579dff', padding: '5px 10px', borderRadius: '4px', color: '#1d2125' }}>TaskFlow</h2>
                    <span style={{ color: '#9fadbc', fontSize: '0.9em' }}>Workspace</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user?.user?.isAdmin && (
                        <button
                            onClick={() => navigate('/admin')}
                            style={{ background: '#646cff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Admin Panel
                        </button>
                    )}
                    <span style={{ color: '#9fadbc' }}>{user?.user?.username}</span>
                    <button className="secondary" onClick={logout}>Logout</button>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="sidebar">
                    <h3 style={{ color: '#9fadbc', textTransform: 'uppercase', fontSize: '0.8rem' }}>Your Teams</h3>
                    {teams.map(team => (
                        <div
                            key={team._id}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                background: selectedTeam === team._id ? '#2c3e50' : 'transparent',
                                color: selectedTeam === team._id ? '#fff' : '#9fadbc',
                                fontWeight: 500
                            }}
                            onClick={() => handleTeamSelect(team._id)}
                        >
                            # {team.name}
                        </div>
                    ))}

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                        <input
                            placeholder="+ Create Team"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            style={{ width: '100%', marginBottom: '0.5rem', boxSizing: 'border-box' }}
                        />
                        {newTeamName && <button onClick={createTeam} style={{ width: '100%' }}>Create</button>}
                    </div>

                    {/* Team Members Section */}
                    {selectedTeam && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ color: '#9fadbc', textTransform: 'uppercase', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Members
                                <button
                                    onClick={() => setShowInviteInput(!showInviteInput)}
                                    style={{ padding: '0 5px', fontSize: '1.2rem', background: 'transparent', color: '#579dff' }}
                                    title="Invite Member"
                                >
                                    +
                                </button>
                            </h3>

                            {showInviteInput && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <input
                                        placeholder="Enter email..."
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        style={{ width: '100%', marginBottom: '5px', boxSizing: 'border-box' }}
                                    />
                                    <button onClick={inviteMember} style={{ width: '100%', fontSize: '0.8rem' }}>Send Invite</button>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {teamMembers.map(member => (
                                    <div key={member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', color: '#dcdfe4', padding: '4px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#579dff', color: '#1d2125', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                {member.username.charAt(0).toUpperCase()}
                                            </div>
                                            {member.username} {member._id === user.user.id && '(You)'}
                                        </div>

                                        {/* Remove Button: Only show if Current User is Owner AND Member being removed is NOT Owner */}
                                        {selectedTeamObj && selectedTeamObj.owner === user.user.id && member._id !== user.user.id && (
                                            <button
                                                onClick={() => removeMember(member._id)}
                                                style={{ background: 'transparent', color: '#ff5630', padding: '0 5px', fontSize: '0.8rem' }}
                                                title="Remove Member"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Delete Team Button (Owner Only) */}
                            {selectedTeamObj && selectedTeamObj.owner === user.user.id && (
                                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                                    <button
                                        onClick={deleteTeam}
                                        style={{ width: '100%', background: '#ff5630', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        Delete Team
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="main-content">
                    {selectedTeam ? (
                        <div className="kanban-board">

                            {/* TODO COLUMN */}
                            <div className="kanban-column">
                                <div className="column-header">To Do <span style={{ color: '#579dff' }}>{todoTasks.length}</span></div>
                                <div className="task-list">
                                    {todoTasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onClick={() => openTaskModal(task)}
                                            onNext={() => updateStatus(task._id, task.status)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                                <form onSubmit={createTask} style={{ marginTop: 'auto', display: 'flex', gap: '5px' }}>
                                    <input
                                        placeholder="+ Add a card"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        style={{ flex: 1, background: 'transparent', border: 'none', padding: '8px 0', color: '#9fadbc' }}
                                    />
                                    <select
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value)}
                                        style={{ width: '80px', padding: '2px', fontSize: '0.8em', background: '#323940' }}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </form>
                            </div>

                            {/* IN PROGRESS COLUMN */}
                            <div className="kanban-column">
                                <div className="column-header">In Progress <span style={{ color: '#ffab00' }}>{inProgressTasks.length}</span></div>
                                <div className="task-list">
                                    {inProgressTasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onClick={() => openTaskModal(task)}
                                            onNext={() => updateStatus(task._id, task.status)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* DONE COLUMN */}
                            <div className="kanban-column">
                                <div className="column-header">Done <span style={{ color: '#36b37e' }}>{doneTasks.length}</span></div>
                                <div className="task-list">
                                    {doneTasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onClick={() => openTaskModal(task)}
                                            onNext={() => updateStatus(task._id, task.status)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9fadbc', flexDirection: 'column' }}>
                            <h1>Welcome to Your Board</h1>
                            <p>Select or create a team from the sidebar to start working.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedTask && (
                <TaskModal
                    task={selectedTask}
                    teamMembers={teamMembers}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={() => fetchTasks(selectedTeam)}
                />
            )}
        </>
    );
};

const TaskCard = ({ task, onClick, onNext, onDelete }) => {
    return (
        <div className="task-card" onClick={onClick}>
            <div className="task-title">{task.title}</div>
            <div className="task-meta">
                <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                {task.assignee && (
                    <span style={{ fontSize: '0.7em', background: '#579dff', color: '#1d2125', padding: '1px 4px', borderRadius: '4px' }}>
                        {task.assignee.username ? task.assignee.username : 'Assigned'}
                    </span>
                )}
                {task.dueDate && <span style={{ fontSize: '0.7em', color: '#ffb' }}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                <div style={{ display: 'flex', gap: '5px' }}>
                    {task.status !== 'Done' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            title="Move to next status"
                        >
                            →
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'transparent', color: '#ff5630' }}
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
