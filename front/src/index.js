import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Login from './views/Login';
import Reg from './views/Reg';
import Layout from './views/Layout';
import Home from './views/Home';
import News from './views/News';
import Graph from './views/Graph';
import Personal from './views/Personal';
import Materials from './views/Materials';
import NewsForm from './views/NewsForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="News" element={<News />} />
          <Route path="Personal" element={<Personal />} />
          <Route path="Graph" element={<Graph />} />
          <Route path="Materials" element={<Materials />} />
          <Route path="NewsForm" element={<NewsForm />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/Reg" element={<Reg />} />
      </Routes>
  </BrowserRouter>
);

