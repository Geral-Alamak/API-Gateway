from fastapi import FastAPI
from pydantic import BaseModel
import httpx

app = FastAPI(title="Reservasi Service")

class ReservasiData(BaseModel):
    pasien_id: str
    tanggal_waktu: str
    dokter_tujuan: str

@app.post("/book")
async def create_reservasi(data: ReservasiData):
    # 1. Database logic to save reservation
    reservasi_id = "R-5591"
    
    # 2. Trigger notification asynchronously (fire-and-forget or via message queue in production)
    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                "http://localhost:8003/send",
                json={"pasien_id": data.pasien_id, "pesan": f"Reservasi {reservasi_id} sukses untuk {data.tanggal_waktu}"}
            )
        except httpx.RequestError:
            pass # Handle notification failure without breaking the reservation
            
    return {"status": "booked", "reservasi_id": reservasi_id, "detail": data}
