//Это компонент, который отображает сетку из карточек фильмов, 
// показывая первые 15 фильмов из списка.
import React from 'react';
import movies from '../data/movies';
import MovieCard from './MovieCard';

const MoviesList = () => {
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {movies.slice(0, 15).map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MoviesList;
