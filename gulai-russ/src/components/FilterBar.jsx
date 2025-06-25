import React from "react";
import "../styles/FilterBar.scss";
import Bar from "../assets/images/Bar.svg";
import { IMaskInput } from "react-imask";

function FilterBar({
  season,
  setSeason,
  region,
  setRegion,
  format,
  setFormat,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  return (
    <div className="filterBar">
      <img src={Bar} alt="" className="filterBar__img" />

      <div className="filterBar__selects">
        <select
          className="filterBar__select filterBar__select-season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="">сезон</option>
          <option value="лето">лето</option>
          <option value="осень">осень</option>
          <option value="зима">зима</option>
          <option value="весна">весна</option>
        </select>

        <select
          className="filterBar__select filterBar__select-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">регион</option>
          <option value="1">Москва</option>
          <option value="2">Питер</option>
          <option value="3">Тамбов</option>
          <option value="4">Лен. область</option>
        </select>

        <select
          className="filterBar__select filterBar__select-format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">ночёвка</option>
          <option value="1">отель</option>
          <option value="2">палатка</option>
        </select>

        <div className="filterBar__date">
          <span className="filterBar__date-txt">дата: с</span>
          <IMaskInput
            mask="00.00.0000"
            placeholder="дд.мм.гггг"
            className="filterBar__input"
            value={startDate}
            onAccept={(value) => setStartDate(value)}
          />
          <span className="filterBar__date-txt">по</span>
          <IMaskInput
            mask="00.00.0000"
            placeholder="дд.мм.гггг"
            className="filterBar__input"
            value={endDate}
            onAccept={(value) => setEndDate(value)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
