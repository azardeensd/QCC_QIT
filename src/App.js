import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../src/components/Common/Header';
import Attendance from '../src/Pages/Attendance/Attendance';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import './App.css'; // General layout styles

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        
        <main className="content-area">
          <Routes>
            {/* The main attendance form */}
            <Route path="/" element={<Attendance />} />
            
            {/* The admin dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2026 Rane Madras Limited</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
