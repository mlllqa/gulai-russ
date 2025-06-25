import React, { createContext, useContext, useState } from "react";

// Создаём контекст
const UserContext = createContext();

// Провайдер, оборачивающий приложение
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Текущий пользователь
  const [isAdmin, setIsAdmin] = useState(false);  // Является ли пользователь админом
  const [loaded, setLoaded] = useState(true);     // Флаг загрузки

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setIsAdmin, loaded, setLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для использования контекста
export const useUser = () => useContext(UserContext);
