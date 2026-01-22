import { Navigate } from 'react-router-dom';
import { getToken } from '@/shared/lib/utils/cookies';

export const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

