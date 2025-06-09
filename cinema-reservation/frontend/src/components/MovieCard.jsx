import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden w-full max-w-xs mx-auto transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-gray-100 duration-500 ease-in-out">
      {/* Постер фильма */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-4">
        {/* Название фильма */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 transition duration-300 ease-in-out hover:text-indigo-600">
          {movie.title}
        </h2>

        {/* Кнопка "Посмотреть" */}
        <Link
          to={`/movie/${encodeURIComponent(movie.title)}`}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Посмотреть
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
