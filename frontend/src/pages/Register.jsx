import { register } from '../api';
import { useState } from 'react';

export default function Register({ onRegister, onSwitch }) {
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    register(email, password)
      .then(data => {
        if (data.message) {
          onRegister();
        } else {
          setError('Ошибка регистрации');
        }
      })
      .catch(() => setError('Ошибка сервера'));
  }

  return (
    <form onSubmit={submit}>
      <h2>Регистрация</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Пароль" />

      <button>Зарегистрироваться</button>

      <p style={{ marginTop: '10px' }}>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onSwitch}>
          Войти
        </button>
      </p>
    </form>
  );
}
