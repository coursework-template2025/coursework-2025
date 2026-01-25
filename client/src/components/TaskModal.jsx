import React, { useState, useEffect } from 'react';
import api from '../api';

const TaskModal = ({ task, teamMembers, onClose, onUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [assignee, setAssignee] = useState(task.assignee?._id || task.assignee || '');
    const [newComment, setNewComment] = useState('');

    // Separate state for comments to update optimistically or after fetch
    // Actually we can just rely on the 'task' prop updates if parent refetches, 
    // but better to allow local updates? For simplicity, we trigger parent update.

    const handleSave = async () => {
        try {
            await api.put(`/tasks/${task._id}`, {
                title,
                description,
                status,
                priority,
                dueDate,
                assignee: assignee || null
            });
            onUpdate(); // Refresh parent
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to update task');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tasks/${task._id}/comments`, { text: newComment });
            setNewComment('');
            onUpdate(); // This will re-fetch the task and show new comment
        } catch (err) {
            console.error(err);
            alert('Failed to add comment');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Task</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option>Todo</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Assignee</label>
                            <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                                <option value="">Unassigned</option>
                                {teamMembers && teamMembers.map(member => (
                                    <option key={member._id} value={member._id}>{member.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a more detailed description..."
                        />
                    </div>

                    <div className="comments-section">
                        <h3>Comments</h3>
                        <div className="comments-list">
                            {task.comments && task.comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <strong>{comment.author?.username || 'Unknown'}:</strong> {comment.text}
                                    <div className="comment-date">{new Date(comment.createdAt).toLocaleString()}</div>
                                </div>
                            ))}
                            {(!task.comments || task.comments.length === 0) && <p style={{ color: '#888', fontStyle: 'italic' }}>No comments yet.</p>}
                        </div>
                        <form onSubmit={handleAddComment} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={handleSave} className="save-btn">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
