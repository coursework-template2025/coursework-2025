// src/pages/EntriesList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate, Link } from 'react-router-dom';

export default function EntriesList({ theme }) {
  const { user, logout } = useContext(UserContext);
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  // Загружаем только записи текущего пользователя
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Берём весь объект users из localStorage
    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    // Если вдруг нет ячейки с currentUser, сразу выйти
    if (!allUsers[user]) {
      logout();
      return;
    }

    // Инициализируем записи, если их нет
    const userData = allUsers[user];
    setEntries(userData.entries || []);
  }, [user, logout, navigate]);

  const addEntry = () => {
    if (!text.trim()) return;

    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    // Если ячейки под текущего пользователя вдруг нет, создаём её
    if (!allUsers[user]) {
      allUsers[user] = { entries: [] };
    }
    const userData = allUsers[user];

    const newEntry = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
    };

    // Собираем новый массив и записываем
    const updatedEntries = [...(userData.entries || []), newEntry];
    allUsers[user].entries = updatedEntries;
    localStorage.setItem('users', JSON.stringify(allUsers));

    setEntries(updatedEntries);
    setText('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Стиль “по теме” (точно так же, как в Settings и остальных)
  const themeColors = {
    light: {
      background: '#FAF3E0',
      text: '#3b1f0b',
      border: '#b07f5d',
      buttonBg: '#caa078',
      buttonHoverBg: '#b07f5d',
      buttonColor: '#3b1f0b',
    },
    dark: {
      background: '#1f2c1b',
      text: '#f0e6d2',
      border: '#81C784',
      buttonBg: '#6b90c4',
      buttonHoverBg: '#5073a8',
      buttonColor: '#f0e6d2',
    },
    nature: {
      background: '#d4f5d4',
      text: '#1b3d1b',
      border: '#5aa85a',
      buttonBg: '#74c174',
      buttonHoverBg: '#5aa85a',
      buttonColor: '#ffffff',
    },
  };
  const colors = themeColors[theme] || themeColors.light;

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      boxSizing: 'border-box',
      fontFamily: 'Poppins, sans-serif',
      transition: 'background-color 0.4s ease, color 0.4s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    h2: {
      fontSize: '28px',
      margin: 0,
      padding: 0,
    },
    logoutBtn: {
      backgroundColor: colors.buttonBg,
      color: colors.buttonColor,
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    addSection: {
      marginBottom: '30px',
    },
    textarea: {
      width: '100%',
      height: '80px',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      boxSizing: 'border-box',
      marginBottom: '10px',
      backgroundColor: '#fff',
      color: '#000',
      resize: 'vertical',
    },
    addButton: {
      backgroundColor: colors.buttonBg,
      color: colors.buttonColor,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    entriesList: {
      marginTop: '20px',
    },
    entryItem: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    entryDate: {
      fontSize: '12px',
      color: '#555',
      marginTop: '8px',
    },
    viewLink: {
      marginTop: '8px',
      display: 'inline-block',
      textDecoration: 'none',
      color: colors.buttonBg,
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.h2}>Привет, {user}!</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>

      <div style={styles.addSection}>
        <textarea
          style={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Новая запись..."
        />
        <button style={styles.addButton} onClick={addEntry}>
          Добавить
        </button>
      </div>

      <div style={styles.entriesList}>
        {entries.length === 0 ? (
          <p>У вас ещё нет записей.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} style={styles.entryItem}>
              <p>{entry.text}</p>
              <div style={styles.entryDate}>{entry.date}</div>
              <Link to={`/view/${entry.id}`} style={styles.viewLink}>
                Просмотреть
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
