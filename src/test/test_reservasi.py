# test_reservasi.py
import pytest
from reservasi_logic import hitung_biaya_reservasi, Reservasi, NotifikasiProvider, NotifikasiSMS, NotifikasiWhatsApp

# ==========================================
# Tests for Procedural Logic (Basis Path)
# ==========================================
def test_jalur1_luar_jam_operasional():
    with pytest.raises(ValueError, match="Di luar jam operasional klinik"):
        hitung_biaya_reservasi(7, "Senin", "REGULAR")

def test_jalur2_hari_biasa_regular():
    assert hitung_biaya_reservasi(10, "Senin", "REGULAR") == 100_000

def test_jalur3_akhir_pekan_regular():
    assert hitung_biaya_reservasi(10, "Sabtu", "REGULAR") == 150_000

def test_jalur4_akhir_pekan_vip():
    assert hitung_biaya_reservasi(10, "Sabtu", "VIP") == 120_000

# ==========================================
# Tests for OO State-Based Logic
# ==========================================
@pytest.fixture
def reservasi_draft():
    return Reservasi()

@pytest.fixture
def reservasi_confirmed():
    r = Reservasi()
    r.konfirmasi()
    return r

def test_konfirmasi_mengubah_state(reservasi_draft):
    reservasi_draft.konfirmasi()
    assert reservasi_draft.status == "CONFIRMED"

def test_selesaikan_dari_confirmed(reservasi_confirmed):
    reservasi_confirmed.selesaikan()
    assert reservasi_confirmed.status == "COMPLETED"

def test_selesaikan_dari_draft_ditolak(reservasi_draft):
    with pytest.raises(RuntimeError, match="Hanya reservasi CONFIRMED yang bisa diselesaikan"):
        reservasi_draft.selesaikan()

def test_batalkan_dari_completed_ditolak(reservasi_confirmed):
    reservasi_confirmed.selesaikan()
    with pytest.raises(RuntimeError, match="Reservasi yang sudah selesai"):
        reservasi_confirmed.batalkan()

# ==========================================
# Tests for Inheritance & Polymorphism
# ==========================================
@pytest.mark.parametrize("provider_class, expected_biaya", [
    (NotifikasiProvider, 0),
    (NotifikasiSMS, 500),
    (NotifikasiWhatsApp, 150)
])
def test_polymorphism_biaya_layanan(provider_class, expected_biaya):
    provider = provider_class()
    assert provider.get_biaya_layanan() == expected_biaya
