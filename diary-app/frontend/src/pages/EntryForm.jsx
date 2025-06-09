// pages/EntryForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EntryForm({ theme }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

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

  const colors = themeColors[theme] || themeColors.light;

  const styles = {
    form: {
      padding: '50px',
      maxWidth: '900px',
      marginLeft: '80px',
      marginTop: '60px',
      backgroundColor: colors.background,
      color: colors.text,
      borderRadius: '20px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      fontFamily: 'Poppins, sans-serif',
      transition: 'background-color 0.4s ease, color 0.4s ease',
    },
    heading: {
      fontSize: '36px',
      marginBottom: '35px',
      fontWeight: 600,
      borderBottom: `2px solid ${colors.border}`,
      paddingBottom: '10px',
    },
    label: {
      fontSize: '20px',
      marginBottom: '10px',
      display: 'block',
      fontWeight: 'bold',
      marginTop: '25px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '18px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      minHeight: '150px',
      padding: '12px',
      fontSize: '18px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      marginBottom: '10px',
    },
    button: {
      backgroundColor: colors.buttonBg,
      color: colors.buttonColor,
      border: 'none',
      padding: '14px 28px',
      fontSize: '18px',
      fontWeight: 'bold',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '30px',
    },
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = colors.buttonHoverBg;
    e.target.style.transform = 'scale(1.05)';
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = colors.buttonBg;
    e.target.style.transform = 'scale(1)';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert('Пожалуйста, заполните заголовок и текст');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const newEntry = {
      id: Date.now(),
      title,
      text,
      date: new Date().toISOString(),
      tags: tagArray,
    };

    const saved = JSON.parse(localStorage.getItem('entries')) || [];
    saved.push(newEntry);
    localStorage.setItem('entries', JSON.stringify(saved));

    navigate('/');
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2 style={styles.heading}>Создать запись</h2>

      <label style={styles.label} htmlFor="title">Заголовок</label>
      <input
        id="title"
        style={styles.input}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Введите заголовок"
      />

      <label style={styles.label} htmlFor="text">Текст</label>
      <textarea
        id="text"
        style={styles.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Введите текст записи"
      />

      <label style={styles.label} htmlFor="tags">Теги (через запятую)</label>
      <input
        id="tags"
        style={styles.input}
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="например: работа, личное, заметки"
      />

      <button
        type="submit"
        style={styles.button}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Сохранить
      </button>
    </form>
  );
}
