//Это компонент шапки сайта с навигационными кнопками для переключения между разделами приложения.
import React from 'react';
const Header = ({ onNavClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-extrabold tracking-wide animate-pulse">Кинотеатр</h1>
        <nav>
          <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <button
                onClick={() => onNavClick('home')}
                className="transition-all duration-300 hover:text-yellow-300 hover:scale-105"
              >
                Главная
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('contacts')}
                className="transition-all duration-300 hover:text-yellow-300 hover:scale-105"
              >
                Контакты
              </button>
            </li>
               <li>
             <button
    onClick={() => window.location.href = '/register'}
    className="transition-all duration-300 hover:text-yellow-300 hover:scale-105"
  >
    Регистрация
  </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
