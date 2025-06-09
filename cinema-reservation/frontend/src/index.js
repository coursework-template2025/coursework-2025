import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Подключение стилей
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Если хотите начать измерять производительность в вашем приложении, передайте функцию
// для логирования результатов (например: reportWebVitals(console.log))
// или отправьте на аналитический сервер. Узнайте больше: https://bit.ly/CRA-vitals
reportWebVitals();
