import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const token = sessionStorage.getItem('token');
      const userData = sessionStorage.getItem('userData');
      if (token && userData) {
          setUser({
              token,
              ...JSON.parse(userData)
          });
      }
  }, []);

  const login = (token, userData) => {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userData', JSON.stringify(userData));
      setUser({
          token,
          ...userData
      });
  };

  const logout = () => {
      sessionStorage.clear();
      setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, login, logout }}>
          {children}
      </AuthContext.Provider>
  );
};



