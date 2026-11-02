# reservasi_logic.py

# ==========================================
# 1. Procedural Logic (Basis Path Testing)
# ==========================================
def hitung_biaya_reservasi(jam_booking, hari, status_pasien):
    """
    Fungsi dengan 3 keputusan (if).
    V(G) = 3 + 1 = 4 jalur independen.
    """
    # Keputusan 1
    if jam_booking < 8 or jam_booking > 20:
        raise ValueError("Di luar jam operasional klinik")
    
    biaya = 100_000
    
    # Keputusan 2
    if hari in ["Sabtu", "Minggu"]:
        biaya += 50_000
        
    # Keputusan 3
    if status_pasien == "VIP":
        biaya = biaya * 0.8
        
    return biaya

# ==========================================
# 2. Object Oriented Logic (State Machine)
# ==========================================
class Reservasi:
    """
    State machine dengan 4 state: DRAFT -> CONFIRMED -> COMPLETED atau CANCELED.
    """
    def __init__(self):
        self.status = "DRAFT"

    def konfirmasi(self):
        if self.status != "DRAFT":
            raise RuntimeError("Hanya reservasi DRAFT yang bisa dikonfirmasi")
        self.status = "CONFIRMED"

    def selesaikan(self):
        if self.status != "CONFIRMED":
            raise RuntimeError("Hanya reservasi CONFIRMED yang bisa diselesaikan")
        self.status = "COMPLETED"

    def batalkan(self):
        if self.status not in ["DRAFT", "CONFIRMED"]:
            raise RuntimeError("Reservasi yang sudah selesai atau batal tidak bisa dibatalkan lagi")
        self.status = "CANCELED"

# ==========================================
# 3. Inheritance & Polymorphism
# ==========================================
class NotifikasiProvider:
    def get_biaya_layanan(self):
        return 0

class NotifikasiSMS(NotifikasiProvider):
    def get_biaya_layanan(self):
        return 500  # Override biaya per SMS

class NotifikasiWhatsApp(NotifikasiProvider):
    def get_biaya_layanan(self):
        return 150  # Override biaya per WA
