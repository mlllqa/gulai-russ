import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/ViewsAdmin.scss"; // создадим позже для стилей

function ViewsAdmin() {
  const [views, setViews] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("/api/admin/views")
      .then(res => {
        const limited = res.data.slice(0, 10); // не больше 10 представлений
        setViews(limited);

        // Загружаем каждое представление
        limited.forEach(view =>
          axios.get(`/api/admin/views/${view}`).then(res => {
            setData(prev => ({ ...prev, [view]: res.data }));
          })
        );
      })
      .catch(() => {
        console.error("Ошибка при загрузке списка представлений");
      });
  }, []);

  return (
    <div className="views-admin">
      {views.length === 0 ? (
        <p>Нет представлений для отображения</p>
      ) : (
        views.map(view => (
          <div className="views-admin__block" key={view}>
            <h3 className="views-admin__title">{view}</h3>
            <div className="views-admin__table-wrapper">
              <table className="views-admin__table">
                <thead>
                  <tr>
                    {data[view]?.[0] &&
                      Object.keys(data[view][0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data[view]?.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewsAdmin;
