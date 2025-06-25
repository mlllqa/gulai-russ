import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import CardById from "../components/Card";
import FilterBar from "../components/FilterBar";
import TourPopup from "../components/TourPopup";
import Snowflakes from "../assets/images/snowflakes.svg";
import "../styles/ToursPage.scss";

function ToursPage() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);

  const [season, setSeason] = useState("");
  const [region, setRegion] = useState("");
  const [format, setFormat] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedTourId, setSelectedTourId] = useState(null);
  const [reservedTours, setReservedTours] = useState(
    JSON.parse(localStorage.getItem("reservedTours")) || []
  );

  useEffect(() => {
    axios
      .get("/api/tours")
      .then((res) => {
        setTours(res.data);
        setFilteredTours(res.data);
      })
      .catch(() => {
        console.error("Ошибка при загрузке туров");
      });
  }, []);

  useEffect(() => {
    let result = [...tours];

    if (season) {
      result = result.filter((tour) => {
        const month = new Date(tour.start_date).getMonth() + 1;
        if (season === "лето") return month >= 6 && month <= 8;
        if (season === "осень") return month >= 9 && month <= 11;
        if (season === "зима") return month === 12 || month <= 2;
        if (season === "весна") return month >= 3 && month <= 5;
        return true;
      });
    }

    if (region) {
      result = result.filter((tour) => {
        const match = String(tour.city_id) === String(region);
        console.log(
          `🌍 Сравнение city_id: ${tour.city_id} === ${region} →`,
          match
        );
        return match;
      });
    }

    if (format) {
      const normalizedFormat = format.trim().toLowerCase();
      result = result.filter((tour) => {
        const type = (tour.type || "").trim().toLowerCase();
        const match = type === normalizedFormat;
        console.log(
          ` Сравнение формата: "${type}" === "${normalizedFormat}" → ${match}`
        );
        return match;
      });
    }

    if (startDate) {
      const start = new Date(startDate.split(".").reverse().join("-"));
      result = result.filter((tour) => new Date(tour.start_date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate.split(".").reverse().join("-"));
      result = result.filter((tour) => new Date(tour.end_date) <= end);
    }

    console.log(" Отфильтрованные туры:", result);

    setFilteredTours(result);
  }, [season, region, format, startDate, endDate, tours]);

  const handleOpenPopup = (id) => {
    setSelectedTourId(id);
  };

  const handleClosePopup = () => {
    setSelectedTourId(null);
  };

  const handleReserve = async (id) => {
    try {
      const res = await axios.post(
        "/bookings",
        { tour_id: id },
        { withCredentials: true }
      );
      if (!reservedTours.includes(id)) {
        const updated = [...reservedTours, id];
        setReservedTours(updated);
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
    <main className="ToursPage">
      <h2 className="tours__title">наши туры.</h2>

      <section className="filterBar">
        <FilterBar
          season={season}
          setSeason={setSeason}
          region={region}
          setRegion={setRegion}
          format={format}
          setFormat={setFormat}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </section>

      <section className="tour__cards">
        {filteredTours.map((tour) => (
          <CardById key={tour.id} id={tour.id} onOpenPopup={handleOpenPopup} />
        ))}
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

export default ToursPage;
