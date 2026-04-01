import { useState, useEffect, useRef } from "react";

// ============================================================
// E-CycleGo — AI-Powered E-Waste Recycling for Georgia State
// Light theme · Leaf branding · Login flow
// ============================================================

const BIN_LOCATIONS = [
  { id: "student-center", name: "Student Center", building: "Student Center West", distance: "2 min walk", lat: 33.7531, lng: -84.3853, status: "proposed", votes: 187, current: 42, goal: 100, accepts: ["Batteries", "Chargers", "Old Phones"] },
  { id: "library", name: "University Library", building: "Library North", distance: "4 min walk", lat: 33.7548, lng: -84.3863, status: "proposed", votes: 143, current: 28, goal: 100, accepts: ["Batteries", "Ink Cartridges", "USB Drives"] },
  { id: "aderhold", name: "Aderhold Learning Center", building: "Aderhold Hall", distance: "5 min walk", lat: 33.7545, lng: -84.3839, status: "proposed", votes: 98, current: 15, goal: 100, accepts: ["Batteries", "Light Bulbs", "Small Electronics"] },
  { id: "langdale", name: "Langdale Hall", building: "Langdale Hall", distance: "3 min walk", lat: 33.7529, lng: -84.3856, status: "proposed", votes: 76, current: 55, goal: 100, accepts: ["Batteries", "Cables", "Old Laptops"] },
  { id: "center-parc", name: "Center Parc Stadium", building: "Center Parc Stadium", distance: "15-20 min by bus", lat: 33.7573, lng: -84.4008, status: "active", votes: null, current: 73, goal: 100, accepts: ["All E-Waste Categories"] },
];

const TIER_LEVELS = [
  { name: "Green Starter", min: 0 },
  { name: "Eco Advocate", min: 10 },
  { name: "Campus Champion", min: 30 },
  { name: "Sustainability Leader", min: 60 },
  { name: "Planet Guardian", min: 100 },
];

const MOCK_HISTORY = [
  { item: "AA Batteries (4)", date: "Mar 27", impact: "+1.2g mercury prevented", bin: "Student Center" },
  { item: "Old iPhone Charger", date: "Mar 25", impact: "+0.8m copper recovered", bin: "Library" },
  { item: "Broken Earbuds", date: "Mar 23", impact: "+2 items diverted", bin: "Student Center" },
  { item: "Printer Cartridge", date: "Mar 20", impact: "+0.5L chemicals contained", bin: "Langdale Hall" },
];

