import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/AdminPanel.scss";

function AdminPage() {
  const [tables, setTables] = useState([]);
  const [views, setViews] = useState([]);
  const [allData, setAllData] = useState({});
  const [viewData, setViewData] = useState({});
  const [editedRows, setEditedRows] = useState({});
  const [newRows, setNewRows] = useState({});

  const viewsInfo = {
    view_1: { title: "Все туры", description: "Получить список всех туров, доступных в агентстве." },
    view_2: { title: "Клиенты с турами", description: "Получить список всех клиентов, зарегистрированных в агентстве с указанием выбранных ими туров." },
    view_3: { title: "Города с турами", description: "Получить список всех стран, в которые доступны туры с указанием стоимости." },
    view_4: { title: "Туры по типу", description: "Получить список всех туров определенного типа (например, экскурсионные туры)." },
    view_5: { title: "Клиенты по дате бронирования", description: "Получить список клиентов, которые забронировали тур на определенный период времени." },
    view_6: { title: "Клиенты с тратами больше суммы", description: "Получить список всех клиентов, сумма потраченных ими денег на туры превышает заданное значение." },
    view_7: { title: "Доступные туры по дате", description: "Получить список всех туров, доступных для бронирования в определенный период времени." },
    view_8: { title: "Клиенты по типу тура", description: "Получить список всех клиентов, которые забронировали туры определенного типа (например, пляжный отдых)." },
    view_9: { title: "Туры с местами", description: "Получить список всех туров, которые имеют свободные места для бронирования." },
    view_10: { title: "Клиенты с тратами выше среднего", description: "Получить список всех клиентов, у которых общая сумма потраченных денег на туры превышает среднюю сумму потраченных денег всех клиентов." }
  };

  useEffect(() => {
    axios.get("/api/admin/tables").then(res => {
      setTables(res.data);
      return Promise.all(res.data.map(table =>
        axios.get(`/api/admin/tables/${table}`)
          .then(res => ({ table, data: res.data }))
          .catch(() => ({ table, data: [], error: true }))
      ));
    }).then(results => {
      const merged = {};
      results.forEach(({ table, data }) => {
        merged[table] = data;
      });
      setAllData(merged);
    });

    axios.get("/api/admin/views").then(res => {
      setViews(res.data);
      return Promise.all(res.data.map(view =>
        axios.get(`/api/admin/views/${view}`)
          .then(res => ({ view, data: res.data }))
          .catch(() => ({ view, data: [], error: true }))
      ));
    }).then(results => {
      const merged = {};
      results.forEach(({ view, data }) => {
        merged[view] = data;
      });
      setViewData(merged);
    });
  }, []);

  const handleEdit = (table, rowIndex, key, value) => {
    const updated = [...(allData[table] || [])];
    updated[rowIndex][key] = value;
    setAllData({ ...allData, [table]: updated });
    setEditedRows({
      ...editedRows,
      [table]: {
        ...(editedRows[table] || {}),
        [updated[rowIndex].id]: updated[rowIndex],
      },
    });
  };

  const handleSave = (table, rowId) => {
    const updatedRow = editedRows[table][rowId];
    axios.put(`/api/admin/tables/${table}/${rowId}`, updatedRow).then(() => {
      const remaining = { ...editedRows };
      delete remaining[table][rowId];
      if (Object.keys(remaining[table]).length === 0) delete remaining[table];
      setEditedRows(remaining);
    });
  };

  const handleDelete = (table, rowId) => {
    axios.delete(`/api/admin/tables/${table}/${rowId}`).then(() => {
      const filtered = allData[table].filter((r) => r.id !== rowId);
      setAllData({ ...allData, [table]: filtered });
    });
  };

  const handleNewRowChange = (table, key, value) => {
    setNewRows({
      ...newRows,
      [table]: {
        ...(newRows[table] || {}),
        [key]: value,
      },
    });
  };

  const handleAddRow = (table) => {
    const rowToAdd = newRows[table] || {};
    axios.post(`/api/admin/tables/${table}`, rowToAdd).then((res) => {
      const updated = [...(allData[table] || []), res.data]; // 🔧 используем полную строку от сервера
      setAllData({ ...allData, [table]: updated });
      setNewRows({ ...newRows, [table]: {} });
    });
  };

  const renderTableBlock = (name, data, editable) => {
    if (!data || data.length === 0) return <p>Нет данных.</p>;

    return (
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((col, i) => <th key={i}>{col}</th>)}
            {editable && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {Object.entries(row).map(([key, val], colIndex) => (
                <td key={colIndex}>
                  {editable && key !== "id" ? (
                    <input value={val ?? ""} onChange={(e) => handleEdit(name, rowIndex, key, e.target.value)} />
                  ) : val ?? "-"}
                </td>
              ))}
              {editable && (
                <td>
                  <button onClick={() => handleSave(name, row.id)}>Сохранить</button>
                  <button onClick={() => handleDelete(name, row.id)}>Удалить</button>
                </td>
              )}
            </tr>
          ))}
          {editable && (
            <tr>
              {Object.keys(data[0]).map((key, i) => (
                <td key={i}>
                  {["id", "created_at", "updated_at"].includes(key) ? "-" : (
                    <input
                      value={(newRows[name]?.[key] ?? "")}
                      onChange={(e) => handleNewRowChange(name, key, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>
                <button onClick={() => handleAddRow(name)}>Добавить</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="adminPage">
      <h2>Таблицы</h2>
      {tables.map((table) => (
        <div key={table} className="adminPage__tableBlock">
          <h3>{table}</h3>
          {renderTableBlock(table, allData[table], true)}
        </div>
      ))}

      <h2>Представления</h2>
      {views.map((view) => {
        const info = viewsInfo[view] || {};
        return (
          <div key={view} className="adminPage__tableBlock">
            <h3>{info.title || view}</h3>
            <p>{info.description || "Нет описания."}</p>
            {renderTableBlock(view, viewData[view], false)}
          </div>
        );
      })}
    </div>
  );
}

export default AdminPage;
