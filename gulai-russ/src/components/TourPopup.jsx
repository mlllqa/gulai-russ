import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import "../styles/TourPopup.scss";
import Btn from "../assets/images/popup_btn.svg";

const TourPopup = ({ tourId, onClose, onReserve, readonly = false }) => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    axios
      .get(`/api/tours/${tourId}`)
      .then((res) => setTour(res.data))
      .catch(() => setTour(null))
      .finally(() => setLoading(false));
  }, [tourId]);

  const handleOutsideClick = (e) => {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (loading || !tour) {
    return (
      <div className="popup" onClick={handleOutsideClick}>
        <div className="popup-content" ref={contentRef}>
          {loading ? "Загрузка..." : "Ошибка загрузки"}
        </div>
      </div>
    );
  }

  const included = String(tour.included).split(",").map((s) => s.trim());
  const whatToTake = String(tour.what_to_take).split(",").map((s) => s.trim());

  return (
    <div className="popup" onClick={handleOutsideClick}>
      <div className="popup-content" ref={contentRef}>
        <button className="popup-close-btn" onClick={onClose}>×</button>

        <div className="popup-title__block">
          <div className="popup-title-wrapper">
            <div className="popup-title popup-title-stroke-two">{tour.title}</div>
            <div className="popup-title popup-title-stroke">{tour.title}</div>
            <div className="popup-title popup-title-fill">{tour.title}</div>
          </div>

          <h2 className="popup-subtitle">
            {tour.start_date} – {tour.end_date}, {tour.city ?? "Не указано"}
          </h2>
        </div>

        <div className="popup-body">
          <img src={tour.image_path} alt={tour.title} className="popup-image" />

          <div className="popup-columns">
            <div className="popup-column popup-column--left">
              <h3 className="popup-section-title">о туре</h3>
              <p className="popup-text">{tour.description}</p>

              <h3 className="popup-section-title">программа</h3>
              <div className="popup-text">
                {String(tour.program).split(/(?=День)/g).map((line, index) => (
                  <p key={index}>{line.trim()}</p>
                ))}
              </div>

              <h3 className="popup-section-title">теги</h3>
              <p className="popup-text">
                {Array.isArray(tour.tags) ? tour.tags.join(" / ") : tour.tags}
              </p>
            </div>

            <div className="popup-column popup-column--right">
              <h3 className="popup-section-title">что взять с собой</h3>
              <ul className="popup-list">
                {whatToTake.map((item, i) => (
                  <li key={i} className="popup-list-item">– {item}</li>
                ))}
              </ul>

              <h3 className="popup-section-title">что включено</h3>
              <ul className="popup-list">
                {included.map((item, i) => (
                  <li key={i} className="popup-list-item">– {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {!readonly && (
          <button className="popup-reserve" onClick={() => onReserve(tour.id)}>
            <img src={Btn} alt="" className="popup-btn" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TourPopup;
