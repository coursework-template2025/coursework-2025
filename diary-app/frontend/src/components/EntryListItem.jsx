// components/EntryListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function EntryListItem({ entry, onDelete }) {
  const handleDeleteClick = () => {
    if (window.confirm('Вы действительно хотите удалить эту запись?')) {
      onDelete(entry.id);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: 'white',
    }}>
      <h3>{entry.title}</h3>
      <p>{entry.text}</p>
      <p><small>{new Date(entry.date).toLocaleString()}</small></p>
      <Link to={`/view/${entry.id}`}><button>Просмотр</button></Link>
      <Link to={`/edit/${entry.id}`}><button style={{ marginLeft: '10px' }}>Редактировать</button></Link>
      <button onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>Удалить</button>
    </div>
  );
}