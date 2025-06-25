import React, { useState } from "react";
import "../styles/Header.scss";
import AuthPopup from "./AuthPopup";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ⬅ добавляем
import PersonalAcountIcon from "../assets/icons/personal_account.svg";

function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const { user } = useUser(); // ⬅ получаем текущего пользователя
  const navigate = useNavigate(); // ⬅ навигация

  const handleCabinetClick = () => {
    if (user) {
      navigate("/dashboard"); // если авторизован — переходим в кабинет
    } else {
      setAuthOpen(true); // если не авторизован — открываем попап
    }
  };

  return (
    <>
      <header className="header">
        <nav className="header__links">
          <Link className="header__links-item" to="/">Главная</Link>
          <Link className="header__links-item" to="/tours">Туры</Link>
          <Link className="header__links-item" to="/faq">FAQ</Link>
          <Link className="header__links-item" to="/contact">Контакты</Link>
        </nav>

        <button
          type="button"
          className="header__iconBlock-link"
          onClick={handleCabinetClick} // ⬅ заменили
        >
          <img
            className="header__iconBlock-item"
            src={PersonalAcountIcon}
            alt="лк"
          />
        </button>
      </header>

      {isAuthOpen && <AuthPopup onClose={() => setAuthOpen(false)} />}
    </>
  );
}

export default Header;
