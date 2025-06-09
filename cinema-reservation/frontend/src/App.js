//Это главный компонент приложения, который настраивает маршруты:
//  главная страница по / и страница бронирования по /booking/:title.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MovieDetailsPage from './components/MovieDetailsPage';
import  Register from './pages/register'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:title" element={<BookingPage />} />
        <Route path="/movie/:title" element={<MovieDetailsPage />} />
           <Route path="/register" element={<Register />} /> 
      </Routes>
    </Router>
  );
}

export default App;
