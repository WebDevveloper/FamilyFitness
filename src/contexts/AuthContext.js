import React, { createContext, useState, useEffect } from 'react';
import { getJSON } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // при монтировании пробуем получить текущего пользователя
    getJSON('/api/profile/me')
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
