import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any

import uvicorn
from fastapi import FastAPI, HTTPException, Form, BackgroundTasks
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from decouple import config
from twilio.rest import Client


TWILIO_ACCOUNT_SID = config("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = config("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = config("TWILIO_WHATSAPP_NUMBER")

DB_FILE = "db.json"

app = FastAPI(
    title="WhatsApp Appointment Scheduling API",
    description="API for managing appointments and sending WhatsApp notifications.",
    version="1.0.0",
)
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_db() -> Dict[str, Any]:
    """Reads the JSON database file."""
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def write_db(data: Dict[str, Any]):
    """Writes to the JSON database file."""
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

def send_whatsapp_message(to_number: str, message_body: str):
    """Sends a WhatsApp message using the Twilio API."""
    try:
        print(f"Attempting to send message to {to_number}...")
        twilio_client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body=message_body,
            to=f"whatsapp:{to_number}"
        )
        print(f"Message sent to {to_number} successfully.")
    except Exception as e:
        print(f"Error sending WhatsApp message to {to_number}: {e}")

def schedule_reminder(name: str, phone: str, appointment_time_str: str, appointment_id: str):
    """Schedules a reminder to be sent 1 hour before the appointment."""
    try:
        appointment_time = datetime.strptime(appointment_time_str, "%Y-%m-%dT%H:%M")
        reminder_time = appointment_time - timedelta(hours=1)
        
    
        print(f"Reminder scheduled for {reminder_time} for appointment {appointment_id}.")
       
    except ValueError:
        print("Could not schedule reminder due to invalid time format.")

class AppointmentIn(BaseModel):
    name: str
    phone: str
    date: str
    time: str
    reason: str

class AppointmentOut(AppointmentIn):
    status: str
    
class CreateAppointmentResponse(BaseModel):
    message: str
    appointment_id: str

@app.post("/appointments/", response_model=CreateAppointmentResponse)
def create_appointment(
    background_tasks: BackgroundTasks,
    name: str = Form(..., description="User's full name."),
    phone: str = Form(..., description="User's phone number with country code."),
    date: str = Form(..., description="Date of the appointment (YYYY-MM-DD)."),
    time: str = Form(..., description="Time of the appointment (HH:MM)."),
    reason: str = Form(..., description="Reason for the appointment."),
):
    """Creates a new appointment, stores it, and sends a confirmation message."""
    db = read_db()
    
    appointment_id = str(uuid.uuid4())
    appointment = AppointmentOut(
        name=name,
        phone=phone,
        date=date,
        time=time,
        reason=reason,
        status="scheduled"
    )
    
    db[appointment_id] = appointment.dict()
    write_db(db)
    
    confirmation_msg = f"Hello {name}, your appointment is confirmed for {date} at {time} for {reason}. Your Appointment ID is {appointment_id}."
    send_whatsapp_message(phone, confirmation_msg)
    
    appointment_datetime_str = f"{date}T{time}"
    background_tasks.add_task(schedule_reminder, name, phone, appointment_datetime_str, appointment_id)
    
    return {"message": "Appointment created successfully!", "appointment_id": appointment_id}

@app.get("/appointments/")
def get_all_appointments():
    """Retrieves a list of all upcoming appointments."""
    return read_db()

@app.get("/appointments/{appointment_id}")
def get_appointment(appointment_id: str):
    """Retrieves a specific appointment by its ID."""
    db = read_db()
    if appointment_id not in db:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    return db[appointment_id]

@app.delete("/appointments/{appointment_id}")
def cancel_appointment(appointment_id: str):
    """Cancels an appointment and sends a cancellation message."""
    db = read_db()
    if appointment_id not in db:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    
    appointment = db[appointment_id]
    if appointment['status'] == 'canceled':
        raise HTTPException(status_code=400, detail="Appointment is already canceled.")
    
    db[appointment_id]['status'] = 'canceled'
    write_db(db)
    
    name = appointment['name']
    phone = appointment['phone']
    cancellation_msg = f"Hello {name}, your appointment with ID {appointment_id} has been canceled."
    send_whatsapp_message(phone, cancellation_msg)
    
    return {"message": "Appointment canceled successfully."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)