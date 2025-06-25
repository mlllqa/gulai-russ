import React, { useState } from "react";
import "../styles/FaqPage.scss";
import Snowflakes from "../assets/images/snowflakes.svg";
import Line from "../assets/images/line.svg";

const faqData = [
  {
    question: "что входит в тур?",
    answer:
      "трансфер, проживание, сопровождение. иногда – билеты на фест, если указано. всегда – порядок и вайб.",
  },
  {
    question: "можно ли ехать одному/одной?",
    answer: "конечно, многие едут в соло и находят компанию прямо в туре!",
  },
  {
    question: "какой уровень комфорта?",
    answer: "разный – смотри описание тура. бывает отель, бывает палатка.",
  },
  {
    question: "когда присылают подробности?",
    answer: "за неделю до старта на почту и в телеграм.",
  },
  {
    question: "а если передумал(а)?",
    answer: "всё решаемо – главное, напиши нам как можно раньше.",
  },
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="faq-page">
      <h2 className="faq-title">часто спрашивают.</h2>

      <ul className="faq-list">
        {faqData.map((item, index) => (
          <li key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggle(index)}>
              <span>{item.question}</span>
              <span className="faq-question__span">{openIndex === index ? "−" : "+"}</span>
            </button>

            {openIndex === index && <p className="faq-answer">{item.answer}</p>}

            <img src={Line} alt="" className="faq-line" />
          </li>
        ))}
      </ul>

      <section className="snowflakes">
        <img src={Snowflakes} alt="" className="snowflakes-img" />
      </section>
    </main>
  );
}

export default FaqPage;
