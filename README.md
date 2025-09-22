# 📅 WhatsApp Appointment Scheduling System

A **full-stack web application** that allows users to schedule and manage appointments via a **ReactJS dashboard**, with a **FastAPI backend** that sends automated **WhatsApp notifications** using the Twilio API.

---

## 🚀 Features

- **FastAPI Backend**  
  Manage appointment creation, cancellation, and retrieval.  

- **Twilio/WhatsApp Integration**  
  Sends automated WhatsApp confirmation and cancellation messages.  

- **ReactJS Frontend**  
  User-friendly dashboard to schedule, view, and manage appointments.  

- **Secure Credentials**  
  API keys and secrets stored securely in a `.env` file.  

---

## 🛠️ Prerequisites

Before running this project, make sure you have installed:

- [Python 3.9+](https://www.python.org/downloads/)  
- [Node.js & npm](https://nodejs.org/)  
- [Twilio Account](https://www.twilio.com/) with WhatsApp Sandbox or Business Profile  

---

## 📂 Project Structure

```
whatsapp-scheduler/
├── backend/
│   ├── .env
│   ├── main.py
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Backend Setup (FastAPI + Twilio)

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```

Install dependencies:

```bash
pip install fastapi uvicorn python-decouple twilio python-multipart
```

Create a `.env` file and add your Twilio credentials:

```ini
# backend/.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

### 2️⃣ Frontend Setup (ReactJS)

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install axios
```

---

## ▶️ Usage

Run backend and frontend in **separate terminals**.

**Start Backend (FastAPI):**

```bash
cd backend
uvicorn main:app --reload
```

API runs at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

**Start Frontend (ReactJS):**

```bash
cd frontend
npm start
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔔 Notes

- For WhatsApp notifications in Twilio Sandbox, the recipient **must first send a "join" message** to your Twilio number.  
- Replace sandbox number with your **official Twilio WhatsApp number** for production use.  

---

## 📡 API Endpoints

| Method | Endpoint                         | Description                                     |
|--------|----------------------------------|-------------------------------------------------|
| POST   | `/appointments/`                 | Creates a new appointment & sends confirmation |
| GET    | `/appointments/`                 | Retrieves all appointments                     |
| DELETE | `/appointments/{appointment_id}` | Cancels an appointment & sends cancellation    |

---

## 📊 Exporting Data

Optionally, appointments can be exported to **Google Sheets** or CSV for reporting and tracking (future enhancement).  

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/my-feature`)  
3. Commit changes (`git commit -m "Add my feature"`)  
4. Push branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share!  

---

💡 Built with **FastAPI + ReactJS + Twilio** ❤️
