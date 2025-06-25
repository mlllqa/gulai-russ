import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "../api/axios"; // axios должен быть с baseURL и withCredentials
import "../styles/AuthPopup.scss";

import lineImg from "../assets/images/log-line.svg";
import loginBtnImg from "../assets/images/button-login.svg";

function LoginForm({ onSwitch, onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useUser();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Получаем CSRF-cookie (обязательно перед сессионным логином)
      await axios.get("/sanctum/csrf-cookie");

      // 2. Отправляем логин
      await axios.post("/login", {
        email: form.email,
        password: form.password,
      });

      // 3. Получаем текущего пользователя и флаг is_admin
      const { data } = await axios.get("/user");

      // 4. Сохраняем в контекст
      setUser(data.user);
      setIsAdmin(data.is_admin);

      // 5. Закрываем попап, если нужно
      if (onClose) onClose();

      // 6. Перенаправляем на личный кабинет
      navigate("/dashboard");
    } catch (err) {
      console.error("Ошибка входа:", err.response?.data || err.message);

      if (err.response?.status === 422) {
        setError("Неверный email или пароль");
      } else if (err.response?.status === 401) {
        setError("Неавторизован — проверьте сессию и cookies");
      } else {
        setError("Произошла ошибка при входе. Попробуйте позже");
      }
    }
  };

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <h2 className="auth__title">авторизация</h2>

      <div className="auth__field">
        <input
          type="email"
          name="email"
          className="auth__field-in"
          value={form.email}
          onChange={handleChange}
          placeholder="почта"
          autoComplete="email"
          required
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      <div className="auth__field">
        <input
          type="password"
          name="password"
          className="auth__field-in"
          value={form.password}
          onChange={handleChange}
          placeholder="пароль"
          autoComplete="current-password"
          required
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      {error && <div className="auth__error">{error}</div>}

      <button type="submit" className="auth__submit">
        <img src={loginBtnImg} className="auth__submit-icon" alt="войти" />
      </button>

      <div className="auth__switch" onClick={onSwitch}>
        регистрация
      </div>
    </form>
  );
}

export default LoginForm;
