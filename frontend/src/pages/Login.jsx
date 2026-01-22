import { login } from '../api';
import { useState } from 'react';

export default function Login({ onLogin, onSwitch }) {
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLogin();
        } else {
          setError('Неверные данные');
        }
      })
      .catch(() => setError('Ошибка сервера'));
  }

  return (
    <form onSubmit={submit}>
      <h2>Вход</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Пароль" />

      <button>Войти</button>

      <p style={{ marginTop: '10px' }}>
        Нет аккаунта?{' '}
        <button type="button" onClick={onSwitch}>
          Зарегистрироваться
        </button>
      </p>
    </form>
  );
}
