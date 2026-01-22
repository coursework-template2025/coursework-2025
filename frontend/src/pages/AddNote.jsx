import { useState } from 'react';
import { addNote } from '../api';

export default function AddNote({ onAdd }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const content = e.target.content.value.trim();

    if (!title || !content) {
      setError('Заполните все поля');
      setMessage('');
      return;
    }

    addNote(title, content)
      .then(() => {
        setMessage('Заметка успешно добавлена');
        setError('');
        e.target.reset();

        if (onAdd) {
          onAdd();
        }

        setTimeout(() => setMessage(''), 2000);
      })
      .catch(() => {
        setError('Ошибка при добавлении заметки');
        setMessage('');
      });
  }

  return (
    <form onSubmit={submit}>
      <h2>Добавить заметку</h2>

      {message && (
        <p style={{ color: 'green', marginBottom: '10px' }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </p>
      )}

      <input name="title" placeholder="Заголовок" />
      <textarea name="content" placeholder="Текст заметки" />

      <button>Сохранить</button>
    </form>
  );
}
