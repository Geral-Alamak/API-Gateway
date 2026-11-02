from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Notifikasi Service")

class PesanNotifikasi(BaseModel):
    pasien_id: str
    pesan: str

@app.post("/send")
def send_notification(payload: PesanNotifikasi):
    # Integration with SMS/WhatsApp provider (e.g., Twilio, Meta API) goes here
    print(f"Sending to {payload.pasien_id}: {payload.pesan}")
    return {"status": "sent", "delivered_to": payload.pasien_id}
