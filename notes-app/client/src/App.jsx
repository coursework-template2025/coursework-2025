import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import './index.css';

axios.defaults.baseURL = 'http://localhost:5000';

const NotesPage = ({ userId, token, handleLogout }) => {
  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState(''); // Новое состояние для предмета
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const location = useLocation();

  // Получаем предмет из URL
  const queryParams = new URLSearchParams(location.search);
  const selectedSubject = queryParams.get('subject') || 'Free';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем заметки
        const notesRes = await axios.get('/api/notes', {
          headers: { Authorization: `Bearer ${token}` },
          params: { subject: selectedSubject },
        });
        setNotes(notesRes.data);

        // Загружаем удалённые заметки
        const deletedNotesRes = await axios.get('/api/deleted-notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeletedNotes(deletedNotesRes.data);
      } catch (err) {
        setError('Failed to fetch data: ' + (err.response?.data?.error || err.message));
      }
    };
    if (token) fetchData();
  }, [token, selectedSubject]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        setScreenshot(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        setScreenshot(null);
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot({ file, preview: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('subject', subject || selectedSubject);
      if (screenshot) formData.append('screenshot', screenshot.file);
      const res = await axios.post('/api/notes', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([...notes, res.data]);
      setTitle('');
      setContent('');
      setSubject('');
      setScreenshot(null);
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to add note');
    }
  };

  const handleEditNote = (note) => {
    setEditNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
    setScreenshot(note.screenshotPath ? { preview: `http://localhost:5000${note.screenshotPath}` } : null);
  };

  const handleUpdateNote = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('subject', subject || selectedSubject);
      if (screenshot && screenshot.file) formData.append('screenshot', screenshot.file);
      const res = await axios.put(`/api/notes/${editNoteId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.map(note => (note._id === editNoteId ? res.data : note)));
      setEditNoteId(null);
      setTitle('');
      setContent('');
      setSubject('');
      setScreenshot(null);
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    const noteToDelete = notes.find(note => note._id === id);
    if (noteToDelete) {
      try {
        await axios.delete(`/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.post('/api/deleted-notes', {
          title: noteToDelete.title,
          content: noteToDelete.content,
          screenshotPath: noteToDelete.screenshotPath,
          subject: noteToDelete.subject,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notes.filter(note => note._id !== id));
        setDeletedNotes([...deletedNotes, noteToDelete]);
      } catch (err) {
        setError('Failed to delete note: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleRestoreNote = async (id) => {
    const noteToRestore = deletedNotes.find(note => note._id === id);
    if (noteToRestore) {
      try {
        const formData = new FormData();
        formData.append('title', noteToRestore.title);
        formData.append('content', noteToRestore.content);
        formData.append('subject', noteToRestore.subject);
        const res = await axios.post('/api/notes', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.delete(`/api/deleted-notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes([...notes, res.data]);
        setDeletedNotes(deletedNotes.filter(note => note._id !== id));
      } catch (err) {
        setError('Failed to restore note: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`/api/deleted-notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedNotes(deletedNotes.filter(note => note._id !== id));
    } catch (err) {
      setError('Failed to delete note permanently: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleClearTrash = async () => {
    try {
      await axios.delete('/api/deleted-notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedNotes([]);
    } catch (err) {
      setError('Failed to clear trash: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="main-container">
      <div className="content-container">
        <div className="header">
          <h1>Заметки</h1>
          <div className="flex gap-2">
            <button onClick={handleLogout} className="logout-button">Выйти</button>
            <button onClick={() => setShowTrash(!showTrash)} className="trash-button">Корзина</button>
          </div>
        </div>

        <div className="form-container">
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Описание"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Предмет (не обязательно)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {screenshot && (
            <div className="preview-container">
              <p>Preview:</p>
              <img src={screenshot.preview} alt="Preview" />
            </div>
          )}
          {editNoteId ? (
            <button onClick={handleUpdateNote} className="update-button">Изменить заметку</button>
          ) : (
            <button onClick={handleAddNote} className="add-button">Добавить заметку</button>
          )}
        </div>

        <div>
          {notes.length === 0 ? (
            <p className="notes-empty">Пока нет заметок. Добавьте одну чтобы начать</p>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note._id} className="note-card">
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                  {note.screenshotPath && (
                    <img src={`http://localhost:5000${note.screenshotPath}`} alt="Screenshot" />
                  )}
                  <p className="created-date">
                    Created: {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown date'}
                  </p>
                  <div className="note-actions">
                    <button onClick={() => handleEditNote(note)} className="edit-button">Изменить</button>
                    <button onClick={() => handleDeleteNote(note._id)} className="delete-button">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTrash && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Корзина</h2>
              {deletedNotes.length === 0 ? (
                <p className="notes-empty">Нет удаленных сообщений</p>
              ) : (
                <div className="notes-grid">
                  {deletedNotes.map(note => (
                    <div key={note._id} className="note-card">
                      <h2>{note.title}</h2>
                      <p>{note.content}</p>
                      {note.screenshotPath && (
                        <img src={`http://localhost:5000${note.screenshotPath}`} alt="Screenshot" />
                      )}
                      <p className="created-date">
                        Created: {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown date'}
                      </p>
                      <div className="note-actions">
                        <button onClick={() => handleRestoreNote(note._id)} className="restore-button">Очистить</button>
                        <button onClick={() => handlePermanentDelete(note._id)} className="delete-button">Удалить навсегда</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {deletedNotes.length > 0 && (
                <button onClick={handleClearTrash} className="clear-trash-button">Clear Trash</button>
              )}
              <button onClick={() => setShowTrash(false)} className="close-modal-button">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleRegister = async () => {
    setError('');
    try {
      const res = await axios.post('/api/register', { username, password });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        alert('Регистрация успешна!!! Пожалуйста войдите.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('/api/login', { username, password });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setUserId(res.data.userId);
        setToken(res.data.token);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError('Ошибка авторизации: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setToken(null);
  };

  if (!userId) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>{isLogin ? 'Авторизация' : 'Регистрация'}</h1>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="auth-button"
          >
            {isLogin ? 'Авторизоваться' : 'Зарегистрироваться'}
          </button>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="switch-button"
          >
            {isLogin ? 'Перейти к регистрации' : 'Перейти к авторизации'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        <Route
          path="/notes"
          element={<NotesPage userId={userId} token={token} handleLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
};

export default App;