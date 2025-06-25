import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/DashboardPage.scss";

import Snowflakes from "../assets/images/snowflakes.svg";
import logoutBtn from "../assets/images/logout_btn.svg";
import CardById from "../components/Card";
import TourPopup from "../components/TourPopup";
import lineImg from "../assets/images/line-form.svg";
import buttonFrame from "../assets/images/button-frame.svg";
import AdminPanel from "../components/AdminPanel"; // компонент админки

function DashboardPage() {
  const { user, setUser, isAdmin, setIsAdmin } = useUser();
  const navigate = useNavigate();
  const [bookedTours, setBookedTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      axios
        .get("/user")
        .then((res) => {
          setUser(res.data.user);
          setIsAdmin(res.data.is_admin);
        })
        .catch(() => navigate("/login"));
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) return; // админам брони не нужны
    const reservedIds = JSON.parse(localStorage.getItem("reservedTours")) || [];

    if (reservedIds.length === 0) return;

    Promise.all(reservedIds.map((id) => axios.get(`/api/tours/${id}`)))
      .then((responses) => {
        const data = responses.map((res) => res.data);
        setBookedTours(data);
      })
      .catch(() => {
        console.error("Ошибка при получении забронированных туров");
      });
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      setIsAdmin(false);
      navigate("/");
    } catch (e) {
      console.error("Ошибка выхода", e);
    }
  };

  const handleOpenPopup = (tourId) => {
    setSelectedTourId(tourId);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTourId(null);
  };

  if (!user) return <div>Загрузка...</div>;

  if (isAdmin) {
    return (
      <div className="dashboard admin">
        <div className="dashboard__top">
          <div className="dashboard__greeting">Привет, Админ</div>
          <button className="dashboard__logout" onClick={handleLogout}>
            <img src={logoutBtn} alt="" className="dashboard__logout-btn" />
          </button>
        </div>

        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__top">
        <div className="dashboard__greeting">Здравствуйте, {user.name}</div>
        <button className="dashboard__logout" onClick={handleLogout}>
          <img src={logoutBtn} alt="" className="dashboard__logout-btn" />
        </button>
      </div>

      <h2 className="dashboard__title">Ваши брони:</h2>

      <div className="dashboard__cards">
        {bookedTours.length > 0 ? (
          bookedTours.map((tour) => (
            <CardById
              key={tour.id}
              id={tour.id}
              onOpenPopup={handleOpenPopup}
            />
          ))
        ) : (
          <p className="dashboard__empty">
            У вас пока нет бронированных туров.
          </p>
        )}
      </div>

      {showPopup && selectedTourId && (
        <TourPopup
          tourId={selectedTourId}
          onClose={handleClosePopup}
          readonly
        />
      )}

      <div className="dashboard__feedback-authstyle">
        <h2 className="dashboard__feedback-title">Обратная связь</h2>
        <form
          className="dashboard__feedback-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = {
              name: user.name,
              email: user.email,
              message: e.target.message.value,
            };
            try {
              await axios.post("/api/feedback", formData);
              alert("Ваше сообщение отправлено!");
              e.target.reset();
            } catch (err) {
              alert("Ошибка отправки.");
            }
          }}
        >
          <div className="dashboard__field">
            <input
              className="dashboard__input"
              type="text"
              value={user.name}
              name="name"
              disabled
            />
            <img src={lineImg} alt="" className="dashboard__underline" />
          </div>

          <div className="dashboard__field">
            <input
              className="dashboard__input"
              type="text"
              value={user.email}
              name="email"
              disabled
            />
            <img src={lineImg} alt="" className="dashboard__underline" />
          </div>

          <div className="dashboard__field">
            <textarea
              className="dashboard__input"
              name="message"
              rows="1"
              required
              placeholder="сообщение "
            />
            <img src={lineImg} alt="" className="dashboard__underline" />
          </div>

          <button type="submit" className="dashboard__button">
            <img
              src={buttonFrame}
              className="dashboard__button-icon"
              alt="Отправить"
            />
          </button>
        </form>
      </div>

      <section className="snowflakes">
        <img
          src={Snowflakes}
          alt=""
          className="snowflakes__img snowflakes__img-second"
        />
      </section>
    </div>
  );
}

export default DashboardPage;
