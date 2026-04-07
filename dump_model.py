import json
import re

model_a = {
    "3m": { "users": 1800, "status": "Viral & Validasi", "risk": "medium",
        "revList": [
            { "name": "Uji Coba Featured Listing", "amount": 2000000, "note": "50 agen × Rp 50rb rata-rata" },
            { "name": "3D Studio Upgrade B2C", "amount": 800000, "note": "8 pengguna aktif" },
            { "name": "Early Adopter Tier Basic (SaaS)", "amount": 2500000, "note": "50 user promo" },
            { "name": "Marketplace Fee Furniture", "amount": 500000, "note": "Transaksi awal" }
        ],
        "expList": [
            { "name": "Facebook & IG Ads", "amount": 900000, "note": "Kampanye Akuisisi" },
            { "name": "Operasional Ringan", "amount": 1875000, "note": "Lisensi aset, toolkit" },
            { "name": "API WhatsApp & Midtrans", "amount": 1125000, "note": "Infrastruktur" },
            { "name": "Marketing & Ads Tambahan", "amount": 2250000, "note": "Promosi menyasar komunitas" }
        ]
    },
    "6m": { "users": 5400, "status": "Featured Listing & Subscription Aktif", "risk": "low",
        "revList": [
            { "name": "Featured Listing (Rp 50–150rb/bln)", "amount": 10000000, "note": "120 agen aktif" },
            { "name": "3D Studio Premium", "amount": 3500000, "note": "35 user upgrade" },
            { "name": "Komisi Marketplace Furniture", "amount": 10000000, "note": "Transaksi furniture berjalan" },
            { "name": "Subscription Pengguna (SaaS)", "amount": 25000000, "note": "250 subscriber aktif" },
            { "name": "Sponsorship Bank KPR", "amount": 20000000, "note": "1 Bank pasang placement" },
            { "name": "Iklan & Brand Sponsorship", "amount": 8000000, "note": "Slot iklan dashboard" },
            { "name": "Grant UMKM", "amount": 5000000, "note": "Dana BEKRAF" }
        ],
        "expList": [
            { "name": "Upgrade Server Cloud", "amount": 7800000, "note": "Sewa server traffic tinggi" },
            { "name": "Iklan & Marketing", "amount": 8400000, "note": "Akuisisi Agen & Subscriber" },
            { "name": "Biaya Support & CS", "amount": 8400000, "note": "Onboarding & Retensi" },
            { "name": "Toolkit, Lisensi, PR", "amount": 5100000, "note": "B2B Outreach & Admin" }
        ]
    },
    "1y": { "users": 19800, "status": "Ekosistem Stabil & Profitable", "risk": "low",
        "revList": [
            { "name": "Featured Listing Massal", "amount": 150000000, "note": "1500 agen aktif bayar" },
            { "name": "Subscription Pengguna (SaaS)", "amount": 80000000, "note": "800 subscriber aktif" },
            { "name": "Sponsorship Bank KPR", "amount": 60000000, "note": "Bank berlomba pasang KPR" },
            { "name": "Brand Partnership", "amount": 40000000, "note": "Brand furniture premium" },
            { "name": "Komisi Marketplace Furniture", "amount": 38000000, "note": "Volume belanja 3D/AR" },
            { "name": "Data Intelligence B2B", "amount": 25000000, "note": "Report tren ke developer" },
            { "name": "Studio 3D & Enterprise API", "amount": 20000000, "note": "Lisensi khusus & B2C pro" },
            { "name": "Iklan & Sponsorship Tambahan", "amount": 20000000, "note": "Pendapatan slot ekstra" },
            { "name": "UMKM Program Grant", "amount": 15000000, "note": "Dana CSR" }
        ],
        "expList": [
            { "name": "Infrastruktur Cloud & Big Data", "amount": 24000000, "note": "CDN & DB terdistribusi" },
            { "name": "Gaji Tim Inti & Eksekutif", "amount": 84000000, "note": "Programmer, Sales, CS, Lobi B2B" },
            { "name": "Kampanye, Marketing, Event", "amount": 24000000, "note": "Edukasi & Brand awareness" },
            { "name": "Customer Success & UMKM Ops", "amount": 19200000, "note": "Reduce churn & komunitas" },
            { "name": "Lisensi & API Gateway", "amount": 9000000, "note": "Peta, pembayaran, dsb" }
        ]
    },
    "3y": { "users": 108000, "status": "Platform Properti Gratis Terbesar", "risk": "low",
        "revList": [
            { "name": "Subscription SaaS Nasional", "amount": 300000000, "note": "4.000 subscriber aktif" },
            { "name": "Kontrak Bank KPR Premium", "amount": 300000000, "note": "Placement eksklusif" },
            { "name": "Brand Partnership Network", "amount": 150000000, "note": "Jaringan 30+ brand" },
            { "name": "Featured Listing Premium", "amount": 140000000, "note": "Posisi teratas properti" },
            { "name": "Data Intelligence Enterprise", "amount": 120000000, "note": "Kontrak dengan developer besar" },
            { "name": "Studio 3D Enterprise & API", "amount": 110000000, "note": "Licensing developer" },
            { "name": "Event Pameran Virtual", "amount": 80000000, "note": "Tiket vendor properti" },
            { "name": "Komisi Marketplace Premium", "amount": 160000000, "note": "Transaksi furniture & fashion" },
            { "name": "Iklan Display & Sponsorship", "amount": 80000000, "note": "Slot iklan nasional" }
        ],
        "expList": [
            { "name": "Server, AI & Komputasi Awan", "amount": 105000000, "note": "Rendering farm & DB raksasa" },
            { "name": "Gaji Tim Lengkap", "amount": 264000000, "note": "Tim startup skala penuh" },
            { "name": "Marketing, PR, Kampanye", "amount": 90000000, "note": "Agresif skala nasional" },
            { "name": "CSR, Komunitas & Edukasi", "amount": 30000000, "note": "Injeksi UMKM & subsidi" },
            { "name": "Legal, Compliance & Ops", "amount": 33000000, "note": "Sewa kantor, pengacara" }
        ]
    }
}

json_str = json.dumps(model_a, indent=2)
print(json_str)
