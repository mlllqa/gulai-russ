import React, { useState } from "react";
import axios from "../api/axios";
import "../styles/AuthPopup.scss";

import lineImg from "../assets/images/log-line.svg";
import registerBtnImg from "../assets/images/button-register.svg";

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await axios.get("/sanctum/csrf-cookie");

      const response = await axios.post("/register", form);
      setMessage("Регистрация прошла успешно!");

      // можно переключить на авторизацию:
      // onSwitch();

    } catch (error) {
      if (error.response?.status === 422) {
        const errors = Object.values(error.response.data.errors).flat().join("\n");
        setError(errors);
      } else {
        setError("Произошла ошибка регистрации. Попробуйте позже.");
      }
    }
  };

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <h2 className="auth__title">регистрация</h2>

      {error && <div className="auth__error">{error}</div>}
      {message && <div className="auth__message">{message}</div>}

      <div className="auth__field">
        <label htmlFor="name">имя</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="имя"
          className="auth__field-in"
          required
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      <div className="auth__field">
        <label htmlFor="email">почта</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="почта"
          className="auth__field-in"
          required
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      <div className="auth__field">
        <label htmlFor="password">пароль</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="пароль"
          className="auth__field-in"
          required
          autoComplete="new-password"
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      <div className="auth__field">
        <label htmlFor="password_confirmation">повторите пароль</label>
        <input
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          placeholder="повторите пароль"
          className="auth__field-in"
          required
          autoComplete="new-password"
        />
        <img className="auth__line" src={lineImg} alt="" />
      </div>

      <button type="submit" className="auth__submit">
        <img src={registerBtnImg} className="auth__submit-icon" alt="зарегистрироваться" />
      </button>

      <div className="auth__switch" onClick={onSwitch}>
        авторизация
      </div>
    </form>
  );
}

export default RegisterForm;
