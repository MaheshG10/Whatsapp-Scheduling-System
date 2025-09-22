import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';

function AppointmentsList() {
  const [appointments, setAppointments] = useState({});

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section>
      <h2>All Appointments</h2>
      <div className="appointments-list">
        {Object.keys(appointments).length > 0 ? (
          Object.keys(appointments).map((id) => (
            <Link to={`/appointments/${id}`} key={id} className="appointment-card-link">
              <div className="appointment-card">
                <h3>Appointment ID: {id}</h3>
                <p><strong>Name:</strong> {appointments[id].name}</p>
                <p><strong>Status:</strong> <span className={appointments[id].status === 'canceled' ? 'status-canceled' : 'status-scheduled'}>{appointments[id].status}</span></p>
              </div>
            </Link>
          ))
        ) : (
          <p>No appointments scheduled yet.</p>
        )}
      </div>
    </section>
  );
}

export default AppointmentsList;