import React, { useState, useRef } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../styles/AuthPopup.scss";

function AuthPopup({ onClose }) {
  const [mode, setMode] = useState("login");
  const popupRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-wrapper">
        <div className="popup-window" ref={popupRef}>
          
          {/* кнопка-крестик */}
          <button className="popup-close-btn" onClick={onClose}>×</button>

          {mode === "login" ? (
            <LoginForm
              onSwitch={() => setMode("register")}
              onClose={onClose} // теперь передаём onClose
            />
          ) : (
            <RegisterForm
              onSwitch={() => setMode("login")}
              onClose={onClose} //  и сюда тоже
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;