// --- Leaf Icon SVG ---
const LeafIcon = ({ size = 24, color = "#16a34a", strokeW = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.1 5.5-5 7"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const LeafFilled = ({ size = 24, color = "#16a34a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.1 5.5-5 7"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" strokeWidth="2"/>
  </svg>
);

const RecycleIcon = ({ size = 20, color = "#16a34a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16-3 3 3 3"/>
    <path d="M8.293 13.596 4.875 7.97l3.078-1.78"/>
    <path d="M15.707 13.596 19.125 7.97l-3.078-1.78"/>
    <path d="m9.5 4.5 2-3.5 2 3.5"/>
  </svg>
);

const ScanSvg = ({ color = "#002856" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
);

const MapSvg = ({ color = "#002856" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ProfileSvg = ({ color = "#002856" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EyeSvg = ({ open = true, color = "#94a3b8" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

  :root {
    --navy: #002856;
    --navy-10: rgba(0,40,86,0.1);
    --navy-06: rgba(0,40,86,0.06);
    --navy-04: rgba(0,40,86,0.04);
    --white: #ffffff;
    --bg: #f8f9fb;
    --green: #16a34a;
    --green-light: #22c55e;
    --green-bg: rgba(22,163,74,0.08);
    --green-border: rgba(22,163,74,0.2);
    --red: #dc2626;
    --red-bg: rgba(220,38,38,0.06);
    --red-border: rgba(220,38,38,0.15);
    --amber: #d97706;
    --amber-bg: rgba(217,119,6,0.08);
    --amber-border: rgba(217,119,6,0.2);
    --text: #1a1a2e;
    --text-secondary: #4a5568;
    --text-muted: #94a3b8;
    --border: #e8ecf1;
    --border-light: #f1f3f7;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg);
  }

  /* ===== LOGIN PAGE ===== */
  .login-page {
    min-height: 100vh;
    background: var(--white);
    display: flex;
    flex-direction: column;
    max-width: 430px;
    margin: 0 auto;
  }

  .login-hero {
    flex: 0 0 auto;
    padding: 60px 32px 40px;
    text-align: center;
    background: linear-gradient(170deg, var(--navy) 0%, #003d80 100%);
    color: white;
    border-radius: 0 0 32px 32px;
    position: relative;
    overflow: hidden;
  }

  .login-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%);
    border-radius: 50%;
  }

  .login-hero::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%);
    border-radius: 50%;
  }

  .login-leaf {
    width: 80px; height: 80px;
    border-radius: 24px;
    background: rgba(255,255,255,0.12);
    border: 2px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    backdrop-filter: blur(10px);
  }

  .login-title {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .login-title em {
    font-style: normal;
    color: #4ade80;
  }

  .login-badge {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    opacity: 0.5;
  }

  .login-tagline {
    margin-top: 14px;
    font-size: 15px;
    opacity: 0.75;
    line-height: 1.5;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .login-form {
    flex: 1;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
  }

  .login-tabs {
    display: flex;
    background: var(--bg);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .login-tab {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--text-muted);
  }

  .login-tab.active {
    background: var(--white);
    color: var(--navy);
    box-shadow: var(--shadow-sm);
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .form-input-wrap {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    background: var(--white);
    transition: border-color 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--navy);
    box-shadow: 0 0 0 3px rgba(0,40,86,0.08);
  }

  .form-input::placeholder {
    color: var(--text-muted);
  }

  .pw-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 14px;
    background: var(--navy);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
    box-shadow: var(--shadow-md);
  }

  .login-btn:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  .login-btn:active { transform: scale(0.98); }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .google-btn {
    width: 100%;
    padding: 14px;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    background: var(--white);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .google-btn:hover { background: var(--bg); }

  .login-footer {
    margin-top: auto;
    padding-top: 20px;
    text-align: center;
    font-size: 12px;
    color: var(--text-muted);
  }

  /* ===== HEADER ===== */
  .header {
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 50;
  }

  .logo-group { display: flex; align-items: center; gap: 10px; }

  .logo-mark {
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--navy);
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-sm);
  }

  .logo-wordmark {
    font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: 22px;
    letter-spacing: -0.5px; color: var(--navy); line-height: 1;
  }

  .logo-wordmark em { font-style: normal; color: var(--green); }

  .logo-sub {
    font-size: 9px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-muted); margin-top: 1px;
  }

  .streak-pill {
    display: flex; align-items: center; gap: 5px;
    background: var(--navy-06); border: 1px solid var(--navy-10);
    padding: 6px 12px; border-radius: 20px;
    font-size: 13px; font-weight: 700; color: var(--navy);
  }

  /* ===== GOAL BANNER ===== */
  .goal-banner {
    margin: 16px 16px 0; padding: 18px;
    background: var(--navy); border-radius: 18px;
    box-shadow: var(--shadow-lg); color: white;
  }

  .goal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }

  .goal-label {
    font-family: 'Outfit', sans-serif; font-size: 12px;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; opacity: 0.7;
  }

  .goal-nums { font-size: 13px; opacity: 0.7; }
  .goal-nums b { color: var(--green-light); opacity: 1; }

  .bar-track { height: 10px; border-radius: 10px; overflow: hidden; }
  .bar-track-light { background: rgba(0,0,0,0.15); }
  .bar-track-white { background: var(--border-light); }

  .bar-fill {
    height: 100%; border-radius: 10px;
    transition: width 1.2s cubic-bezier(.4,0,.2,1);
    position: relative;
  }

  .bar-fill::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    animation: shimmer 2.5s ease infinite;
  }

  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .goal-reward { margin-top: 10px; font-size: 12px; opacity: 0.7; }
  .goal-reward strong { color: var(--green-light); opacity: 1; }

  .page { padding: 0 16px 110px; }

  .section-label {
    font-family: 'Outfit', sans-serif; font-size: 17px;
    font-weight: 800; margin: 22px 0 12px; letter-spacing: -0.3px;
    color: var(--navy); display: flex; align-items: center; gap: 8px;
  }

  /* ===== SCAN ===== */
  .capture-zone {
    margin-top: 20px; border: 2px dashed var(--border);
    border-radius: 22px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    min-height: 260px; background: var(--white);
    cursor: pointer; transition: all 0.25s ease; overflow: hidden;
  }

  .capture-zone:hover { border-color: var(--navy-10); background: var(--navy-04); }
  .capture-zone.filled { border: 2px solid var(--green); padding: 0; }
  .capture-zone img { width: 100%; height: 260px; object-fit: cover; border-radius: 20px; }

  .capture-circle {
    width: 68px; height: 68px; border-radius: 50%;
    background: var(--navy); display: flex;
    align-items: center; justify-content: center;
    margin-bottom: 14px; box-shadow: var(--shadow-md);
  }

  .capture-title { font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; color: var(--navy); }
  .capture-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; max-width: 260px; }

  .btn {
    width: 100%; padding: 15px; border: none; border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 12px; display: flex;
    align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
  }

  .btn:active { transform: scale(0.98); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-primary { background: var(--navy); color: white; }
  .btn-primary:hover { box-shadow: var(--shadow-lg); }
  .btn-ghost { background: var(--white); color: var(--text-secondary); border: 1px solid var(--border); }

  .result-card {
    margin-top: 20px; background: var(--white); border-radius: 20px;
    border: 1px solid var(--border); overflow: hidden;
    animation: slideIn 0.4s ease-out; box-shadow: var(--shadow-md);
  }

  @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .result-top { padding: 20px 18px 16px; display: flex; align-items: flex-start; gap: 14px; }

  .result-icon-box {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; flex-shrink: 0;
  }

  .result-icon-ewaste { background: var(--red-bg); border: 1px solid var(--red-border); color: var(--red); }
  .result-icon-ok { background: var(--green-bg); border: 1px solid var(--green-border); color: var(--green); }

  .result-name { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: var(--navy); }

  .result-tag {
    display: inline-block; padding: 3px 9px; border-radius: 6px;
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.8px; margin-top: 6px;
  }

  .tag-ewaste { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .tag-ok { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }

  .result-sections { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 12px; }
  .r-section { padding: 14px; background: var(--bg); border-radius: 14px; }
  .r-section-head { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); margin-bottom: 6px; }
  .r-section-body { font-size: 14px; line-height: 1.6; color: var(--text-secondary); }
  .r-section-danger { background: var(--red-bg); }
  .r-section-danger .r-section-head { color: var(--red); }
  .r-section-danger .r-section-body { color: var(--red); }

  .impact-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .impact-box { padding: 14px 10px; background: var(--bg); border-radius: 14px; text-align: center; }
  .impact-val { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: var(--green); }
  .impact-lbl { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .nearest-strip {
    margin: 0 18px 18px; padding: 14px;
    background: var(--green-bg); border-radius: 14px;
    border: 1px solid var(--green-border);
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: background 0.2s;
  }

  .nearest-strip:hover { background: rgba(22,163,74,0.12); }
  .nearest-pin { width: 40px; height: 40px; border-radius: 12px; background: var(--green); display: flex; align-items: center; justify-content: center; color: white; }
  .nearest-info { flex: 1; }
  .nearest-name { font-weight: 700; font-size: 14px; color: var(--navy); }
  .nearest-meta { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .nearest-go { font-size: 18px; color: var(--green); font-weight: 700; }

  /* ===== MAP ===== */
  .map-frame { margin-top: 16px; border-radius: 18px; overflow: hidden; border: 1px solid var(--border); height: 260px; background: var(--white); }
  .legend-row { display: flex; gap: 8px; margin: 12px 0 4px; }
  .legend-chip { padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .legend-active { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .legend-proposed { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }

  .bins-list { display: flex; flex-direction: column; gap: 10px; }

  .bin-card {
    padding: 16px; background: var(--white); border-radius: 16px;
    border: 1px solid var(--border); box-shadow: var(--shadow-sm);
    transition: all 0.2s; cursor: pointer;
  }

  .bin-card:hover { box-shadow: var(--shadow-md); }
  .bin-card.selected { border-color: var(--green); box-shadow: 0 0 0 1px var(--green), var(--shadow-md); }

  .bin-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .bin-name { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; color: var(--navy); }
  .bin-building { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .bin-distance { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .chip { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  .chip-active { background: var(--green-bg); color: var(--green); }
  .chip-proposed { background: var(--amber-bg); color: var(--amber); }

  .bin-progress-area { margin: 12px 0 8px; }
  .bin-bar-header { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
  .bin-bar-label { color: var(--text-muted); }
  .bin-bar-val { color: var(--green); font-weight: 700; }
  .bin-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
  .bin-tag-item { padding: 4px 8px; background: var(--bg); border-radius: 6px; font-size: 11px; color: var(--text-muted); }

  .vote-button {
    margin-top: 10px; padding: 9px 16px; background: transparent;
    border: 1.5px solid var(--border); color: var(--text-secondary);
    border-radius: 10px; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .vote-button:hover { border-color: var(--navy); color: var(--navy); }
  .vote-button.voted { border-color: var(--green); color: var(--green); background: var(--green-bg); }

  /* ===== PROFILE ===== */
  .profile-hero {
    margin-top: 16px; padding: 28px 20px;
    background: var(--navy); border-radius: 22px;
    text-align: center; box-shadow: var(--shadow-lg);
    color: white; position: relative; overflow: hidden;
  }

  .profile-hero::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%);
    border-radius: 50%;
  }

  .avatar-ring {
    width: 84px; height: 84px; border-radius: 50%;
    background: rgba(255,255,255,0.12); border: 3px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }

  .profile-name { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }

  .tier-badge {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 8px; padding: 5px 14px; border-radius: 20px;
    font-size: 13px; font-weight: 700;
    background: rgba(34,197,94,0.15); color: #4ade80;
    border: 1px solid rgba(34,197,94,0.25);
  }

  .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 22px; }
  .stat-cell { padding: 14px 8px; background: rgba(255,255,255,0.08); border-radius: 14px; }
  .stat-num { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; }
  .stat-txt { font-size: 11px; opacity: 0.6; margin-top: 2px; }

  .tier-track { margin-top: 18px; padding: 16px; background: rgba(255,255,255,0.06); border-radius: 14px; }
  .tier-track-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; }
  .tier-track-current { font-weight: 700; color: #4ade80; }
  .tier-track-next { opacity: 0.6; }

  .impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .impact-tile {
    padding: 16px 12px; background: var(--white); border-radius: 14px;
    border: 1px solid var(--border); text-align: center; box-shadow: var(--shadow-sm);
  }

  .impact-tile-val { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: var(--green); }
  .impact-tile-lbl { font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.3; }

  .history-card {
    display: flex; align-items: center; gap: 12px; padding: 14px;
    background: var(--white); border-radius: 14px;
    border: 1px solid var(--border); margin-bottom: 8px; box-shadow: var(--shadow-sm);
  }

  .history-circle {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--green-bg); display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }

  .history-main { flex: 1; }
  .history-title { font-weight: 700; font-size: 14px; color: var(--navy); }
  .history-details { display: flex; gap: 6px; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .history-pts { font-size: 12px; font-weight: 700; color: var(--green); white-space: nowrap; }

  .nav-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px; background: var(--white);
    border-top: 1px solid var(--border); display: flex;
    justify-content: space-around; padding: 8px 0;
    padding-bottom: max(10px, env(safe-area-inset-bottom)); z-index: 100;
  }

  .nav-tab {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 6px 20px; background: none; border: none;
    color: var(--text-muted); cursor: pointer; transition: color 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif; position: relative;
  }

  .nav-tab.on { color: var(--navy); }

  .nav-tab.on::before {
    content: ''; position: absolute; top: -8px;
    left: 50%; transform: translateX(-50%);
    width: 24px; height: 3px; background: var(--navy); border-radius: 2px;
  }

  .nav-tab-icon { height: 22px; display: flex; align-items: center; }
  .nav-tab-text { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }

  /* ===== GUILT TRIP ===== */
  .guilt-trip {
    margin: 0 18px 14px;
    padding: 18px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border-radius: 16px;
    text-align: center;
    animation: guiltFadeIn 0.6s ease-out;
    position: relative;
    overflow: hidden;
  }

  .guilt-trip::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px
    );
  }

  .guilt-skull { font-size: 32px; margin-bottom: 8px; }

  .guilt-year {
    font-family: 'Outfit', sans-serif;
    font-size: 48px;
    font-weight: 800;
    color: #ff6b6b;
    letter-spacing: -2px;
    animation: guiltPulse 2s ease-in-out infinite;
  }

  .guilt-text {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    margin-top: 6px;
    line-height: 1.5;
  }

  .guilt-text strong {
    color: #ff6b6b;
  }

  .guilt-subtext {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 10px;
    font-style: italic;
  }

  @keyframes guiltPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.03); }
  }

  @keyframes guiltFadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ===== TRASH TALK ===== */
  .trash-talk {
    margin: 0 18px 14px;
    padding: 14px 16px;
    background: var(--navy);
    border-radius: 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: slideIn 0.5s ease-out 0.3s both;
  }

  .trash-talk-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .trash-talk-bubble {
    font-size: 13px;
    color: rgba(255,255,255,0.85);
    line-height: 1.5;
    font-style: italic;
  }

  .trash-talk-label {
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.3);
    margin-top: 6px;
  }

  .loader {
    width: 22px; height: 22px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .hide { display: none; }
`;

// ===== TRASH TALK LINES =====
const TRASH_TALK = {
  "e-waste": [
    "You were really about to throw this in the regular trash? In 2026? Bold move.",
    "This has more toxic chemicals than your ex's personality. Please recycle it.",
    "Fun fact: this will outlive you, your kids, AND their kids. Bin it properly.",
    "The landfill called. They said they're full and they don't want your problems.",
    "Even your groupchat has better disposal habits than this. Come on now.",
  ],
  "recyclable": [
    "You needed AI to tell you this is recyclable? Your 3rd grade teacher is crying.",
    "Congrats, you've identified something a raccoon could've figured out.",
    "Breaking news: student discovers recycling exists. More at 11.",
    "This is literally the tutorial level of recycling. You got this.",
  ],
  "compost": [
    "It's organic waste. You know... it goes back to the earth? Circle of life?",
    "Hakuna Matata this into a compost bin, Simba.",
    "Mother Nature would like a word about why this was heading to the trash.",
  ],
  "landfill": [
    "Okay this one actually goes in the trash. Even a broken clock is right twice a day.",
    "Finally, something that belongs in the garbage. Unlike your recycling habits.",
    "Trash! For once, the regular bin is the right answer. Mark the calendar.",
  ],
};

const getTrashTalk = (category) => {
  const lines = TRASH_TALK[category] || TRASH_TALK["e-waste"];
  return lines[Math.floor(Math.random() * lines.length)];
};

// ===== GUILT TRIP =====
const GUILT_DATA = {
  battery: { years: 100, year: 2126, emoji: "🪫", drama: "This battery will still be leaking acid into the ground when your great-great-grandchildren are alive." },
  charger: { years: 450, year: 2476, emoji: "🔌", drama: "This charger's plastic will still exist when humanity is probably living on Mars." },
  phone: { years: 1000, year: 3026, emoji: "📱", drama: "This phone will outlast most civilizations. The Roman Empire lasted 500 years. This phone? Double that." },
  electronics: { years: 500, year: 2526, emoji: "💻", drama: "500 years from now, archaeologists will dig this up and judge your entire generation." },
  default: { years: 200, year: 2226, emoji: "☠️", drama: "This will be sitting in a landfill while your descendants are wondering why the ocean tastes like mercury." },
};

const getGuiltData = (itemName) => {
  const name = (itemName || "").toLowerCase();
  if (name.includes("batter")) return GUILT_DATA.battery;
  if (name.includes("charg") || name.includes("cable") || name.includes("cord")) return GUILT_DATA.charger;
  if (name.includes("phone") || name.includes("iphone") || name.includes("android")) return GUILT_DATA.phone;
  if (name.includes("laptop") || name.includes("computer") || name.includes("keyboard")) return GUILT_DATA.electronics;
  return GUILT_DATA.default;
};

function GuiltTrip({ itemName }) {
  const guilt = getGuiltData(itemName);
  return (
    <div className="guilt-trip">
      <div className="guilt-skull">{guilt.emoji}</div>
      <div className="guilt-year">{guilt.year}</div>
      <div className="guilt-text">
        That's when this finally decomposes. <strong>{guilt.years} years</strong> from now.
      </div>
      <div className="guilt-subtext">{guilt.drama}</div>
    </div>
  );
}

// ===== COMPONENTS =====

function Bar({ value, max, color = "var(--green)", h = 10, variant = "white" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`bar-track ${variant === "dark" ? "bar-track-light" : "bar-track-white"}`} style={{ height: h }}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, #4ade80)` }} />
    </div>
  );
}

