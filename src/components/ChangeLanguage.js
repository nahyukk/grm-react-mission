import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import "./ChangeLanguage.css";

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

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
