import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './view/Home/Home';
import Info from './view/Info/Info';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/info/:id" element={<Info />} />
          </Routes>
      </Router>
  );
}

export default App;
