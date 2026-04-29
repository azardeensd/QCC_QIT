import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../src/components/Common/Header';
import Attendance from '../src/Pages/Attendance/Attendance';
import Dashboard from '../src/Pages/Dashboard/Dashboard';
import Login from '../src/Pages/Login/Login'; // Import Login
import ProtectedRoute from '../src/components/Common/ProtectedRoute'; // Import Protected Route
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        
        <main className="content-area">
          <Routes>
            {/* The main attendance form (Public) */}
            <Route path="/" element={<Attendance />} />
            
            {/* The Login route (Public) */}
            <Route path="/login" element={<Login />} />
            
            {/* The admin dashboard (Protected) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
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
