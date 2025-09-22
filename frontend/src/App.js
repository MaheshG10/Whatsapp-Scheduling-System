import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScheduleAppointment from './ScheduleAppointment';
import AppointmentsList from './AppointmentsList';
import AppointmentDetail from './AppointmentDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Appointment Process</h1>
        </header>

        <nav className="main-nav">
          <Link to="/schedule">Schedule Appointment</Link>
          <Link to="/appointments">All Appointments</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/schedule" element={<ScheduleAppointment />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/appointments/:id" element={<AppointmentDetail />} />
            <Route path="/" element={<ScheduleAppointment />} /> {/* Default route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;