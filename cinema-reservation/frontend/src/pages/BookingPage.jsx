//компонент для бронирования мест в кинотеатре!
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const halls = ['Зал 1', 'Зал 2'];
const times = ['14:00', '17:30', '21:00'];
const seats = Array.from({ length: 30 }, (_, i) => i + 1);

const BookingPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedData, setBookedData] = useState({});

  const updateStorage = (data) => {
    localStorage.setItem(`booking-${title}`, JSON.stringify(data));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`booking-${title}`)) || {};
    setBookedData(data);
  }, [title]);

  const storageKey = `${selectedHall}-${selectedTime}`;
  const bookedSeats = bookedData[storageKey] || [];

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = () => {
    if (!selectedHall || !selectedTime || selectedSeats.length === 0) return;
    const updated = {
      ...bookedData,
      [storageKey]: [...bookedSeats, ...selectedSeats],
    };
    setBookedData(updated);
    updateStorage(updated);
    setSelectedSeats([]);
  };

  const handleCancelSeat = (seat) => {
    const updatedSeats = bookedSeats.filter((s) => s !== seat);
    const updated = {
      ...bookedData,
      [storageKey]: updatedSeats,
    };
    setBookedData(updated);
    updateStorage(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-200 to-pink-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-8 animate-pulse">
        Бронирование: {title}
      </h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          className="p-3 rounded-xl border border-purple-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedHall}
          onChange={(e) => setSelectedHall(e.target.value)}
        >
          <option value="">Выберите зал</option>
          {halls.map((hall) => (
            <option key={hall} value={hall}>
              {hall}
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded-xl border border-purple-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Выберите время</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-6 gap-3 mb-6 animate-fade-in">
        {seats.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              disabled={isBooked}
              className={`w-10 h-10 rounded-xl text-sm font-bold shadow transition duration-200
                ${isBooked
                  ? 'bg-red-500 text-white cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-500 text-white scale-105'
                  : 'bg-green-400 hover:bg-green-500 text-white hover:scale-105'}`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleBooking}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
        >
          Забронировать
        </button>

        <button
          onClick={() => navigate('/')}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
        >
          Назад
        </button>
      </div>

      {bookedSeats.length > 0 && (
        <div className="mt-10 w-full max-w-md">
          <h3 className="text-xl font-semibold text-purple-800 mb-3">Забронированные места:</h3>
          <div className="flex flex-wrap gap-2">
            {bookedSeats.map((seat) => (
              <button
                key={seat}
                onClick={() => handleCancelSeat(seat)}
                className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded shadow-sm text-sm"
              >
                {seat} ✕
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
