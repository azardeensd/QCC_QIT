import React from 'react';
import Header from '../src/components/Common/Header';
import Attendance from '../src/Pages/Attendance/Attendance';
import './App.css'; // General layout styles

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="content-area">
        <Attendance />
      </main>
      <footer className="app-footer">
        <p>© 2026 QCC & QIT Event Management Portal</p>
      </footer>
    </div>
  );
}

export default App;