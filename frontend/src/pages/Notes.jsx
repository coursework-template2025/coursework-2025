import { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../api';

export default function Notes({ reload }) {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');

  function loadNotes() {
    getNotes().then(setNotes);
  }

  useEffect(() => {
    loadNotes();
  }, [reload]);

  function remove(id) {
    deleteNote(id).then(() => {
      setMessage('Заметка удалена');
      loadNotes();
      setTimeout(() => setMessage(''), 2000);
    });
  }

  function formatDate(date) {
    return new Date(date).toLocaleString('ru-RU');
  }

  return (
    <div>
      <h2>Заметки</h2>

      {message && (
        <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>
      )}

      {notes.length === 0 && <p>Заметок пока нет</p>}

      {notes.map(n => (
        <div className="card" key={n.id}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3>{n.title}</h3>

            <button
              onClick={() => remove(n.id)}
              style={{
                background: 'transparent',
                color: '#e74c3c',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}
              title="Удалить заметку"
            >
              ❌
            </button>
          </div>

          <small style={{ color: '#888' }}>
            Создано: {formatDate(n.created_at)}
          </small>

          <p>{n.content}</p>
        </div>
      ))}
    </div>
  );
}
