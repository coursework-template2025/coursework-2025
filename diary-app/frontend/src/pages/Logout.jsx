import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    const confirmLogout = window.confirm('Вы действительно хотите выйти из системы?');

    if (confirmLogout) {
      logout();
      alert('Вы вышли из системы');
      navigate('/');
    } else {
      // Отмена выхода — перенаправляем пользователя обратно на главную страницу
      navigate('/');
    }
  }, [logout, navigate]);

  return null;
}
