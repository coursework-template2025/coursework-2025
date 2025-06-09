import React, { useState } from 'react';

const Auth = () => {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

 const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    const result = await res.json();
    if (res.ok) {
      alert('Регистрация прошла успешно!');
      setRegisterData({ name: '', email: '', password: '' });
      // Перенаправление на главную страницу
      window.location.href = '/'; //!!!!!!!!!!!!!
    } else {
      alert(result.message || 'Ошибка регистрации');
    }
  } catch {
    alert('Ошибка регистрации');
  }
};

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    const result = await res.json();
    if (res.ok && result.token) {
      alert('Вход выполнен!');
      localStorage.setItem('token', result.token);
      setLoginData({ email: '', password: '' });
      // Перенаправление на главную страницу
      window.location.href = '/'; //!!!!!!!!!!!1
    } else {
      alert(result.message || 'Ошибка входа');
    }
  } catch {
    alert('Ошибка при входе');
  }
};


  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 text-white min-h-screen py-10 px-4">
  <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
  <form
    onSubmit={handleRegisterSubmit}
    className="bg-white text-black p-6 rounded-lg shadow-md max-w-sm mb-8"
  >
    <input
      type="text"
      name="name"
      placeholder="Имя"
      value={registerData.name}
      onChange={handleRegisterChange}
      required
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={registerData.email}
      onChange={handleRegisterChange}
      required
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />
    <input
      type="password"
      name="password"
      placeholder="Пароль"
      value={registerData.password}
      onChange={handleRegisterChange}
      required
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />
    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
    >
      Зарегистрироваться
    </button>
  </form>

  <h2 className="text-2xl font-bold mb-4">Вход</h2>
  <form
    onSubmit={handleLoginSubmit}
    className="bg-white text-black p-6 rounded-lg shadow-md max-w-sm"
  >
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={loginData.email}
      onChange={handleLoginChange}
      required
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />
    <input
      type="password"
      name="password"
      placeholder="Пароль"
      value={loginData.password}
      onChange={handleLoginChange}
      required
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />
    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
    >
      Войти
    </button>
  </form>
</div>

  );
};

export default Auth;
