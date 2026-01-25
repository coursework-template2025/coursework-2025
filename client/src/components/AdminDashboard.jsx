import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || !user.user.isAdmin) {
            navigate('/dashboard');
        } else {
            fetchStats();
            fetchUsers();
        }
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers(); // Refresh list
            fetchStats(); // Refresh count
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        }
    };

    return (
        <div style={{ padding: '2rem', color: '#dcdfe4', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                <button className="secondary" onClick={() => navigate('/dashboard')}>Back to App</button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div style={cardStyle}>
                        <h3>Users</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.userCount}</p>
                    </div>
                    <div style={cardStyle}>
                        <h3>Teams</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.teamCount}</p>
                    </div>
                    <div style={cardStyle}>
                        <h3>Tasks</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.taskCount}</p>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div style={{ background: '#22272b', padding: '1rem', borderRadius: '8px' }}>
                <h2>Registered Users</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>Username</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Admin</th>
                                <th style={{ padding: '10px' }}>Joined</th>
                                <th style={{ padding: '10px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '10px', fontSize: '0.85rem', color: '#888' }}>{u._id}</td>
                                    <td style={{ padding: '10px' }}>{u.username}</td>
                                    <td style={{ padding: '10px' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>{u.isAdmin ? '✅' : '❌'}</td>
                                    <td style={{ padding: '10px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        {!u.isAdmin && (
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                style={{ background: '#ff5630', padding: '4px 8px', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    background: '#2c3e50',
    padding: '1.5rem',
    borderRadius: '8px',
    flex: '1',
    minWidth: '200px',
    textAlign: 'center'
};

export default AdminDashboard;
