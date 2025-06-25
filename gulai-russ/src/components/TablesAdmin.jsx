import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/TablesAdmin.scss"; // можно пока закомментировать, если не хочешь стили

function TablesAdmin() {
  const [tables, setTables] = useState([]);
  const [data, setData] = useState({});
  const [editing, setEditing] = useState({}); // { tableName: { rowIndex: {field: value} } }

  // Загружаем список таблиц
  useEffect(() => {
    axios.get("/api/admin/tables")
      .then(res => setTables(res.data))
      .catch(() => console.error("Ошибка при загрузке списка таблиц"));
  }, []);

  // Загружаем все таблицы
  useEffect(() => {
    if (tables.length === 0) return;
    tables.forEach(table => {
      axios.get(`/api/admin/tables/${table}`)
        .then(res => {
          setData(prev => ({ ...prev, [table]: res.data }));
        })
        .catch(() => console.error(`Ошибка загрузки данных из таблицы ${table}`));
    });
  }, [tables]);

  const handleChange = (table, rowIndex, key, value) => {
    setEditing(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        [rowIndex]: {
          ...(prev[table]?.[rowIndex] || {}),
          [key]: value,
        },
      },
    }));
  };

  const handleUpdate = (table, rowIndex, rowId) => {
    const updated = editing[table]?.[rowIndex];
    if (!updated || !rowId) return;

    axios.put(`/api/admin/tables/${table}/${rowId}`, updated)
      .then(() => reloadTable(table))
      .catch(() => alert(`Ошибка обновления строки в ${table}`));
  };

  const handleDelete = (table, rowId) => {
    if (!window.confirm(`Удалить запись из таблицы ${table}?`)) return;

    axios.delete(`/api/admin/tables/${table}/${rowId}`)
      .then(() => reloadTable(table))
      .catch(() => alert(`Ошибка удаления строки в ${table}`));
  };

  const handleCreate = (table) => {
    axios.post(`/api/admin/tables/${table}`, {})
      .then(() => reloadTable(table))
      .catch(() => alert(`Ошибка добавления строки в ${table}`));
  };

  const reloadTable = (table) => {
    axios.get(`/api/admin/tables/${table}`)
      .then(res => {
        setData(prev => ({ ...prev, [table]: res.data }));
        setEditing(prev => ({ ...prev, [table]: {} }));
      });
  };

  return (
    <div className="tables-admin">
      {tables.map(table => (
        <div key={table} className="tables-admin__block">
          <h3>{table}</h3>
          <button onClick={() => handleCreate(table)}>Добавить строку</button>

          {data[table]?.length > 0 ? (
            <div className="tables-admin__table-wrapper">
              <table className="tables-admin__table">
                <thead>
                  <tr>
                    {Object.keys(data[table][0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {data[table].map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {Object.entries(row).map(([key, val]) => (
                        <td key={key}>
                          <input
                            value={editing?.[table]?.[rowIndex]?.[key] ?? val}
                            onChange={(e) =>
                              handleChange(table, rowIndex, key, e.target.value)
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <button onClick={() => handleUpdate(table, rowIndex, row.id)}>Сохранить</button>
                        <button onClick={() => handleDelete(table, row.id)}>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Нет данных в таблице или она пустая</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default TablesAdmin;
