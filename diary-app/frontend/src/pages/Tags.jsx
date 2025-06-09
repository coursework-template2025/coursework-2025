import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Tags() {
  const [entries, setEntries] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(saved);

    // Собираем уникальные теги
    const allTags = saved.flatMap(e => e.tags || []);
    const uniqueTags = [...new Set(allTags)];
    setTags(uniqueTags);
  }, []);

  useEffect(() => {
    if (!selectedTag) {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(e => e.tags && e.tags.includes(selectedTag)));
    }
  }, [selectedTag, entries]);

  return (
    <div>
      <h2>Теги</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setSelectedTag(null)} style={{ marginRight: 10 }}>
          Все записи
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{
              marginRight: 10,
              backgroundColor: selectedTag === tag ? '#aaa' : '#eee',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div>
        {filteredEntries.length === 0 && <p>Нет записей с выбранным тегом</p>}
        {filteredEntries.map(entry => (
          <div key={entry.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <h3>{entry.title}</h3>
            <p>{entry.text}</p>
            <div>
              {entry.tags && entry.tags.map(t => (
                <span key={t} style={{ marginRight: 5, fontSize: 12, color: '#555' }}>
                  #{t}
                </span>
              ))}
            </div>
            <Link to={`/view/${entry.id}`}>
              <button>Просмотр</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
