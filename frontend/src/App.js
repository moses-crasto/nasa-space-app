// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ApodViewer from './components/ApodViewer';
import MarsGallery from './components/MarsGallery';
import NeoDashboard from './components/NeoDashboard';
import EPICViewer from './components/EPICViewer';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/apod" replace />} />
        <Route path="/apod" element={<ApodViewer />} />
        <Route path="/neo-dashboard" element={<NeoDashboard />} />
        <Route path="/mars-gallery" element={<MarsGallery />} />
        <Route path="/epic" element={<EPICViewer />} />
      </Routes>
    </Router>
  );
}

export default App;