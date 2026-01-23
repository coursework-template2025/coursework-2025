import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { ChatsPage } from '@/pages/chats';
import { ChatPage } from '@/pages/chat';
import { EmptyChatPage } from '@/pages/chats/empty';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmptyChatPage />} />
          <Route path=":id" element={<ChatPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/chats" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

