// UserContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);  // <-- храним строку username
  }, []);

  // оборачиваем login в useCallback, чтобы не было проблем с зависимостями
  const login = useCallback((username) => {
    setUser(username);
    localStorage.setItem('user', username);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
