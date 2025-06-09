import React, { useState, useEffect } from 'react';
// Это просто набор фильмов, по которым будет выполняться поиск.
const movies = [
 
  { title: 'Тёмный рыцарь' },
  { title: 'Начало' },
  { title: 'Король Лев' },
  { title: 'Властелин колец: Братство кольца' },
  { title: 'Шрек' },
  { title: 'Матрица' },
  { title: 'Холодное сердце' },
  { title: 'Интерстеллар' },
  { title: 'В поисках Немо' },
  { title: 'Джокер' },
  { title: 'Зверополис' },
  { title: 'Тайна Коко' },
  { title: 'Бегущий по лезвию 2049 ' },
  { title: 'Побег из Шоушенка' },
  { title: 'Как приручить дракона' }
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(movies);

  useEffect(() => {
    const results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
  <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-200 to-pink-100 flex flex-col items-center py-10 px-4">
    <header className="w-full max-w-4xl flex items-center justify-between mb-8">
      <h1 className="text-4xl font-extrabold text-purple-800 animate-pulse">
        Поиск фильмов
      </h1>
      <input
        type="text"
        placeholder="Поиск"
        className="w-64 px-4 py-2 rounded-xl border border-purple-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </header>

    {searchResults.length > 0 ? (
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {searchResults.map((movie, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 text-center text-lg font-semibold text-gray-700 hover:bg-purple-100 transition"
          >
            {movie.title}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-lg text-red-500 font-medium mt-4">Фильмы не найдены</p>
    )}
  </div>
);

};

export default SearchPage;
