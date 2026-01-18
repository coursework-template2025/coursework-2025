import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import AddNote from './pages/AddNote';
import Glossary from './pages/Glossary';
import Sources from './pages/Sources';

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [mode, setMode] = useState('login');
  const [reload, setReload] = useState(0);

  /* ===== AUTH SCREENS ===== */
  if (!auth) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          {mode === 'login' ? (
            <Login
              onLogin={() => setAuth(true)}
              onSwitch={() => setMode('register')}
            />
          ) : (
            <Register
              onRegister={() => setMode('login')}
              onSwitch={() => setMode('login')}
            />
          )}
        </div>
      </div>
    );
  }

  /* ===== MAIN APP ===== */
  return (
    <div className="app">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Заметки</h2>
        </div>

        <AddNote onAdd={() => setReload(r => r + 1)} />

        <Glossary />
        <Sources />

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem('token');
            setAuth(false);
            setMode('login');
          }}
        >
          Выйти
        </button>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="content">
        <header className="content-header">
          <h1>Система заметок</h1>
        </header>

        <Notes reload={reload} />
      </main>
    </div>
  );
}
