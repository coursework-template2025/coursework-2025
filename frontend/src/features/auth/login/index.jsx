import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { Loader } from '@/shared/ui/Loader/Loader';
import { userApi } from '@/entities/user/api/userApi';
import { setToken } from '@/shared/lib/utils/cookies';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Введите username или email';
    }
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.login(formData);
      if (response.token) {
        setToken(response.token);
        navigate('/chats');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setApiError('Неверный username/email или пароль');
      } else {
        setApiError('Ошибка при авторизации. Попробуйте снова.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>
        {apiError && <div className="error-message">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Username или Email"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            disabled={isLoading}
          />
          <Input
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        <div className="login-footer">
          <span>Нет аккаунта? </span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

