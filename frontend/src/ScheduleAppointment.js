import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function ScheduleAppointment() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('reason', reason);

    try {
      const response = await axios.post(`${API_URL}/appointments/`, formData);
      setMessage(response.data.message);
      setName('');
      setPhone('');
      setDate('');
      setTime('');
      setReason('');
    } catch (error) {
      setMessage("Error scheduling appointment.");
      console.error("Error scheduling appointment:", error);
    }
  };

  return (
    <section>
      <h2>Schedule New Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" required></textarea>
        <button type="submit">Schedule</button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default ScheduleAppointment;