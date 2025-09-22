import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments/${id}`);
        setAppointment(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setMessage("Appointment not found.");
        } else {
          setMessage("Error fetching appointment details.");
        }
        console.error("Error fetching appointment:", error);
      }
    };
    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    try {
      const response = await axios.delete(`${API_URL}/appointments/${id}`);
      setMessage(response.data.message);
      // Navigate back to the list after cancellation
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Error canceling appointment.");
      }
      console.error("Error canceling appointment:", error);
    }
  };

  if (!appointment) {
    return <p>{message || "Loading appointment details..."}</p>;
  }

  return (
    <section>
      <h2>Appointment Details</h2>
      <div className="appointment-card">
        <h3>Appointment ID: {id}</h3>
        <p><strong>Name:</strong> {appointment.name}</p>
        <p><strong>Phone:</strong> {appointment.phone}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Status:</strong> <span className={appointment.status === 'canceled' ? 'status-canceled' : 'status-scheduled'}>{appointment.status}</span></p>
        {appointment.status !== 'canceled' && (
          <button onClick={handleCancel}>
            Cancel Appointment
          </button>
        )}
      </div>
      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default AppointmentDetail;