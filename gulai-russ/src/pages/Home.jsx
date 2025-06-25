import React, { useState } from "react";
import axios from "../api/axios"; // обязательно нужен настроенный axios
import "../styles/Home.scss";
import Snowflakes from "../assets/images/snowflakes.svg";
import LogoFirst from "../assets/images/logo1.svg";
import LogoSecond from "../assets/images/logo2.svg";
import LogoThird from "../assets/images/logo3.svg";
import Line from "../assets/images/line_mini.svg";
import CardById from "../components/Card";
import MoodBoard from "../assets/images/moodboard.svg";
import TourPopup from "../components/TourPopup";

function Home() {
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handleOpenPopup = (id) => {
    setSelectedTourId(id);
  };

  const handleClosePopup = () => {
    setSelectedTourId(null);
  };

  const handleReserve = async (id) => {
    try {
      axios.post(
        "http://localhost:8000/api/bookings",
        {
          tour_id: id,
        },
        {
          withCredentials: true,
        }
      );

      const existing = JSON.parse(localStorage.getItem("reservedTours")) || [];
      if (!existing.includes(id)) {
        const updated = [...existing, id];
        localStorage.setItem("reservedTours", JSON.stringify(updated));
      }

      alert("Тур успешно забронирован!");
      setSelectedTourId(null);
    } catch (err) {
      console.error("Ошибка бронирования", err);
      if (err.response?.status === 401) {
        alert("Пожалуйста, войдите в аккаунт для бронирования тура");
      } else {
        alert("Произошла ошибка при бронировании");
      }
    }
  };

  return (
    <main className="main">
      <section className="heroBlock">
        <p className="heroBlock__subtitle heroBlock__subtitle-first">
          катим по стране
        </p>
        <div className="heroBlock__txt">
          <img
            className="heroBlock__txt-item heroBlock__txt-item-third"
            src={LogoThird}
            alt="подложка"
          />
          <img
            className="heroBlock__txt-item heroBlock__txt-item-second"
            src={LogoSecond}
            alt="подложка"
          />
          <img
            className="heroBlock__txt-item heroBlock__txt-item-first"
            src={LogoFirst}
            alt="лого"
          />
          <h1 className="heroBlock__txt-item heroBlock__txt-item-orig">
            ГУЛЯЙ РУСЬ
          </h1>
        </div>
        <p className="heroBlock__subtitle heroBlock__subtitle-second">
          неси нас в путь
        </p>
        <img
          className="heroBlock__snowflakes-item heroBlock__snowflakes-item-first"
          src={Snowflakes}
          alt=""
        />
        <img
          className="heroBlock__snowflakes-item heroBlock__snowflakes-item-second"
          src={Snowflakes}
          alt=""
        />
      </section>

      <section className="description">
        <div className="description__block description__block-first">
          <p className="description__block-txt description__block-txt-first">
            везём туда, где музыка гремит, поля пульсируют, а палатки светятся.
            наши туры — это движ, маршрут и вайб, который не найти на букинге.
          </p>
          <img className="description__block-line" src={Line} alt="линия" />
        </div>
        <div className="description__block description__block-second">
          <img className="description__block-line" src={Line} alt="линия" />
          <p className="description__block-txt description__block-txt-second">
            организуем поездки по фестивалям с трансфером, ночёвками и готовыми
            маршрутами. всё продумано: билеты, места, рюкзак — и ты в пути.
          </p>
        </div>
      </section>

      <section className="cards">
        <h2 className="cards__title">скоро стартуем.</h2>
        <div className="cards__block">
          <CardById id={1} onOpenPopup={handleOpenPopup} />
          <CardById id={2} onOpenPopup={handleOpenPopup} />
          <CardById id={3} onOpenPopup={handleOpenPopup} />
        </div>
      </section>

      <section className="snowflakes">
        <img
          src={Snowflakes}
          alt=""
          className="snowflakes__img snowflakes__img-first"
        />
      </section>

      <section className="moodboard">
        <img src={MoodBoard} alt="" className="moodboard__img" />
      </section>

      <section className="reviews">
        <div className="reviews__block reviews__block-first">
          <img className="reviews__block-line" src={Line} alt="линия" />
          <p className="reviews__block-txt reviews__block-txt-first">
            ехала на фест в глушь, думала будет дичь и холод. а вышло лучше, чем
            любое море — люди, костры и чувство места. — Лена, Москва
          </p>
        </div>
        <div className="reviews__block reviews__block-second">
          <p className="reviews__block-txt reviews__block-txt-second">
            путь, палатка, поля и туман — всё как в кино, только живое. Гуляй
            Русь — это когда маршрут становится воспоминанием. — Сева, Казань
          </p>
          <img className="reviews__block-line" src={Line} alt="линия" />
        </div>
        <div className="reviews__block reviews__block-third">
          <img className="reviews__block-line" src={Line} alt="линия" />
          <p className="reviews__block-txt reviews__block-txt-third">
            не знала, что можно так устать и так кайфануть за два дня. Музыка,
            дождь, костры — и чувство, что всё правильно. — Настя, Пермь
          </p>
        </div>
      </section>

      <section className="snowflakes">
        <img
          src={Snowflakes}
          alt=""
          className="snowflakes__img snowflakes__img-second"
        />
      </section>

      {selectedTourId && (
        <TourPopup
          tourId={selectedTourId}
          onClose={handleClosePopup}
          onReserve={handleReserve}
        />
      )}
    </main>
  );
}

export default Home;
