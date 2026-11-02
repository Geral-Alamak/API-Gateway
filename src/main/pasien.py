from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Pasien Service")

class PasienData(BaseModel):
    nama: str
    kontak: str
    keluhan: str

@app.post("/register")
def register_pasien(data: PasienData):
    # Database logic to save patient goes here
    return {"status": "success", "pasien_id": "P-1042", "data": data}

@app.get("/record/{pasien_id}")
def get_pasien(pasien_id: str):
    return {"pasien_id": pasien_id, "nama": "Budi Santoso", "status": "Registered"}
