import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/Card.scss";
import decorLine from "../assets/images/cardButton.svg";

const CardById = ({ id, tour: propTour, onOpenPopup }) => {
  const [tour, setTour] = useState(propTour || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propTour) return; // если передали тур — ничего не грузим
    axios
      .get(`http://localhost:8000/api/tours/${id}`)
      .then((res) => {
        console.log("Получен тур:", res.data);
        setTour(res.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тура", err);
        setError("Ошибка при загрузке карточки");
      });
  }, [id, propTour]);

  if (error) return <div className="card__error">{error}</div>;
  if (!tour) return <div className="card__loading">Загрузка...</div>;

  const tags = Array.isArray(tour.tags) ? tour.tags : [];
  const visibleTags = tags.slice(0, -2);
  const lastTwoTags = tags.slice(-2);

  return (
    <div className="card">
      <img
        src={tour.image_path || "/images/cards/fallback.svg"}
        alt={tour.title || "Тур"}
        className="card__image"
      />

      <div className="card__tags">
        {visibleTags.map((tag, index) => (
          <span key={index} className="card__tag">#{tag}</span>
        ))}
        <span className="card__tag-spacer">
          {lastTwoTags.map((tag, index) => (
            <span key={index} className="card__tag">#{tag}</span>
          ))}
        </span>
      </div>

      <button className="card__btn" onClick={() => onOpenPopup(tour.id)}>
        <img src={decorLine} alt="Подробнее" className="card__btn-decor" />
      </button>
    </div>
  );
};

export default CardById;
