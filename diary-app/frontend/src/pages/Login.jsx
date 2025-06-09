import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h1>Добро пожаловать в <span style={{ color: '#4a90e2' }}>MyDiary</span>!</h1>
      <p>Пожалуйста, введите своё имя пользователя, чтобы продолжить.</p>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Введите имя пользователя"
          className="login-input"
        />
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
}
