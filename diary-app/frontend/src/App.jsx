import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import Home from './pages/Home';
import EntryForm from './pages/EntryForm';
import EntryView from './pages/EntryView';
import EntryEdit from './pages/EntryEdit';
import Tags from './pages/Tags';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const { user, login } = useContext(UserContext);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // 1) Плавное переключение темы
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [theme]);

  // 2) При монтировании — восстановить user из localStorage (если есть)
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Исправлено с 'currentUser' на 'user'
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      login(userData.username);
    }
  }, [login]);

  const toggleTheme = () => {
    setTheme(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'nature' : 'light'
    );
  };

  if (loading) return <LoadingScreen />;
  if (!user) return <Login />;

  return (
    <div className={`app-container ${theme} fade-in`}>
      <aside className="sidebar">
        <h2>DIARY</h2>
        <nav>
          <ul>
            <li><Link to="/">Все записи</Link></li>
            <li><Link to="/form">Создать запись</Link></li>
            <li><Link to="/tags">Теги</Link></li>
            <li><Link to="/settings">Настройки</Link></li>
            <li><Link to="/logout">Выйти</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<EntryForm />} />
          <Route path="/view/:id" element={<EntryView />} />
          <Route path="/edit/:id" element={<EntryEdit />} />
          <Route path="/tags" element={<Tags />} />
          <Route
            path="/settings"
            element={<Settings theme={theme} toggleTheme={toggleTheme} />}
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