// ===== LOGIN PAGE =====
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(name || email.split("@")[0] || "GSU Panther");
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-leaf">
          <LeafFilled size={40} color="#4ade80" />
        </div>
        <div className="login-title">E-Cycle<em>Go</em></div>
        <div className="login-badge">Georgia State University</div>
        <div className="login-tagline">Scan, recycle, and track your impact. Making e-waste disposal easy for every Panther.</div>
      </div>

      <div className="login-form">
        <div className="login-tabs">
          <button className={`login-tab ${tab === "signin" ? "active" : ""}`} onClick={() => setTab("signin")}>Sign In</button>
          <button className={`login-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">GSU Email</label>
            <input className="form-input" type="email" placeholder="panther@student.gsu.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <input
                className="form-input"
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 48 }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                <EyeSvg open={showPw} />
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="login-divider">or continue with</div>

        <button className="google-btn" onClick={() => onLogin("GSU Panther")}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}

// ===== MAIN APP PAGES =====

function GoalBanner() {
  const cur = BIN_LOCATIONS.reduce((s, b) => s + b.current, 0);
  const total = BIN_LOCATIONS.reduce((s, b) => s + b.goal, 0);
  return (
    <div className="goal-banner">
      <div className="goal-top">
        <span className="goal-label">Campus Goal · March</span>
        <span className="goal-nums"><b>{cur}</b> / {total} items</span>
      </div>
      <Bar value={cur} max={total} variant="dark" />
      <div className="goal-reward">Hit <strong>{total} items</strong> this month — all E-CycleGo users earn a bookstore reward</div>
    </div>
  );
}

function ScanPage({ goTo }) {
  const [img, setImg] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setResult(null);
    setImg(URL.createObjectURL(f));
    const r = new FileReader();
    r.onload = () => setImgData({ b64: r.result.split(",")[1], type: f.type });
    r.readAsDataURL(f);
  };

  const scan = async () => {
    if (!imgData) return;
    setBusy(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imgData.b64, mediaType: imgData.type }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      console.error("Scan failed:", err);
      setResult({
        itemName: "Item Detected", category: "e-waste", isEwaste: true,
        disposal: "Take to a designated e-waste bin. Do not place in regular trash or recycling.",
        whyMatters: "Contains toxic materials that contaminate soil and groundwater when sent to landfill.",
        hazard: "Can cause chemical fires or leak heavy metals into the environment.",
        stat1: { value: "100 yrs", label: "to decompose" }, stat2: { value: "0.3g", label: "toxins prevented" },
        binType: "E-Waste Collection",
      });
    }
    setBusy(false);
  };

  const reset = () => { setImg(null); setImgData(null); setResult(null); };

  return (
    <div className="page">
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hide" onChange={onFile} />
      <div className={`capture-zone ${img ? "filled" : ""}`} onClick={!img ? () => inputRef.current?.click() : undefined}>
        {img ? <img src={img} alt="Scanned" /> : (
          <>
            <div className="capture-circle"><ScanSvg color="#ffffff" /></div>
            <div className="capture-title">Tap to Scan an Item</div>
            <div className="capture-sub">Photograph batteries, electronics, chargers — anything you're unsure how to dispose of</div>
          </>
        )}
      </div>
      {img && !result && (
        <button className="btn btn-primary" onClick={scan} disabled={busy}>
          {busy ? <><div className="loader" /> Analyzing...</> : "Identify & Get Disposal Info"}
        </button>
      )}
      {img && <button className="btn btn-ghost" onClick={reset}>Scan Different Item</button>}
      {result && (
        <div className="result-card">
          <div className="result-top">
            <div className={`result-icon-box ${result.isEwaste ? "result-icon-ewaste" : "result-icon-ok"}`}>
              {result.isEwaste ? "E-W" : <RecycleIcon size={22} />}
            </div>
            <div>
              <div className="result-name">{result.itemName}</div>
              <span className={`result-tag ${result.isEwaste ? "tag-ewaste" : "tag-ok"}`}>
                {result.isEwaste ? "E-Waste" : result.category}
              </span>
            </div>
          </div>
          <div className="result-sections">
            <div className="r-section"><div className="r-section-head">How to Dispose</div><div className="r-section-body">{result.disposal}</div></div>
            <div className="r-section"><div className="r-section-head">Why It Matters</div><div className="r-section-body">{result.whyMatters}</div></div>
            <div className="r-section r-section-danger"><div className="r-section-head">If Thrown in Regular Trash</div><div className="r-section-body">{result.hazard}</div></div>
            <div className="impact-row">
              <div className="impact-box"><div className="impact-val">{result.stat1?.value}</div><div className="impact-lbl">{result.stat1?.label}</div></div>
              <div className="impact-box"><div className="impact-val">{result.stat2?.value}</div><div className="impact-lbl">{result.stat2?.label}</div></div>
            </div>
          </div>
          {result.isEwaste && <GuiltTrip itemName={result.itemName} />}
          <div className="trash-talk">
            <div className="trash-talk-avatar">🤖</div>
            <div>
              <div className="trash-talk-bubble">{getTrashTalk(result.category)}</div>
              <div className="trash-talk-label">E-CycleGo Trash Talk</div>
            </div>
          </div>
          <div className="nearest-strip" onClick={() => goTo("map")}>
            <div className="nearest-pin"><MapSvg color="#ffffff" /></div>
            <div className="nearest-info"><div className="nearest-name">Student Center Bin</div><div className="nearest-meta">Nearest · 2 min walk · {result.binType}</div></div>
            <div className="nearest-go">&rarr;</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FallbackMap({ selectedBin, onSelectBin }) {
  const canvasRef = useRef(null);
  const GSU = { minLat: 33.750, maxLat: 33.760, minLng: -84.405, maxLng: -84.380 };
  const toXY = (lat, lng, w, h) => ({ x: ((lng - GSU.minLng) / (GSU.maxLng - GSU.minLng)) * w, y: ((GSU.maxLat - lat) / (GSU.maxLat - GSU.minLat)) * h });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width = c.offsetWidth * 2;
    const h = c.height = c.offsetHeight * 2;

    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(0,40,86,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    BIN_LOCATIONS.forEach((bin) => {
      const { x, y } = toXY(bin.lat, bin.lng, w, h);
      const active = bin.status === "active";
      const sel = bin.id === selectedBin;

      if (sel) { ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fillStyle = active ? "rgba(22,163,74,0.12)" : "rgba(217,119,6,0.12)"; ctx.fill(); }

      ctx.beginPath(); ctx.arc(x, y, sel ? 18 : 14, 0, Math.PI * 2);
      ctx.fillStyle = active ? "#16a34a" : "#d97706"; ctx.fill();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.stroke();

      ctx.font = `${sel ? "bold 22px" : "20px"} 'Outfit', sans-serif`;
      ctx.fillStyle = "#002856"; ctx.textAlign = "center";
      ctx.fillText(bin.name.split(" ")[0], x, y + (sel ? 18 : 14) + 24);
    });

    ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.fillStyle = "rgba(0,40,86,0.12)"; ctx.textAlign = "left";
    ctx.fillText("GSU Campus", 20, 36);
  }, [selectedBin]);

  const handleClick = (e) => {
    const c = canvasRef.current; const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width; const sy = c.height / rect.height;
    const cx = (e.clientX - rect.left) * sx; const cy = (e.clientY - rect.top) * sy;
    for (const bin of BIN_LOCATIONS) {
      const { x, y } = toXY(bin.lat, bin.lng, c.width, c.height);
      if (Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) < 30) { onSelectBin(bin.id); return; }
    }
  };

  return <canvas ref={canvasRef} className="map-frame" style={{ cursor: "pointer", width: "100%" }} onClick={handleClick} />;
}

function GoogleMap() {
  const key = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  const markers = BIN_LOCATIONS.map((b) => {
    const color = b.status === "active" ? "green" : "orange";
    const label = b.name[0];
    return `markers=color:${color}|label:${label}|${b.lat},${b.lng}`;
  }).join("&");
  const src = `https://maps.googleapis.com/maps/api/staticmap?center=33.754,-84.392&zoom=15&size=800x520&scale=2&maptype=roadmap&${markers}&key=${key}`;

  return (
    <div className="map-frame" style={{ minHeight: 260, overflow: "hidden" }}>
      <img
        src={src}
        alt="GSU Campus Map"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }}
      />
    </div>
  );
}

