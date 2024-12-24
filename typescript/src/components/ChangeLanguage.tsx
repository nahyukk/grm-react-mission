import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import "./ChangeLanguage.css";

const ChangeLanguage: React.FC = () => {
  const context = useContext(LanguageContext);

	if (!context) {
    throw new Error("ChangeLanguage 에러");
  }

  const { language, toggleLanguage } = context;


  return (
    <div className="toggle-container">
      <label className="toggle-switch">
        <input
          type="checkbox"
          onChange={toggleLanguage}
          checked={language === "en-US"}
        />
        <span className="slider">
          <span className={`text left ${language === "ko-KR" ? "show" : "hide"}`}>
            한글
          </span>
          <span className={`text right ${language === "en-US" ? "show" : "hide"}`}>
            ENG
          </span>
        </span>
      </label>
    </div>
  );
};

export default ChangeLanguage;
