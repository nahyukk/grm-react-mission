import { createContext, useState } from "react";

type LanguageContextType = {
  language: string;
  toggleLanguage: () => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>
  (undefined);

	type LanguageProviderProps = {
		children: React.ReactNode;
	};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
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