function MapPage() {
  const [votes, setVotes] = useState({});
  const [sel, setSel] = useState(null);
  const hasKey = !!(process.env.REACT_APP_GOOGLE_MAPS_KEY);


  return (
    <div className="page">
      <div className="section-label"><RecycleIcon size={20} /> E-Waste Bins on Campus</div>
      {hasKey ? <GoogleMap /> : <FallbackMap selectedBin={sel} onSelectBin={setSel} />}
      <div className="legend-row"><span className="legend-chip legend-active">Active</span><span className="legend-chip legend-proposed">Proposed</span></div>
      <div className="section-label">Bin Locations & Progress</div>
      <div className="bins-list">
        {BIN_LOCATIONS.map((b) => (
          <div key={b.id} className={`bin-card ${sel === b.id ? "selected" : ""}`} onClick={() => setSel(b.id)}>
            <div className="bin-top">
              <div><div className="bin-name">{b.name}</div><div className="bin-building">{b.building}</div><div className="bin-distance">{b.distance}</div></div>
              <span className={`chip ${b.status === "active" ? "chip-active" : "chip-proposed"}`}>{b.status === "active" ? "Active" : "Proposed"}</span>
            </div>
            <div className="bin-progress-area">
              <div className="bin-bar-header"><span className="bin-bar-label">Monthly Goal</span><span className="bin-bar-val">{b.current}/{b.goal}</span></div>
              <Bar value={b.current} max={b.goal} h={8} />
            </div>
            <div className="bin-tags">{b.accepts.map((a) => <span key={a} className="bin-tag-item">{a}</span>)}</div>
            {b.status === "proposed" && (
              <button className={`vote-button ${votes[b.id] ? "voted" : ""}`} onClick={(e) => { e.stopPropagation(); setVotes((v) => ({ ...v, [b.id]: !v[b.id] })); }}>
                {votes[b.id] ? "Voted" : "Upvote this location"} · {b.votes + (votes[b.id] ? 1 : 0)} students
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ userName }) {
  const items = 24;
  const tier = TIER_LEVELS[1];
  const next = TIER_LEVELS[2];
  const pct = ((items - tier.min) / (next.min - tier.min)) * 100;

  return (
    <div className="page">
      <div className="profile-hero">
        <div className="avatar-ring"><LeafFilled size={40} color="#4ade80" /></div>
        <div className="profile-name">{userName}</div>
        <div className="tier-badge">{tier.name}</div>
        <div className="stats-row">
          <div className="stat-cell"><div className="stat-num">24</div><div className="stat-txt">Items Recycled</div></div>
          <div className="stat-cell"><div className="stat-num">7 🔥</div><div className="stat-txt">Day Streak</div></div>
          <div className="stat-cell"><div className="stat-num">3.2kg</div><div className="stat-txt">E-Waste Diverted</div></div>
        </div>
        <div className="tier-track">
          <div className="tier-track-top"><span className="tier-track-current">{tier.name}</span><span className="tier-track-next">{next.min - items} more → {next.name}</span></div>
          <Bar value={pct} max={100} h={8} variant="dark" />
        </div>
      </div>

      <div className="section-label">Your Environmental Impact</div>
      <div className="impact-grid">
        <div className="impact-tile"><div className="impact-tile-val">7.2g</div><div className="impact-tile-lbl">Mercury kept from groundwater</div></div>
        <div className="impact-tile"><div className="impact-tile-val">~2,400 yr</div><div className="impact-tile-lbl">Decomposition time saved</div></div>
        <div className="impact-tile"><div className="impact-tile-val">1.8kg</div><div className="impact-tile-lbl">CO₂ equivalent reduced</div></div>
        <div className="impact-tile"><div className="impact-tile-val">12</div><div className="impact-tile-lbl">Landfill fire risks prevented</div></div>
      </div>

      <div className="section-label">Recent Activity</div>
      {MOCK_HISTORY.map((h, i) => (
        <div key={i} className="history-card">
          <div className="history-circle"><RecycleIcon size={20} color="var(--green)" /></div>
          <div className="history-main"><div className="history-title">{h.item}</div><div className="history-details"><span>{h.date}</span><span>·</span><span>{h.bin}</span></div></div>
          <div className="history-pts">{h.impact}</div>
        </div>
      ))}
    </div>
  );
}

// ===== APP =====
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("GSU Panther");
  const [page, setPage] = useState("scan");

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    setLoggedIn(true);
  };

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  const tabs = [
    { id: "scan", text: "Scan", Icon: ScanSvg },
    { id: "map", text: "Map", Icon: MapSvg },
    { id: "profile", text: "Profile", Icon: ProfileSvg },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="logo-group">
          <div className="logo-mark"><LeafFilled size={24} color="#4ade80" /></div>
          <div>
            <div className="logo-wordmark">E-Cycle<em>Go</em></div>
            <div className="logo-sub">Georgia State University</div>
          </div>
        </div>
        <div className="streak-pill">🔥 7 days</div>
      </header>
      <GoalBanner />
      {page === "scan" && <ScanPage goTo={setPage} />}
      {page === "map" && <MapPage />}
      {page === "profile" && <ProfilePage userName={userName} />}
      <nav className="nav-bar">
        {tabs.map((t) => (
          <button key={t.id} className={`nav-tab ${page === t.id ? "on" : ""}`} onClick={() => setPage(t.id)}>
            <span className="nav-tab-icon"><t.Icon color={page === t.id ? "#002856" : "#94a3b8"} /></span>
            <span className="nav-tab-text">{t.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
