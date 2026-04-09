"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Chart from "chart.js/auto";
import "./bisnis.css";

/* ══════════════════════════════════════════════════
   FORMATTER
══════════════════════════════════════════════════ */
const formatRp = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

/* ══════════════════════════════════════════════════
   DATA MODEL — 3 STRATEGI BISNIS CERDASLIVING
══════════════════════════════════════════════════ */
interface RevExpItem { name: string; amount: number; note: string; }
interface PeriodData { users: number; status: string; risk: string; revList: RevExpItem[]; expList: RevExpItem[]; }
interface StreamItem { name: string; desc: string; pct: number; }
interface MetricItem { label: string; value: string; }
interface PhaseItem { n: number; title: string; desc: string; time: string; }
interface StratItem { t: string; d: string; icon: string; }

interface Model {
  id: string; emoji: string; label: string; title: string; name: string; tagline: string;
  color: string; colorAlt: string; colorClass: string; revenueTarget: string;
  strategies: StratItem[]; streams: StreamItem[]; metrics: MetricItem[];
  phases: PhaseItem[]; pros: string[]; cons: string[];
  data: Record<string, PeriodData>;
}

const models: Record<string, Model> = {
  a: {
    id: "a", emoji: "🏆", label: "REVENUE TERTINGGI (Ultimate)",
    title: "CerdasLiving — Ultimate Ecosystem Strategy",
    name: "Featured Listing + Ekosistem B2B & SaaS",
    tagline: "Strategi terpadu Ultimate 3 aliran raksasa: Featured Listing bebas komisi untuk properti massal, SaaS Subscription terjangkau untuk akses visualisasi 3D, serta Community B2B Partnership bernilai premium.",
    color: "#111111", colorAlt: "#444444", colorClass: "a", revenueTarget: "Rp 320 Jt",
    strategies: [
      { t: "Listing Properti Gratis & Featured", d: "Semua agen dapat listing properti tanpa henti & tanpa potongan. Agen dapat membeli slot Featured (Rp 50–150rb/bln) untuk promosi premium.", icon: "🏠" },
      { t: "Subscription Terjangkau Studio 3D", d: "Freemium akses 2 projek gratis → Basic Rp 50rb → Pro Rp 150rb. Mendorong partisipasi masif untuk fitur AI Interior di Indonesia.", icon: "💎" },
      { t: "Enterprise API & KPR Sponsorship", d: "Sponsorship slot dari bank sentral (KPR) plus pendelegasian engine 3D ke Developer korporat dengan Kontrak Rp 1–5 Juta/proyek.", icon: "🤝" },
    ],
    streams: [
      { name: "Featured Listing Premium", desc: "Agen membayar subscription Rp 50–150rb/bln untuk posisi atas (pinned) plus lencana verifikasi. Menjadi pendorong utama.", pct: 30 },
      { name: "Subscription Pengguna (SaaS)", desc: "Mulai dari Rp 50rb–150rb/bln untuk limit tak terbatas simulasi ruang 3D, Floor Plan AI, & Analytics pasar.", pct: 25 },
      { name: "Ads & Brand Partnership KPR", desc: "Vendor Bank berebut ruang pasang bunga KPR; Vendor furnitur menyewa placement visual.", pct: 20 },
      { name: "Enterprise API & B2B Insight", desc: "Data agreagasi user (non-PII) yang dijual reportase ke Developer kota besar ditambah lisensi 3D Engine. Kontrak Rp 1–5 Juta/proyek.", pct: 15 },
      { name: "Marketplace & UMKM Grant", desc: "Potongan checkout komisi 5-8% via belanja katalog 3D; beserta peluang pendanaan hibah Pemerintah untuk klaster Cileungsi.", pct: 10 },
    ],
    metrics: [
      { label: "MAU Bulan ke-12", value: "85.000+" }, { label: "Subs/Agen Premium", value: "5.000+" },
      { label: "Sponsor/Enterprise", value: "25+" }, { label: "NPS Score", value: "> 75" },
      { label: "Payback Period", value: "6-8 bln" }, { label: "Break Even Titik", value: "Bulan 7" },
    ],
    phases: [
      { n: 1, title: "Akuisisi Viral 3 Elemen (Bulan 1–3)", desc: "Launch platform 100% bebas komisi bersamaan tools dasar 3D gratis. Menggemparkan komunitas sebagai 'Super Ecosystem'. Kumpulkan pengguna awal & feedback secara pesat.", time: "0–3 bln" },
      { n: 2, title: "Aktivasi Titik Monetisasi (Bulan 4–6)", desc: "Aktifkan Featured Listing (Rp 50rb) beserta tombol Paywall langganan 3D. Presentasikan pitch pilot untuk lisensi developer & buka penawaran awal KPR Bank.", time: "4–6 bln" },
      { n: 3, title: "Harmonisasi Revenue (Bulan 7–12)", desc: "Siklus pemasukan mengalir dari 3 arah: Agen Bayar Featured, Langganan user pro 3D, ditambah dana cair dari Brand Partnership berskala korporat & B2B Data.", time: "7–12 bln" },
      { n: 4, title: "Domination Ekosistem Nasional (Tahun 2)", desc: "Ribuan agen saling bidding di halaman 1, Brand tier satu pasang billboard virtual, volume belanja 3D meningkat tajam. Meraih valuasi matang Seri A.", time: "Thn 2" },
    ],
    pros: ["Pertumbuhan user & Listing paling eksplosif dari Zero Barrier to Entry", "Multi-mesin arus uang (B2C, SaaS, Enterprise, Ads) membuat stabilitas nyaris sempurna", "Traction tinggi menarik minat Bank / Brand besar tanpa ragu (Karena volume MAU Ultimate)", "Efisiensi operasional karena tim dapat tersinergi menjalankan ekosistem berputar mandiri"],
    cons: ["Sifat execution-heavy, manajemen 3 pipeline bisnis sekaligus butuh tim elit yang tangguh", "Pusat Render 3D berpotensi membuat Tagihan Server meroket jika trafik tidak seimbang dengan konversi", "Komunikasi marketing awal harus ekstra padat agar Brand / user tidak kebingungan 'Ini App Apa?'"],
    data: {
      "3m": {
        "users": 1800,
        "status": "Viral & Validasi",
        "risk": "medium",
        "revList": [
          { "name": "Uji Coba Featured Listing", "amount": 2000000, "note": "50 agen \u00d7 Rp 50rb rata-rata" },
          { "name": "3D Studio Upgrade B2C", "amount": 800000, "note": "8 pengguna aktif" },
          { "name": "Early Adopter Tier Basic (SaaS)", "amount": 2500000, "note": "50 user promo" },
          { "name": "Marketplace Fee Furniture", "amount": 500000, "note": "Transaksi awal" }
        ],
        "expList": [
          { "name": "Operasional Ringan", "amount": 1875000, "note": "Lisensi aset, toolkit" },
          { "name": "API WhatsApp & Midtrans", "amount": 1125000, "note": "Infrastruktur" },
          { "name": "Marketing Promosi", "amount": 1000000, "note": "Promosi menyasar komunitas" }
        ]
      },
      "6m": {
        "users": 5400,
        "status": "Featured Listing & Subscription Aktif",
        "risk": "low",
        "revList": [
          { "name": "Featured Listing (Rp 50\u2013150rb/bln)", "amount": 10000000, "note": "120 agen aktif" },
          { "name": "3D Studio Premium", "amount": 3500000, "note": "35 user upgrade" },
          { "name": "Komisi Marketplace Furniture", "amount": 10000000, "note": "Transaksi furniture berjalan" },
          { "name": "Subscription Pengguna (SaaS)", "amount": 25000000, "note": "250 subscriber aktif" },
          { "name": "Sponsorship Bank KPR", "amount": 20000000, "note": "1 Bank pasang placement" },
          { "name": "Iklan & Brand Sponsorship", "amount": 8000000, "note": "Slot iklan dashboard" },
          { "name": "Grant UMKM", "amount": 5000000, "note": "Dana BEKRAF" }
        ],
        "expList": [
          { "name": "Upgrade Server Cloud", "amount": 7800000, "note": "Sewa server traffic tinggi" },
          { "name": "Iklan & Marketing", "amount": 11700000, "note": "Akuisisi Agen & Subscriber" },
          { "name": "Biaya Support & CS", "amount": 8400000, "note": "Onboarding & Retensi" },
          { "name": "Toolkit, Lisensi, PR", "amount": 5100000, "note": "B2B Outreach & Admin" }
        ]
      },
      "1y": {
        "users": 19800,
        "status": "Ekosistem Stabil & Profitable",
        "risk": "low",
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
          { "name": "Customer Success & UMKM Ops", "amount": 18000000, "note": "Reduce churn & komunitas" },
          { "name": "Lisensi & API Gateway", "amount": 9000000, "note": "Peta, pembayaran, dsb" }
        ]
      },
      "3y": {
        "users": 108000,
        "status": "Platform Properti Gratis Terbesar",
        "risk": "low",
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
  }
};

/* ══════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════ */
const riskBadge = (risk: string) => {
  if (risk === "high") return { cls: "status-danger", label: "⚠ Risiko Tinggi" };
  if (risk === "medium") return { cls: "status-warning", label: "~ Risiko Sedang" };
  return { cls: "status-success", label: "✓ Risiko Rendah" };
};

const periodLabels: Record<string, string> = {
  "3m": "3 Bulan — Traction",
  "6m": "6 Bulan — Validasi",
  "1y": "1 Tahun — Skala",
  "3y": "3 Tahun — Maturity",
};

/* ══════════════════════════════════════════════════
   KOMPONEN UTAMA
══════════════════════════════════════════════════ */
export default function BisnisDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ key: string; display: string; emoji: string; role: string } | null>(null);
  const [activeModel, setActiveModel] = useState("a");
  const [activePeriod, setActivePeriod] = useState("1y");
  const [comments, setComments] = useState<Record<string, { user: string; display: string; emoji: string; text: string; time: string; model: string }[]>>({});
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartInstance = useRef<any>(null);

  /* ── Mount guard ── */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem("cl_user");
      if (!stored) { router.replace("/bisnis/login"); return; }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(JSON.parse(stored));
    } catch {
      router.replace("/bisnis/login");
    }
  }, [router, mounted]);

  /* ── Load comments ── */
  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem("cl_comments");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setComments(JSON.parse(stored));
    } catch { }
  }, [mounted]);

  /* ── Logout ── */
  const handleLogout = () => {
    try { 
      const stored = localStorage.getItem("cl_user");
      let username = "Guest";
      if (stored) {
         try { username = JSON.parse(stored).key || "User"; } catch {}
      }
      fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "Logout", path: "/bisnis", username })
      }).catch(() => {});
      localStorage.removeItem("cl_user"); 
      document.cookie = `cl_session=; path=/; max-age=0; SameSite=Lax`;
    } catch { }
    router.replace("/bisnis/login");
  };

  /* ── Save comment ── */
  const handleAddComment = () => {
    if (!commentText.trim() || !currentUser) return;
    const key = `${currentUser.key}_${activeModel}`;
    const newComments = { ...comments };
    if (!newComments[key]) newComments[key] = [];
    newComments[key].push({ user: currentUser.key, display: currentUser.display, emoji: currentUser.emoji, text: commentText.trim(), time: new Date().toISOString(), model: activeModel });
    setComments(newComments);
    try { localStorage.setItem("cl_comments", JSON.stringify(newComments)); } catch { }
    setCommentText("");
  };

  /* ── Delete comment ── */
  const handleDeleteComment = (key: string, idx: number) => {
    const newComments = { ...comments };
    newComments[key].splice(idx, 1);
    if (newComments[key].length === 0) delete newComments[key];
    setComments(newComments);
    try { localStorage.setItem("cl_comments", JSON.stringify(newComments)); } catch { }
  };

  /* ── Get model comments ── */
  const getModelComments = () => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") {
      const all: { user: string; display: string; emoji: string; text: string; time: string; model: string; key: string; idx: number }[] = [];
      Object.entries(comments).forEach(([key, msgs]) => {
        if (key.endsWith(`_${activeModel}`)) msgs.forEach((m, idx) => all.push({ ...m, key, idx }));
      });
      return all.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    } else {
      const userKey = `${currentUser.key}_${activeModel}`;
      const adminKey = `admin_${activeModel}`;
      const ceoKey = `ceo_${activeModel}`;
      const myComments = (comments[userKey] || []).map((m, idx) => ({ ...m, key: userKey, idx }));
      const adminComments = (comments[adminKey] || []).map((m, idx) => ({ ...m, key: adminKey, idx }));
      const ceoComments = (comments[ceoKey] || []).map((m, idx) => ({ ...m, key: ceoKey, idx }));
      return [...myComments, ...adminComments, ...ceoComments].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    }
  };

  const totalAllComments = currentUser?.role === "admin"
    ? Object.values(comments).flat().length
    : Object.entries(comments).filter(([k]) => k.startsWith((currentUser?.key ?? "") + "_") || k.startsWith("admin_") || k.startsWith("ceo_")).reduce((s, [, v]) => s + v.length, 0);

  const modelComments = getModelComments();
  const model = models[activeModel];
  const periodData = model.data[activePeriod];
  const totalRev = periodData.revList.reduce((s, i) => s + i.amount, 0);
  const totalExp = periodData.expList.reduce((s, i) => s + i.amount, 0);
  const netProfit = totalRev - totalExp;
  const badge = riskBadge(periodData.risk);

  /* ── Chart ── */
  useEffect(() => {
    if (!mounted || !currentUser) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;
    const allPeriods = ["3m", "6m", "1y", "3y"];
    const labels = ["3 Bulan", "6 Bulan", "1 Tahun", "3 Tahun"];
    const revenues = allPeriods.map(p => model.data[p].revList.reduce((s, i) => s + i.amount, 0));
    const expenses = allPeriods.map(p => model.data[p].expList.reduce((s, i) => s + i.amount, 0));
    const profits = revenues.map((r, i) => r - expenses[i]);
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels, datasets: [
          { type: "line" as const, label: "Net Profit / Loss", data: profits, borderColor: model.color, backgroundColor: `${model.color}22`, borderWidth: 3, tension: 0.42, pointRadius: 7, pointHoverRadius: 10, pointBackgroundColor: model.color, fill: true, yAxisID: "y" },
          { type: "bar" as const, label: "Total Pendapatan / bln", data: revenues, backgroundColor: `${model.color}28`, borderColor: `${model.color}55`, borderWidth: 1.5, borderRadius: 8, yAxisID: "y" },
          { type: "bar" as const, label: "Total Pengeluaran / bln", data: expenses, backgroundColor: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)", borderWidth: 1.5, borderRadius: 8, yAxisID: "y" },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top", labels: { color: "#4a5568", font: { family: "'Plus Jakarta Sans', sans-serif", weight: "bold", size: 12 }, usePointStyle: true, pointStyleWidth: 8 } },
          tooltip: { backgroundColor: "rgba(255,255,255,0.98)", titleColor: "#0d1b2a", bodyColor: "#4a5568", borderColor: "rgba(0,0,0,0.10)", borderWidth: 1, titleFont: { size: 13, family: "'Plus Jakarta Sans', sans-serif", weight: "bold" }, bodyFont: { size: 13, family: "'Plus Jakarta Sans', sans-serif" }, padding: 14, cornerRadius: 12, callbacks: { label: (c) => ` ${c.dataset.label}: ${formatRp(c.raw as number)}` } },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.07)" }, border: { color: "transparent" }, ticks: { color: "#8b97b1", font: { family: "'Plus Jakarta Sans', sans-serif", weight: "bold", size: 11 }, callback: (v) => Number(v) >= 1e9 ? `${Number(v) / 1e9}M` : Number(v) >= 1e6 ? `${Number(v) / 1e6} Jt` : Number(v) >= 1e3 ? `${Number(v) / 1e3} rb` : v } },
          x: { grid: { display: false }, border: { color: "rgba(0,0,0,0.07)" }, ticks: { color: "#4a5568", font: { family: "'Plus Jakarta Sans', sans-serif", weight: "bold", size: 12 } } },
        },
      },
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [activeModel, mounted, currentUser]);

  const switchModel = (m: string) => { setActiveModel(m); setActivePeriod("1y"); };

  if (!mounted || !currentUser) return null;

  return (
    <div className="bisnis-root">

      {/* ═══ USER BAR ══════════════════════════════════════ */}
      <div className="user-bar">
        <div className="user-bar-left">
          <span className="user-bar-emoji">{currentUser.emoji}</span>
          <div>
            <span className="user-bar-name">{currentUser.display}</span>
            {currentUser.role === "admin" && (
              <span className="user-bar-admin-tag">🛡️ Administrator</span>
            )}
          </div>
        </div>
        <div className="user-bar-right">
          {currentUser.role === "admin" && (
            <Link href="/bisnis/tracking" className="comment-toggle-btn" style={{ background: "rgba(230, 162, 10, 0.2)", color: "#e6a20a", borderColor: "rgba(230, 162, 10, 0.4)", textDecoration: "none" }}>
              🛡️ Radar & IP Audit
            </Link>
          )}
          <button className="comment-toggle-btn" onClick={() => setShowComments(!showComments)} id="btn-toggle-comments">
            💬 Komentar {totalAllComments > 0 && <span className="comment-count-badge">{totalAllComments}</span>}
          </button>
          <button className="logout-btn" onClick={handleLogout} id="btn-logout">Keluar ↗</button>
        </div>
      </div>

      <div className="dashboard-container">

        {/* ═══ PORTAL LINK BANNER ══════════════════════════ */}
        <div className="portal-link-banner">
          <div className="portal-link-banner-text">
            <span className="portal-link-banner-icon">🏠</span>
            <div>
              <span className="portal-link-banner-label">Portal Utama</span>
              <span className="portal-link-banner-title">Kunjungi CerdasLiving — Platform Properti &amp; Lifestyle</span>
            </div>
          </div>
          <Link href="/" className="portal-link-btn" id="btn-portal-link">
            Buka Portal →
          </Link>
        </div>

        {/* ═══ CANVAS LINK BANNER ══════════════════════════ */}
        <div className="portal-link-banner canvas-banner" style={{ background: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)", marginTop: "1rem" }}>
          <div className="portal-link-banner-text">
            <span className="portal-link-banner-icon">🧠</span>
            <div>
              <span className="portal-link-banner-label" style={{ color: "var(--color-gold)" }}>Strategi Visual</span>
              <span className="portal-link-banner-title" style={{ color: "white" }}>Lihat Business Model Canvas — Ekosistem Cerdas Living</span>
            </div>
          </div>
          <Link href="/bisnis/canvas" className="portal-link-btn" id="btn-canvas-link" style={{ background: "var(--color-gold)", color: "black", borderColor: "var(--color-gold)" }}>
            Buka Canvas →
          </Link>
        </div>

        {/* ═══ HEADER ══════════════════════════════════════ */}
        <header className="header" style={{ marginTop: "2.5rem" }}>
          <span className="badge">📋 Rancangan Strategi Bisnis CerdasLiving</span>
          <h1 className="title">Ultimate Strategy Monetisasi</h1>
          <p className="subtitle">
            Riset mendalam strategi bisnis gabungan bernilai tinggi untuk platform properti Indonesia —
            dilengkapi proyeksi keuangan bulanan berdasar fase.
          </p>
        </header>

        {/* ═══ 3 STRATEGY COMPARISON CARDS ════════════════ */}
        <div className="strategy-compare">
          {Object.values(models).map((m) => (
            <div key={m.id} className={`strat-card ${m.id} ${activeModel === m.id ? "active" : ""}`}
              onClick={() => switchModel(m.id)} role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && switchModel(m.id)}>
              <div className={`strat-icon ${m.id}`} aria-hidden="true">{m.emoji}</div>
              {m.label && <div className={`strat-card-label ${m.id}`}>{m.label}</div>}
              <div className="strat-card-name">{m.name}</div>
              <div className="strat-card-tagline">{m.tagline.slice(0, 110)}…</div>
              <div className="strat-revenue">
                <div className="strat-revenue-label">Net Profit {activePeriod === "3m" ? "3 Bulan" : activePeriod === "6m" ? "6 Bulan" : activePeriod === "1y" ? "1 Tahun" : "3 Tahun"}</div>
                <div className={`strat-revenue-num ${m.id}`}>{formatRp(m.data[activePeriod].revList.reduce((s, i) => s + i.amount, 0) - m.data[activePeriod].expList.reduce((s, i) => s + i.amount, 0))} <span style={{ fontSize: "0.6em", fontWeight: 700 }}>/ bln</span></div>
                <div className="strat-revenue-period">proyeksi bersih per bulan</div>
              </div>
              <span className={`strat-pill ${m.id}`}>{activeModel === m.id ? "● Sedang Dilihat" : "Lihat Detail →"}</span>
            </div>
          ))}
        </div>

        {/* ═══ DETAIL PANEL ════════════════════════════════ */}
        <div className="panel animate-fade-in" key={activeModel}>

          {/* Panel Header */}
          <div className="panel-header">
            <h2 className="panel-title" style={{ color: model.color }}>{model.title}</h2>
            <p className="panel-desc">{model.tagline}</p>
            <div className="strategy-grid">
              {model.strategies.map((s, i) => (
                <div key={i} className="mini-strat-card" style={{ borderColor: `${model.color}30`, background: `${model.color}08` }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 4, fontSize: "0.9rem" }}>{s.t}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Aliran Pendapatan */}
          <p className="sec-tag">📈 Aliran Pendapatan Utama</p>
          <div className="stream-grid" style={{ marginBottom: "2rem" }}>
            {model.streams.map((s, i) => (
              <div key={i} className="stream-card">
                <div className="stream-name">{s.name}</div>
                <div className="stream-desc">{s.desc}</div>
                <div className={`stream-pct ${model.colorClass}`}>{s.pct}% dari total</div>
                <div className="bar-track"><div className={`bar-fill ${model.colorClass}`} style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>

          {/* Metrik Target */}
          <p className="sec-tag">🎯 Metrik Target Kunci</p>
          <div className="metrics-row" style={{ marginBottom: "2.5rem" }}>
            {model.metrics.map((m_, i) => (
              <div key={i} className="metric-tile">
                <div className="metric-tile-label">{m_.label}</div>
                <div className="metric-tile-value">{m_.value}</div>
              </div>
            ))}
          </div>

          {/* Period Tabs */}
          <p className="sec-tag">🚀 Proyeksi Keuangan per Fase</p>
          <div className="period-tabs">
            {Object.entries(periodLabels).map(([k, v]) => (
              <button key={k} id={`period-tab-${k}`} className={`period-tab ${activePeriod === k ? "active" : ""}`} onClick={() => setActivePeriod(k)}>{v}</button>
            ))}
          </div>

          {/* Status + Users */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span className={`status-badge ${badge.cls}`}>{badge.label}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
              👥 {periodData.users.toLocaleString("id-ID")} Pengguna Aktif
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>· {periodData.status}</span>
          </div>

          {/* Expenses vs Revenue */}
          <div className="grid-2">
            <div className="card-metric" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
              <div className="card-title">🧾 Rincian Pengeluaran (per bulan)</div>
              <div className="card-value loss">{formatRp(totalExp)} <span style={{ fontSize: "0.6em", opacity: 0.8 }}>/ bln</span></div>
              <p style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: 4, opacity: 0.8 }}>Estimasi pengeluaran bulanan di fase ini</p>
              <ul className="expense-list">
                {periodData.expList.map((item, idx) => (
                  <li className="expense-item" key={idx}>
                    <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: 2 }}>💸</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>{item.name}</strong>
                        <span style={{ fontWeight: 800, color: "#ef4444", fontSize: "0.85rem" }}>{formatRp(item.amount)}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-metric" style={{ borderColor: `${model.color}30` }}>
              <div className="card-title">💰 Sumber Pendapatan (per bulan)</div>
              <div className="card-value profit" style={{ color: model.colorAlt }}>{formatRp(totalRev)} <span style={{ fontSize: "0.6em", opacity: 0.8 }}>/ bln</span></div>
              <p style={{ fontSize: "0.8rem", color: model.color, marginTop: 4, opacity: 0.9 }}>Estimasi pemasukan bulanan di fase ini</p>
              <ul className="expense-list">
                {periodData.revList.map((item, idx) => (
                  <li className="expense-item" key={idx}>
                    <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: 2 }}>🎯</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>{item.name}</strong>
                        <span style={{ fontWeight: 800, color: model.color, fontSize: "0.85rem" }}>{formatRp(item.amount)}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Net Profit Banner */}
          <div className="net-banner">
            <div>
              <span className="net-label">Proyeksi Arus Kas Bersih (Net Profit)</span>
              <span className={`net-value ${netProfit >= 0 ? "profit" : "loss"}`} style={netProfit >= 0 ? { color: model.colorAlt } : {}}>
                {formatRp(netProfit)}
              </span>
            </div>
            <div className="net-divider" />
            <div>
              <span className="net-label">Total Pengguna Aktif Terakumulasi</span>
              <span className="net-users">👥 {periodData.users.toLocaleString("id-ID")} Entitas</span>
            </div>
          </div>

          {/* Roadmap */}
          <div className="sec-divider" />
          <p className="sec-tag">📈 Roadmap Monetisasi</p>
          <div className="phase-list">
            {model.phases.map((ph) => (
              <div key={ph.n} className="phase-item">
                <div className={`phase-dot ${model.colorClass}`}>{ph.n}</div>
                <div style={{ flex: 1 }}>
                  <div className="phase-title">{ph.title}</div>
                  <div className="phase-desc">{ph.desc}</div>
                </div>
                <div className="phase-time">{ph.time}</div>
              </div>
            ))}
          </div>

          {/* Analisis Risiko */}
          <p className="sec-tag">🛡️ Analisis Risiko &amp; Keunggulan</p>
          <div className="risk-row">
            <div className="risk-card">
              <div className="risk-title plus">✦ Keunggulan</div>
              {model.pros.map((p, i) => <div key={i} className="risk-item">+ {p}</div>)}
            </div>
            <div className="risk-card">
              <div className="risk-title minus">✦ Tantangan</div>
              {model.cons.map((c, i) => <div key={i} className="risk-item">– {c}</div>)}
            </div>
          </div>

          {/* Grafik */}
          <div className="recap-section">
            <h3 className="recap-heading">📊 Visualisasi Finansial Keseluruhan Timeline</h3>
            <p className="recap-sub">
              Grafik menunjukkan proyeksi Pendapatan, Pengeluaran, dan Net Profit di 4 fase pertumbuhan {model.name}.
              Perhatikan titik Break-Even dan tren kenaikan profitabilitas yang realistis.
            </p>
            <div className="chart-box"><canvas ref={chartRef} /></div>
          </div>

          {/* Comment Section */}
          {showComments && (
            <div className="comment-section" id="comment-section">
              <div className="comment-header">
                <div className="comment-header-left">
                  <span className="comment-icon">💬</span>
                  <div>
                    <h3 className="comment-title">Komentar &amp; Catatan — Model {activeModel.toUpperCase()}</h3>
                    <p className="comment-subtitle">
                      {currentUser.role === "admin"
                        ? "🛡️ Admin Mode: Melihat semua komentar dari seluruh pengguna pada model ini."
                        : `Tulis catatan, pertanyaan, atau ide terkait strategi ${model.name}.`}
                    </p>
                  </div>
                </div>
                <span className="comment-count-info">{modelComments.length} komentar</span>
              </div>
              <div className="comment-input-area">
                <div className="comment-avatar">{currentUser.emoji}</div>
                <div className="comment-input-wrap">
                  <textarea id="comment-textarea" className="comment-textarea"
                    placeholder={`Tulis komentarmu tentang ${model.name}...`}
                    value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleAddComment(); }} rows={3} />
                  <div className="comment-input-footer">
                    <span className="comment-hint">Ctrl+Enter untuk kirim</span>
                    <button id="btn-send-comment" className="comment-send-btn" onClick={handleAddComment} disabled={!commentText.trim()}>Kirim →</button>
                  </div>
                </div>
              </div>
              <div className="comment-list">
                {modelComments.length === 0 ? (
                  <div className="comment-empty">
                    <span style={{ fontSize: "2rem" }}>📝</span>
                    <p>{currentUser.role === "admin" ? "Belum ada komentar dari pengguna manapun pada model ini." : "Belum ada komentarmu. Tulis pendapat atau ideamu di atas!"}</p>
                  </div>
                ) : (
                  modelComments.map((c, i) => (
                    <div key={i} className="comment-item">
                      <div className="comment-item-avatar">{c.emoji}</div>
                      <div className="comment-item-body">
                        <div className="comment-item-meta">
                          <span className="comment-item-name">{c.display}</span>
                          {currentUser.role === "admin" && c.user !== currentUser.key && (
                            <span className="comment-item-user-tag">@{c.user}</span>
                          )}
                          <span className="comment-item-time">
                            {new Date(c.time).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="comment-item-text">{c.text}</p>
                      </div>
                      {(c.user === currentUser.key || currentUser.role === "admin") && (
                        <button className="comment-delete-btn" onClick={() => handleDeleteComment(c.key, c.idx)} title="Hapus komentar">✕</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
