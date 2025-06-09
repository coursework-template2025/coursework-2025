import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHide(true), 1500); // 1.5 секунды
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`loading-screen ${hide ? 'fade-out' : ''}`}>
      <h1 className="loading-text">MyDiary</h1>
    </div>
  );
}
