import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function EntryView({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const found = entries.find(e => e.id === Number(id));
    setEntry(found);
  }, [id]);

  const themeColors = {
    light: {
      background: '#FAF3E0',
      text: '#3b1f0b',
      cardBg: '#fff',
      tagBg: '#caa078',
      tagColor: '#3b1f0b',
      buttonBg: '#caa078',
      buttonHoverBg: '#b07f5d',
      buttonColor: '#3b1f0b',
    },
    dark: {
      background: '#1f2c1b',
      text: '#f0e6d2',
      cardBg: '#2f3e2c',
      tagBg: '#81C784',
      tagColor: '#1f2c1b',
      buttonBg: '#6b90c4',
      buttonHoverBg: '#5073a8',
      buttonColor: '#f0e6d2',
    },
    nature: {
      background: '#d4f5d4',
      text: '#1b3d1b',
      cardBg: '#ffffff',
      tagBg: '#74c174',
      tagColor: '#ffffff',
      buttonBg: '#74c174',
      buttonHoverBg: '#5aa85a',
      buttonColor: '#ffffff',
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '60px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      fontFamily: 'Poppins, sans-serif',
      transition: 'background-color 0.3s ease',
    },
    card: {
      backgroundColor: colors.cardBg,
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      maxWidth: '800px',
      width: '100%',
      color: colors.text,
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    markdown: {
      fontSize: '18px',
      lineHeight: '1.7',
      marginBottom: '25px',
    },
    tags: {
      marginBottom: '30px',
    },
    tag: {
      backgroundColor: colors.tagBg,
      color: colors.tagColor,
      borderRadius: '12px',
      padding: '6px 14px',
      marginRight: '10px',
      fontWeight: '500',
      fontSize: '14px',
      display: 'inline-block',
    },
    notFound: {
      fontSize: '22px',
      color: colors.text,
      marginBottom: '25px',
      textAlign: 'center',
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
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = colors.buttonHoverBg;
    e.target.style.transform = 'scale(1.05)';
    e.target.style.opacity = '0.9';
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = colors.buttonBg;
    e.target.style.transform = 'scale(1)';
    e.target.style.opacity = '1';
  };

  if (!entry) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.notFound}>Запись не найдена</p>
          <button
            style={styles.button}
            onClick={() => navigate('/')}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{entry.title}</h2>

        <div style={styles.markdown}>
          <ReactMarkdown>{entry.text}</ReactMarkdown>
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div style={styles.tags}>
            {entry.tags.map(tag => (
              <span key={tag} style={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/tags')}
          style={styles.button}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Назад
        </button>
      </div>
    </div>
  );
}
