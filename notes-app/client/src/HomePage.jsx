import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = ({ token }) => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  // Статический список предметов
  const predefinedSubjects = [
    'Проектирование веб-приложений',
    'ООП',
    'ПБП',
    'ОИБ',
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Объединяем статические предметы с динамическими, убираем дубликаты
        const allSubjects = [...new Set([...predefinedSubjects, ...res.data.filter(subject => subject !== 'Free')])];
        setSubjects(allSubjects);
      } catch (err) {
        setError('Failed to fetch subjects: ' + (err.response?.data?.error || err.message));
      }
    };
    if (token) fetchSubjects();
  }, [token]);

  return (
    <div className="main-container">
      <div className="content-container">
        <h1>Предметы</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="subjects-grid">
          {subjects.map(subject => (
            <Link
              key={subject}
              to={`/notes?subject=${encodeURIComponent(subject)}`}
              className="subject-card"
            >
              <h2>{subject}</h2>
            </Link>
          ))}
          <Link
            to="/notes?subject=Free"
            className="subject-card"
          >
            <h2>Свободные заметки</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;