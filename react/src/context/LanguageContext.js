import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState("en-US");

  const toggleLanguage = () => {
    setLanguage((prevLanguage) =>
      prevLanguage === "en-US" ? "ko-KR" : "en-US"
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
