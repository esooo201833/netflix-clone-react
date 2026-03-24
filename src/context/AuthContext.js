import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('esl_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.log('error loading user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('esl_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    
    if (found) {
      setUser(found);
      localStorage.setItem('esl_user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'بيانات غلط' };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('esl_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'الإيميل موجود قبل كده' };
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('esl_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('esl_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}