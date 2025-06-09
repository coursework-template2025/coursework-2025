// pages/Settings.jsx
import React, { useState, useEffect } from 'react';

export default function Settings({ theme, toggleTheme }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  const handleUsernameChange = () => {
    const newName = prompt('Введите новое имя:');
    if (newName) {
      setUsername(newName);
      localStorage.setItem('username', newName);
    }
  };

  const clearEntries = () => {
    if (window.confirm('Вы уверены, что хотите удалить все записи?')) {
      localStorage.removeItem('entries');
      alert('Все записи удалены.');
    }
  };

  // Определяем цвета для тем
  const themeColors = {
    light: {
      background: '#FAF3E0',
      text: '#3b1f0b',
      border: '#b07f5d',
      buttonBg: '#caa078',
      buttonHoverBg: '#b07f5d',
      buttonColor: '#3b1f0b',
      dangerButtonBg: '#b00020',
      dangerButtonHoverBg: '#8b0018',
      iconFill: '#2E7D32',
    },
    dark: {
      background: '#1f2c1b',
      text: '#f0e6d2',
      border: '#81C784',
      buttonBg: '#6b90c4',
      buttonHoverBg: '#5073a8',
      buttonColor: '#f0e6d2',
      dangerButtonBg: '#c62828',
      dangerButtonHoverBg: '#942020',
      iconFill: '#81C784',
    },
    nature: {
      background: '#d4f5d4',
      text: '#1b3d1b',
      border: '#5aa85a',
      buttonBg: '#74c174',
      buttonHoverBg: '#5aa85a',
      buttonColor: '#ffffff',
      dangerButtonBg: '#a32d2d',
      dangerButtonHoverBg: '#7a2424',
      iconFill: '#2E7D32',
    },
  };

  // Выбираем текущие цвета для темы или light по умолчанию
  const colors = themeColors[theme] || themeColors.light;

  const styles = {
    container: {
      padding: '50px',
      maxWidth: '700px',
      margin: '60px auto',
      backgroundColor: colors.background,
      color: colors.text,
      borderRadius: '20px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      fontFamily: 'Poppins, sans-serif',
      transition: 'background-color 0.4s ease, color 0.4s ease',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '35px',
      fontWeight: 600,
      // Здесь обязательно использовать шаблонную строку:
      borderBottom: `2px solid ${colors.border}`,
      paddingBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    section: {
      marginBottom: '35px',
    },
    label: {
      fontSize: '20px',
      marginBottom: '10px',
      display: 'block',
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: colors.buttonBg,
      color: colors.buttonColor,
      border: 'none',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    dangerButton: {
      backgroundColor: colors.dangerButtonBg,
      color: '#fff',
      padding: '14px 28px',
      fontSize: '18px',
      fontWeight: 'bold',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    icon: {
      width: '28px',
      height: '28px',
      fill: colors.iconFill,
      transition: 'fill 0.4s ease',
    },
  };

  // Хэндлеры для наведения на кнопки, чтобы менять цвет на hover
  const handleMouseOver = (e, type = 'normal') => {
    if (type === 'normal') {
      e.target.style.backgroundColor = colors.buttonHoverBg;
      e.target.style.opacity = '0.9';
      e.target.style.transform = 'scale(1.05)';
    } else if (type === 'danger') {
      e.target.style.backgroundColor = colors.dangerButtonHoverBg;
      e.target.style.opacity = '0.9';
      e.target.style.transform = 'scale(1.05)';
    }
  };

  const handleMouseOut = (e, type = 'normal') => {
    if (type === 'normal') {
      e.target.style.backgroundColor = colors.buttonBg;
      e.target.style.opacity = '1';
      e.target.style.transform = 'scale(1)';
    } else if (type === 'danger') {
      e.target.style.backgroundColor = colors.dangerButtonBg;
      e.target.style.opacity = '1';
      e.target.style.transform = 'scale(1)';
    }
  };

  return (
    <div className="fade-in" style={styles.container}>
      <h2 style={styles.heading}>
        <svg style={styles.icon} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
              10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.74-.3-7.89-2.05
              l1.45-1.45c1.73 1.36 3.97 1.98 6.2 1.6V19.93zM17.24 16.36
              l-1.45 1.45c-1.36-1.73-1.98-3.97-1.6-6.2h2.18c-.49 2.83.3 5.74 2.05 7.89
              zM4.07 13H6.25c.39 2.23 1.01 4.47 2.05 6.2l-1.45 1.45
              c-1.73-1.36-2.98-3.25-3.78-5.31zm7.93-7.93c2.83-.48 5.74.3 7.89 2.05
              l-1.45 1.45c-1.73-1.36-3.97-1.98-6.2-1.6V4.07zM6.76 7.64
              l1.45-1.45c1.36 1.73 1.98 3.97 1.6 6.2H7.64c.49-2.83-.3-5.74-2.05-7.89z" />
        </svg>
        Настройки
      </h2>

      {/* Тема */}
      <div style={styles.section}>
        <label style={styles.label}>
          Текущая тема: <span style={{ fontWeight: 'normal' }}>{theme}</span>
        </label>
        <button
          style={styles.button}
          onClick={toggleTheme}
          onMouseOver={(e) => handleMouseOver(e)}
          onMouseOut={(e) => handleMouseOut(e)}
        >
          Переключить тему
        </button>
      </div>

      {/* Имя пользователя */}
      <div style={styles.section}>
        <label style={styles.label}>
          Имя пользователя: <span style={{ fontWeight: 'normal' }}>{username || 'Не задано'}</span>
        </label>
        <button
          style={styles.button}
          onClick={handleUsernameChange}
          onMouseOver={(e) => handleMouseOver(e)}
          onMouseOut={(e) => handleMouseOut(e)}
        >
          Изменить имя
        </button>
      </div>

      {/* Очистка записей */}
      <div style={styles.section}>
        <button
          style={styles.dangerButton}
          onClick={clearEntries}
          onMouseOver={(e) => handleMouseOver(e, 'danger')}
          onMouseOut={(e) => handleMouseOut(e, 'danger')}
        >
          🗑 Удалить все записи
        </button>
      </div>
    </div>
  );
}
