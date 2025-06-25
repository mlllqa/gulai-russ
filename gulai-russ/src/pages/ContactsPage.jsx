import React from "react";
import '../styles/ContactsPage.scss';
import Title from "../assets/images/contacts__title.svg";
import Snowflakes from "../assets/images/snowflakes.svg";
import Arrow from "../assets/images/arrow.svg";
import Line from "../assets/images/contacts__line.svg";
import Map from "../assets/images/map.svg";

const ContactsPage = () => {
  return (
    <main>
      <section className="contacts__hero">
        <p className="contacts__txt">остались вопросы?</p>
        <img src={Title} alt="" className="contacts__title" />
        <p className="contacts__txt">хочешь связаться?</p>
        <img
          src={Snowflakes}
          alt=""
          className="contacts__snow contacts__snow-first"
        />
        <img
          src={Snowflakes}
          alt=""
          className="contacts__snow contacts__snow-second"
        />
        <button className="contacts__btn">
          <a href="" className="contacts__btn-link">
            <img src={Arrow} alt="" className="contacts__btn-bg" />
          </a>
        </button>
      </section>
      <section className="contacts__columns">
        <div className="contacts__column contacts__column-first">
          <p className="contacts__column-first--txt">
            <span>почта</span>hello@gulyairus.ru<span>telegram</span>@gulyairus
            <span>vk</span>vk.com/gulyairus
          </p>
        </div>
        <img src={Line} alt="" className="contacts__columns-line" />
        <div className="contacts__column contacts__column-first">
          <p className="contacts__column-first--txt">
            <span>по делу</span>— по турам<br/>— по предложениям<br/>— по маршрутам и
            фестам<span>не по делу</span>— тоже можно
            <span>vk</span>vk.com/gulyairus
          </p>
        </div>
        <img src={Line} alt="" className="contacts__columns-line" />
        <div className="contacts__column contacts__column-first">
          <p className="contacts__column-first--txt">
            Москва, Нижинская 7<span>работаем</span>ежедневно, с 11:00 до 19:00
          </p>
        </div>
      </section>
      <section className="snowflakes">
        <img src={Snowflakes} alt="" className="snowflakes-img" />
      </section>
      <section className="contacts__map">
        <p className="contacts__map-title">если что заезжай :)</p>
        <img src={Map} alt="" className="contacts__map-image" />
      </section>
      <section className="snowflakes">
        <img src={Snowflakes} alt="" className="snowflakes-img" />
      </section>
    </main>
  );
};

export default ContactsPage;
