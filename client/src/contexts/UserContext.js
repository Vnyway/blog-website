import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [category, setCategory] = useState(null);
  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, category, setCategory }}>
      {children}
    </UserContext.Provider>
  );
};
