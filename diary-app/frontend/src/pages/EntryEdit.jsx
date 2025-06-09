import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EntryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const entry = entries.find(e => e.id === Number(id));
    if (entry) {
      setTitle(entry.title);
      setText(entry.text);
    } else {
      alert('Запись не найдена');
      navigate('/');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert('Пожалуйста, заполните заголовок и текст');
      return;
    }

    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const updatedEntries = entries.map(e =>
      e.id === Number(id) ? { ...e, title, text, updatedAt: new Date().toISOString() } : e
    );
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
    navigate('/');
  };

  const styles = {
    container: {
      padding: '40px',
      marginLeft: '60px',
      marginRight: 'auto',
      marginTop: '50px',
      maxWidth: '800px',
      backgroundColor: '#fff7ef',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '30px',
      fontWeight: 600,
      color: '#3b1f0b',
      borderBottom: '2px solid #caa078',
      paddingBottom: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '20px',
      color: '#5a3825',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '18px',
      marginBottom: '30px',
      borderRadius: '10px',
      border: '1px solid #d6b08d',
      backgroundColor: '#fffaf5',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      minHeight: '160px',
      padding: '14px 16px',
      fontSize: '18px',
      marginBottom: '30px',
      borderRadius: '10px',
      border: '1px solid #d6b08d',
      backgroundColor: '#fffaf5',
      resize: 'vertical',
      outline: 'none',
    },
    button: {
      backgroundColor: '#caa078',
      color: '#3b1f0b',
      padding: '14px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.heading}>Редактировать запись</h2>

      <label style={styles.label}>Заголовок</label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Текст</label>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={styles.textarea}
      />

      <button
        type="submit"
        style={styles.button}
        onMouseOver={e => e.target.style.backgroundColor = '#b07f5d'}
        onMouseOut={e => e.target.style.backgroundColor = '#caa078'}
      >
        Сохранить
      </button>
    </form>
  );
}
