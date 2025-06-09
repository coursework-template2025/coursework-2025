import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import EntryListItem from '../components/EntryListItem';

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

export default function Home({ theme }) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
    localStorage.setItem('entries', JSON.stringify(updated));
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(search.toLowerCase()) ||
    entry.text.toLowerCase().includes(search.toLowerCase())
  );

  const styles = useMemo(() => {
    const colors = themeColors[theme] || themeColors.light;

    return {
      colors,
      container: {
        padding: '40px',
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: 'Poppins, sans-serif',
        transition: 'background-color 0.4s ease, color 0.4s ease',
        overflowY: 'auto',
        boxSizing: 'border-box',
      },
      heading: {
        fontSize: '32px',
        marginBottom: '35px',
        fontWeight: 600,
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '10px',
      },
      searchSection: {
        marginBottom: '35px',
      },
      label: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginRight: '10px',
        display: 'inline-block',
        marginBottom: '10px',
      },
      input: {
        padding: '12px 15px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        width: '320px',
        fontSize: '16px',
        color: colors.text,
        backgroundColor: colors.background,
        transition: 'border-color 0.3s ease',
        outline: 'none',
      },
      button: {
        backgroundColor: colors.buttonBg,
        color: colors.buttonColor,
        border: 'none',
        padding: '14px 28px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '20px',
      },
      entryList: {
        marginTop: '30px',
      },
    };
  }, [theme]);

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = styles.colors.buttonHoverBg;
    e.target.style.opacity = '0.9';
    e.target.style.transform = 'scale(1.05)';
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = styles.colors.buttonBg;
    e.target.style.opacity = '1';
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div className="fade-in" style={styles.container}>
      <h1 style={styles.heading}>Главная страница</h1>

      <Link to="/form">
        <button
          style={styles.button}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          ✍ Создать новую запись
        </button>
      </Link>

      <div style={styles.searchSection}>
        <label style={styles.label} htmlFor="searchInput">Поиск:</label>
        <input
          id="searchInput"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по заголовку и тексту"
          style={styles.input}
        />
      </div>

      <div style={styles.entryList}>
        {filteredEntries.length === 0 && <p>Записи не найдены.</p>}
        {filteredEntries.map(entry => (
          <EntryListItem
            key={entry.id}
            entry={entry}
            onDelete={() => handleDelete(entry.id)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
