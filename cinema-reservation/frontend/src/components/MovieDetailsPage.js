import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movies from '../data/movies';

function MovieDetailsPage() {
  const { title } = useParams();
  const navigate = useNavigate();

  const movie = movies.find(m => decodeURIComponent(m.title) === title);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-gradient-to-tr from-blue-100 via-purple-200 to-pink-100 animate-fade-in">
        <h2 className="text-3xl font-bold text-red-600 mb-6 animate-pulse">
          Фильм не найден
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-200 to-pink-100 px-4 py-10 flex flex-col items-center animate-fade-in">
      {/* Заголовок */}
      <h1 className="text-4xl font-extrabold text-purple-800 mb-8 animate-pulse text-center">
        {movie.title}
      </h1>

      {/* Трейлер */}
      <div className="w-full max-w-4xl h-[500px] mb-10 rounded-2xl shadow-lg overflow-hidden border-4 border-purple-200">
        <iframe
          src={movie.trailerUrl}
          title={`Трейлер ${movie.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Информация */}
      <section className="w-full max-w-2xl bg-white bg-opacity-80 rounded-2xl shadow-md p-6 mb-10 text-lg text-gray-800 leading-relaxed space-y-4">
        <p>
          <strong className="text-purple-700">Описание: </strong>
          {movie.description}
        </p>
        <p>
          <strong className="text-purple-700">Жанр: </strong>
          {movie.genre}
        </p>
        <p>
          <strong className="text-purple-700">Длительность: </strong>
          {movie.duration}
        </p>
      </section>

      {/* Кнопка */}
      <button
        onClick={() => navigate(`/booking/${encodeURIComponent(movie.title)}`)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition duration-300"
      >
        Забронировать
      </button>
    </main>
  );
}

export default MovieDetailsPage;
