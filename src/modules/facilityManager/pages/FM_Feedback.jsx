import { useState, useMemo } from "react";
import {
  FiStar, FiMessageSquare, FiSearch, FiThermometer,
  FiWind, FiSun, FiVolume2, FiCheckSquare, FiSettings,
  FiChevronDown, FiUsers, FiMapPin, FiTag, FiBookmark,
  FiTrendingUp, FiTrendingDown, FiMinus, FiFilter,
  FiSend, FiCheckCircle, FiUser, FiCalendar, FiClock,
  FiArrowRight, FiAlertCircle, FiBarChart2, FiInbox,
} from "react-icons/fi";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fb-root {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
  }

  /* ─── Role switcher (demo) ─── */
  .fb-role-bar {
    background: linear-gradient(135deg, #002857, #001530);
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .fb-role-label {
    font-size: 10px;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,.4);
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    margin-right: 6px;
  }
  .fb-role-btn {
    padding: 5px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,.15);
    background: transparent;
    color: rgba(255,255,255,.5);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .18s;
  }
  .fb-role-btn.active {
    background: rgba(0,178,255,.2);
    border-color: rgba(0,178,255,.4);
    color: #fff;
  }

  /* ─── Page shell ─── */
  .fb-page { padding: 28px 24px; }

  .fb-eyebrow {
    font-size: 10px;
    letter-spacing: 2px;
    color: #94a3b8;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 6px;
  }
  .fb-page-title {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .fb-title-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }

  /* ─── FM REPORT VIEW ─────────────────────────── */

  .fm-tabs {
    display: flex;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
    width: fit-content;
    margin-bottom: 24px;
  }
  .fm-tab {
    padding: 8px 20px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all .18s;
    color: #64748b;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .fm-tab.on {
    background: #fff;
    color: #002857;
    box-shadow: 0 1px 4px rgba(0,0,0,.1);
  }

  /* Stats row */
  .fm-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  @media (max-width: 700px) { .fm-stats { grid-template-columns: repeat(2,1fr); } }

  .fm-stat {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 1px 3px rgba(0,0,0,.05);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .fm-stat-val { font-size: 26px; font-weight: 800; font-family: 'JetBrains Mono', monospace; line-height: 1; }
  .fm-stat-lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }
  .fm-stat-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 6px;
  }

  /* Controls */
  .fm-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    align-items: center;
  }
  .fm-search-wrap { position: relative; flex: 1 1 200px; }
  .fm-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
  .fm-search {
    width: 100%;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 9px 12px 9px 32px;
    font-size: 13px; color: #0f172a; outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color .15s;
  }
  .fm-search:focus { border-color: #00b2ff; box-shadow: 0 0 0 3px rgba(0,178,255,.1); }
  .fm-select {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 9px 10px; font-size: 12px; color: #475569; outline: none;
    cursor: pointer; font-family: 'JetBrains Mono', monospace;
  }
  .fm-count { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-bottom: 14px; }

  /* Room report card */
  .fm-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
    transition: box-shadow .2s;
    cursor: pointer;
  }
  .fm-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.09); }
  .fm-card.open  { box-shadow: 0 6px 28px rgba(0,40,87,.12); border-color: rgba(0,100,200,.2); }

  .fm-card-head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
    padding: 18px 20px;
  }

  .fm-room-name { font-weight: 800; font-size: 16px; color: #0f172a; margin-bottom: 7px; letter-spacing: -.3px; }

  .fm-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 8px; }
  .fm-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: 5px; white-space: nowrap;
  }
  .fm-meta-row {
    display: flex; align-items: center; gap: 14px;
    font-size: 11px; color: #94a3b8;
  }

  /* Overall score display */
  .fm-score-block {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .fm-score-big {
    font-size: 36px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }
  .fm-score-denom { font-size: 14px; color: #94a3b8; font-weight: 400; }
  .fm-stars-row { display: flex; gap: 3px; }
  .fm-quality-badge {
    font-size: 10px; font-weight: 700; letter-spacing: .8px;
    padding: 3px 10px; border-radius: 5px;
    font-family: 'JetBrains Mono', monospace;
  }
  .fm-trend {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 700;
  }

  /* Chevron */
  .fm-chevron { color: #cbd5e1; transition: transform .22s; flex-shrink: 0; }
  .fm-card.open .fm-chevron { transform: rotate(180deg); }

  /* ─── Expanded breakdown ─── */
  .fm-expand {
    border-top: 1px solid #f1f5f9;
    padding: 20px;
    animation: expandDown .22s ease;
  }
  @keyframes expandDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }

  .fm-section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
    color: #94a3b8; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 12px; margin-top: 20px;
  }
  .fm-section-label:first-child { margin-top: 0; }

  /* Category grid */
  .fm-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 4px;
  }
  .fm-cat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    transition: border-color .15s, box-shadow .15s;
  }
  .fm-cat-card:hover { border-color: #00b2ff; box-shadow: 0 0 0 3px rgba(0,178,255,.07); }
  .fm-cat-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .fm-cat-name {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 700;
  }
  .fm-cat-score {
    font-size: 16px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }
  .fm-cat-bar-track {
    height: 5px; border-radius: 99px;
    background: #e2e8f0; overflow: hidden; margin-bottom: 7px;
  }
  .fm-cat-bar-fill { height: 100%; border-radius: 99px; transition: width .7s ease; }
  .fm-cat-stars { display: flex; gap: 3px; margin-bottom: 6px; }
  .fm-cat-count { font-size: 10px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; }

  /* Distribution bar */
  .fm-dist { display: flex; gap: 3px; height: 28px; border-radius: 6px; overflow: hidden; margin-top: 6px; }
  .fm-dist-seg {
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff;
    font-family: 'JetBrains Mono', monospace;
    transition: flex .5s ease;
    min-width: 0;
  }

  /* Individual feedback list */
  .fm-fb-list { display: flex; flex-direction: column; gap: 8px; }
  .fm-fb-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: start;
  }
  .fm-fb-avatar {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #002857, #0064c8);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .fm-fb-name    { font-size: 13px; font-weight: 700; color: #0f172a; }
  .fm-fb-meta    { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .fm-fb-comment { font-size: 12px; color: #475569; line-height: 1.55; margin-top: 6px; }
  .fm-fb-cats    { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
  .fm-fb-cat-tag {
    display: flex; align-items: center; gap: 4px;
    font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600;
  }

  /* Raw responses tab */
  .fm-raw-item {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 8px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 14px;
    align-items: start;
    box-shadow: 0 1px 3px rgba(0,0,0,.05);
  }

  /* ─── USER SUBMIT VIEW ───────────────────────── */

  .uf-container {
    max-width: 640px;
    margin: 0 auto;
  }

  .uf-step-bar {
    display: flex;
    gap: 0;
    margin-bottom: 28px;
    position: relative;
  }
  .uf-step-bar::before {
    content: '';
    position: absolute;
    top: 14px; left: 14px; right: 14px;
    height: 2px;
    background: #e2e8f0;
    z-index: 0;
  }
  .uf-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
  }
  .uf-step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    transition: all .25s;
  }
  .uf-step-dot.done { background: linear-gradient(135deg,#00b2ff,#0064c8); color: #fff; box-shadow: 0 3px 10px rgba(0,178,255,.35); }
  .uf-step-dot.curr { background: #fff; color: #002857; border: 2px solid #00b2ff; box-shadow: 0 3px 10px rgba(0,178,255,.2); }
  .uf-step-dot.todo { background: #f1f5f9; color: #94a3b8; border: 2px solid #e2e8f0; }
  .uf-step-lbl { font-size: 10px; color: #94a3b8; font-weight: 500; white-space: nowrap; text-align: center; }
  .uf-step-lbl.curr { color: #002857; font-weight: 700; }

  /* Cards */
  .uf-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .uf-card-title {
    font-size: 14px; font-weight: 800; color: #0f172a;
    margin-bottom: 4px; letter-spacing: -.2px;
  }
  .uf-card-sub {
    font-size: 12px; color: #94a3b8; margin-bottom: 18px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Meeting selector */
  .uf-meeting-list { display: flex; flex-direction: column; gap: 8px; }
  .uf-meeting-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }
  .uf-meeting-item:hover { border-color: #00b2ff; background: #f0f9ff; }
  .uf-meeting-item.selected { border-color: #00b2ff; background: #f0f9ff; box-shadow: 0 0 0 3px rgba(0,178,255,.12); }
  .uf-meeting-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #002857, #0064c8);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  .uf-meeting-name { font-weight: 700; font-size: 13px; color: #0f172a; }
  .uf-meeting-meta { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-top: 3px; }
  .uf-meeting-check {
    width: 20px; height: 20px; border-radius: 50%;
    background: linear-gradient(135deg,#00b2ff,#0064c8);
    display: flex; align-items: center; justify-content: center;
    color: #fff; margin-left: auto; flex-shrink: 0;
    opacity: 0; transition: opacity .18s;
  }
  .uf-meeting-item.selected .uf-meeting-check { opacity: 1; }

  /* Overall stars */
  .uf-overall-stars {
    display: flex; gap: 10px; justify-content: center;
    padding: 10px 0;
  }
  .uf-overall-label {
    text-align: center;
    font-size: 13px; color: #475569; margin-top: 10px;
    font-weight: 500;
    min-height: 20px;
  }

  /* Category rating grid */
  .uf-cat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 480px) { .uf-cat-grid { grid-template-columns: 1fr; } }

  .uf-cat-item {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    transition: border-color .15s, box-shadow .15s;
  }
  .uf-cat-item:focus-within { border-color: #00b2ff; box-shadow: 0 0 0 3px rgba(0,178,255,.1); }
  .uf-cat-item-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 10px;
  }
  .uf-cat-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .uf-cat-label { font-size: 12px; font-weight: 700; color: #334155; }
  .uf-cat-desc  { font-size: 10px; color: #94a3b8; margin-top: 2px; }
  .uf-cat-stars { display: flex; gap: 4px; }

  /* Comment */
  .uf-textarea {
    width: 100%;
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
    padding: 12px 14px; font-size: 13px; color: #0f172a; outline: none;
    resize: none; font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.55;
    transition: border-color .15s;
  }
  .uf-textarea:focus { border-color: #00b2ff; box-shadow: 0 0 0 3px rgba(0,178,255,.1); background: #fff; }

  /* Nav buttons */
  .uf-nav { display: flex; justify-content: space-between; margin-top: 4px; }
  .uf-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px; border-radius: 9px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: opacity .15s, transform .15s;
    border: 1px solid transparent;
  }
  .uf-btn:hover { opacity: .88; transform: translateY(-1px); }
  .uf-btn:disabled { opacity: .35; cursor: default; transform: none; }
  .uf-btn-primary { background: linear-gradient(135deg,#00b2ff,#0064c8); color: #fff; box-shadow: 0 4px 14px rgba(0,178,255,.35); }
  .uf-btn-ghost   { background: transparent; border-color: #e2e8f0; color: #64748b; }

  /* Success screen */
  .uf-success {
    text-align: center;
    padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .uf-success-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg,#d1fae5,#a7f3d0);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #16a34a;
  }
  .uf-success-title { font-size: 20px; font-weight: 800; color: #0f172a; }
  .uf-success-sub   { font-size: 13px; color: #64748b; line-height: 1.55; max-width: 320px; }
  .uf-success-again {
    margin-top: 8px;
    font-size: 13px; font-weight: 600;
    color: #00b2ff; cursor: pointer; text-decoration: underline;
    background: none; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MY_MEETINGS = [
  { id:"M-2401", room:"Boardroom A",    site:"Leoni Mateur",      date:"25 Jan 2024", time:"10:00–11:30", dept:"Management"  },
  { id:"M-2398", room:"Meeting Room 3", site:"Leoni Sousse",      date:"25 Jan 2024", time:"09:00–10:00", dept:"Engineering" },
  { id:"M-2391", room:"Executive Suite",site:"Leoni Bir Mcherga", date:"24 Jan 2024", time:"14:00–15:00", dept:"Executive"   },
  { id:"M-2385", room:"Innovation Lab", site:"Leoni Mateur",      date:"24 Jan 2024", time:"11:00–12:00", dept:"R&D"         },
];

const ROOM_REPORTS = [
  {
    id:1, room:"Boardroom A", floor:"Floor 2", dept:"Management", site:"Leoni Mateur",
    overall:3.8, count:12, trend:"up",
    cats:{
      temperature:{ score:3.2, count:11, dist:[1,2,3,3,2] },
      co2:        { score:3.6, count:10, dist:[0,2,3,3,2] },
      lighting:   { score:4.5, count:12, dist:[0,0,2,3,7] },
      noise:      { score:4.0, count:9,  dist:[0,1,2,4,2] },
      cleanliness:{ score:4.2, count:12, dist:[0,0,2,5,5] },
      equipment:  { score:3.5, count:11, dist:[0,2,3,4,2] },
    },
    feedbacks:[
      { user:"K. Mansouri",  ini:"KM", meeting:"Boardroom A · 25 Jan", overall:4, comment:"Room was slightly warm but otherwise comfortable.", cats:{temperature:3,co2:4,lighting:5} },
      { user:"S. Trabelsi",  ini:"ST", meeting:"Boardroom A · 25 Jan", overall:3, comment:"AC struggled during the session.",                  cats:{temperature:2,co2:3,lighting:4} },
      { user:"L. Hamdi",     ini:"LH", meeting:"Boardroom A · 24 Jan", overall:5, comment:"Perfect session, no issues at all.",                 cats:{temperature:5,co2:5,lighting:5} },
    ],
  },
  {
    id:2, room:"Meeting Room 3", floor:"Floor 1", dept:"Engineering", site:"Leoni Sousse",
    overall:4.5, count:9, trend:"up",
    cats:{
      temperature:{ score:4.7, count:9, dist:[0,0,1,3,5] },
      co2:        { score:4.8, count:9, dist:[0,0,0,2,7] },
      lighting:   { score:4.3, count:8, dist:[0,0,1,4,3] },
      noise:      { score:3.8, count:7, dist:[0,1,2,3,1] },
      cleanliness:{ score:4.6, count:9, dist:[0,0,1,2,6] },
      equipment:  { score:4.5, count:9, dist:[0,0,0,4,5] },
    },
    feedbacks:[
      { user:"R. Boujnah", ini:"RB", meeting:"Meeting Room 3 · 25 Jan", overall:5, comment:"Excellent conditions throughout.",             cats:{temperature:5,co2:5,lighting:4} },
      { user:"A. Belhaj",  ini:"AB", meeting:"Meeting Room 3 · 25 Jan", overall:4, comment:"Great airflow, slight corridor noise.",        cats:{temperature:5,co2:5,noise:3}   },
    ],
  },
  {
    id:3, room:"Executive Suite", floor:"Floor 3", dept:"Executive", site:"Leoni Bir Mcherga",
    overall:3.2, count:7, trend:"down",
    cats:{
      temperature:{ score:3.0, count:7, dist:[1,2,2,2,0] },
      co2:        { score:2.8, count:7, dist:[2,2,2,1,0] },
      lighting:   { score:4.0, count:6, dist:[0,0,2,3,1] },
      noise:      { score:3.5, count:6, dist:[0,1,2,2,1] },
      cleanliness:{ score:4.1, count:7, dist:[0,0,2,3,2] },
      equipment:  { score:2.5, count:7, dist:[2,2,2,1,0] },
    },
    feedbacks:[
      { user:"I. Dridi",   ini:"ID", meeting:"Executive Suite · 24 Jan", overall:3, comment:"Air quality dropped noticeably near the end.", cats:{co2:2,temperature:3}   },
      { user:"T. Ben Ali", ini:"TA", meeting:"Executive Suite · 24 Jan", overall:3, comment:"Projector issues, needed IT support.",          cats:{equipment:2,lighting:4} },
    ],
  },
  {
    id:4, room:"Innovation Lab", floor:"Ground", dept:"R&D", site:"Leoni Mateur",
    overall:4.1, count:5, trend:"stable",
    cats:{
      temperature:{ score:4.3, count:5, dist:[0,0,1,2,2] },
      co2:        { score:4.6, count:5, dist:[0,0,0,2,3] },
      lighting:   { score:3.8, count:5, dist:[0,1,1,2,1] },
      noise:      { score:4.0, count:4, dist:[0,0,1,2,1] },
      cleanliness:{ score:4.2, count:5, dist:[0,0,1,2,2] },
      equipment:  { score:3.8, count:5, dist:[0,1,1,2,1] },
    },
    feedbacks:[
      { user:"O. Saidi",    ini:"OS", meeting:"Innovation Lab · 24 Jan", overall:4, comment:"Good ventilation, lighting a bit dim.",          cats:{co2:5,lighting:3}    },
      { user:"H. Belghith", ini:"HB", meeting:"Innovation Lab · 24 Jan", overall:4, comment:"Comfortable overall, minor noise from HVAC.",    cats:{temperature:4,noise:3} },
    ],
  },
];

const CATS_META = [
  { k:"temperature", l:"Temperature", desc:"Room thermal comfort",  icon:<FiThermometer size={13}/>, color:"#ea580c", bg:"#fff7ed" },
  { k:"co2",         l:"Air Quality",  desc:"Ventilation & freshness",icon:<FiWind size={13}/>,        color:"#0369a1", bg:"#f0f9ff" },
  { k:"lighting",    l:"Lighting",     desc:"Natural & artificial",   icon:<FiSun size={13}/>,         color:"#ca8a04", bg:"#fefce8" },
  { k:"noise",       l:"Noise Level",  desc:"Acoustic comfort",       icon:<FiVolume2 size={13}/>,     color:"#7c3aed", bg:"#f5f3ff" },
  { k:"cleanliness", l:"Cleanliness",  desc:"Room tidiness",          icon:<FiCheckSquare size={13}/>, color:"#16a34a", bg:"#f0fdf4" },
  { k:"equipment",   l:"Equipment",    desc:"AV, tech & furniture",   icon:<FiSettings size={13}/>,    color:"#dc2626", bg:"#fef2f2" },
];

const SITES  = ["All Sites","Leoni Mateur","Leoni Sousse","Leoni Bir Mcherga"];
const SORTS  = ["Rating ↓","Rating ↑","Most Responses","Needs Attention"];

const SCORE_LABEL  = s => s >= 4.3 ? "EXCELLENT" : s >= 3.8 ? "GOOD" : s >= 3.0 ? "AVERAGE" : "POOR";
const SCORE_COLOR  = s => s >= 4.3 ? "#16a34a" : s >= 3.8 ? "#0369a1" : s >= 3.0 ? "#ea580c" : "#dc2626";
const STAR_LABELS  = ["","Poor","Fair","Good","Great","Excellent"];
const DIST_COLORS  = ["#dc2626","#ea580c","#ca8a04","#0369a1","#16a34a"];

// ─── Shared star component ────────────────────────────────────────────────────
function StarRow({ value, onChange, size = 16, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div style={{ display:"flex", gap: size > 20 ? 8 : 4 }}>
      {[1,2,3,4,5].map(n => (
        <FiStar
          key={n}
          size={size}
          fill={n <= active ? "#f59e0b" : "none"}
          color={n <= active ? "#f59e0b" : "#e2e8f0"}
          style={{ cursor: readOnly ? "default" : "pointer", transition:"transform .12s, color .12s", transform: !readOnly && hover===n ? "scale(1.25)" : "none", flexShrink:0 }}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
        />
      ))}
    </div>
  );
}

// ─── Mini stars (read-only small) ─────────────────────────────────────────────
function MiniStars({ value, size = 11 }) {
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(n=>(
        <FiStar key={n} size={size} fill={n<=Math.round(value)?"#f59e0b":"none"} color={n<=Math.round(value)?"#f59e0b":"#e2e8f0"}/>
      ))}
    </div>
  );
}

// ─── Distribution bar ────────────────────────────────────────────────────────
function DistBar({ dist }) {
  const total = dist.reduce((s,v)=>s+v,0) || 1;
  return (
    <div className="fm-dist">
      {dist.map((v,i) => {
        const pct = (v/total)*100;
        return pct > 2 ? (
          <div key={i} className="fm-dist-seg" style={{ flex:pct, background:DIST_COLORS[i] }}>
            {pct > 10 ? `${Math.round(pct)}%` : ""}
          </div>
        ) : null;
      })}
    </div>
  );
}

// ─── FM: Room card ────────────────────────────────────────────────────────────
function FMRoomCard({ r }) {
  const [open, setOpen] = useState(false);
  const Trend = r.trend==="up" ? FiTrendingUp : r.trend==="down" ? FiTrendingDown : FiMinus;
  const tc    = r.trend==="up" ? "#16a34a" : r.trend==="down" ? "#dc2626" : "#94a3b8";
  const sc    = SCORE_COLOR(r.overall);

  return (
    <div className={`fm-card${open?" open":""}`} onClick={()=>setOpen(v=>!v)}>
      <div className="fm-card-head">
        <div>
          <div className="fm-room-name">{r.room}</div>
          <div className="fm-chips">
            <span className="fm-chip" style={{background:"#f8fafc",color:"#475569",border:"1px solid #e2e8f0"}}><FiTag size={10}/>{r.floor}</span>
            <span className="fm-chip" style={{background:"#eef2ff",color:"#4338ca",border:"1px solid #c7d2fe"}}><FiBookmark size={10}/>{r.dept}</span>
            <span className="fm-chip" style={{background:"#f0f9ff",color:"#0369a1",border:"1px solid #bae6fd"}}><FiMapPin size={10}/>{r.site}</span>
          </div>
          <div className="fm-meta-row">
            <span style={{display:"flex",alignItems:"center",gap:4}}><FiUsers size={10}/>{r.count} responses</span>
            <span className="fm-trend" style={{color:tc}}><Trend size={12}/>{r.trend}</span>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div className="fm-score-block">
            <div>
              <span className="fm-score-big" style={{color:sc}}>{r.overall.toFixed(1)}</span>
              <span className="fm-score-denom">/5</span>
            </div>
            <MiniStars value={r.overall} size={14}/>
            <span className="fm-quality-badge" style={{color:sc,background:sc+"15",border:`1px solid ${sc}30`}}>
              {SCORE_LABEL(r.overall)}
            </span>
          </div>
          <FiChevronDown size={18} className="fm-chevron"/>
        </div>
      </div>

      {open && (
        <div className="fm-expand" onClick={e=>e.stopPropagation()}>

          {/* Category breakdown */}
          <div className="fm-section-label"><FiFilter size={11}/>Category Breakdown</div>
          <div className="fm-cat-grid">
            {CATS_META.map(cat => {
              const data  = r.cats[cat.k];
              const score = data?.score ?? 0;
              const cc    = SCORE_COLOR(score);
              return (
                <div key={cat.k} className="fm-cat-card">
                  <div className="fm-cat-header">
                    <div className="fm-cat-name" style={{color:cat.color}}>
                      <span style={{background:cat.bg,borderRadius:6,padding:"4px 5px",display:"flex"}}>{cat.icon}</span>
                      {cat.l}
                    </div>
                    <span className="fm-cat-score" style={{color:cc}}>{score.toFixed(1)}</span>
                  </div>
                  <div className="fm-cat-bar-track">
                    <div className="fm-cat-bar-fill" style={{width:`${(score/5)*100}%`,background:cat.color}}/>
                  </div>
                  <div className="fm-cat-stars"><MiniStars value={score} size={12}/></div>
                  <div className="fm-cat-count">{data?.count ?? 0} ratings</div>
                  {data?.dist && <DistBar dist={data.dist}/>}
                </div>
              );
            })}
          </div>

          {/* Individual feedback */}
          <div className="fm-section-label"><FiInbox size={11}/>Individual Responses ({r.feedbacks.length})</div>
          <div className="fm-fb-list">
            {r.feedbacks.map((f,i) => (
              <div key={i} className="fm-fb-item">
                <div className="fm-fb-avatar">{f.ini}</div>
                <div>
                  <div className="fm-fb-name">{f.user}</div>
                  <div className="fm-fb-meta">{f.meeting}</div>
                  {f.comment && <div className="fm-fb-comment">{f.comment}</div>}
                  <div className="fm-fb-cats">
                    {Object.entries(f.cats||{}).map(([k,v]) => {
                      const cm = CATS_META.find(c=>c.k===k);
                      return cm ? (
                        <span key={k} className="fm-fb-cat-tag" style={{color:cm.color,background:cm.color+"15",border:`1px solid ${cm.color}25`}}>
                          {cm.icon}&nbsp;{v}★
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                  <MiniStars value={f.overall} size={13}/>
                  <span style={{fontSize:14,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:SCORE_COLOR(f.overall)}}>{f.overall}.0</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

// ─── FM REPORT VIEW ───────────────────────────────────────────────────────────
function FMView() {
  const [tab,    setTab]    = useState("rooms");
  const [search, setSearch] = useState("");
  const [site,   setSite]   = useState("All Sites");
  const [sort,   setSort]   = useState("Rating ↓");

  const filtered = useMemo(() => {
    let r = ROOM_REPORTS
      .filter(r => site==="All Sites" || r.site===site)
      .filter(r => !search || [r.room,r.dept,r.site].some(f=>f.toLowerCase().includes(search.toLowerCase())));
    if(sort==="Rating ↓")       r = [...r].sort((a,b)=>b.overall-a.overall);
    if(sort==="Rating ↑")       r = [...r].sort((a,b)=>a.overall-b.overall);
    if(sort==="Most Responses") r = [...r].sort((a,b)=>b.count-a.count);
    if(sort==="Needs Attention")r = [...r].sort((a,b)=>a.overall-b.overall);
    return r;
  }, [search,site,sort]);

  const avgRating  = (ROOM_REPORTS.reduce((s,r)=>s+r.overall,0)/ROOM_REPORTS.length).toFixed(1);
  const totalResp  = ROOM_REPORTS.reduce((s,r)=>s+r.count,0);
  const needsAttn  = ROOM_REPORTS.filter(r=>r.overall<3.5).length;
  const allFeedbacks = ROOM_REPORTS.flatMap(r=>r.feedbacks.map(f=>({...f,room:r.room,site:r.site})));

  return (
    <div>
      {/* Page header */}
      <div className="fb-eyebrow">Leoni Tunisia · Smart Room AI</div>
      <div className="fb-page-title">
        <span className="fb-title-icon" style={{background:"linear-gradient(135deg,#002857,#0064c8)"}}>
          <FiBarChart2 size={17}/>
        </span>
        Feedback Reports
      </div>

      {/* Tabs */}
      <div className="fm-tabs">
        <button className={`fm-tab${tab==="rooms"?" on":""}`} onClick={()=>setTab("rooms")}>
          <FiBarChart2 size={13}/>Room Reports
        </button>
        <button className={`fm-tab${tab==="raw"?" on":""}`} onClick={()=>setTab("raw")}>
          <FiInbox size={13}/>All Responses ({totalResp})
        </button>
      </div>

      {/* Stats */}
      <div className="fm-stats">
        {[
          { val:avgRating, lbl:"Avg Rating",     color:"#002857", iconBg:"#eff6ff", icon:<FiStar size={15} color="#0064c8"/> },
          { val:totalResp, lbl:"Total Responses", color:"#0369a1", iconBg:"#f0f9ff", icon:<FiMessageSquare size={15} color="#0369a1"/> },
          { val:ROOM_REPORTS.length, lbl:"Rooms Tracked", color:"#16a34a", iconBg:"#f0fdf4", icon:<FiCheckSquare size={15} color="#16a34a"/> },
          { val:needsAttn, lbl:"Need Attention", color:"#dc2626", iconBg:"#fef2f2", icon:<FiAlertCircle size={15} color="#dc2626"/> },
        ].map(s=>(
          <div key={s.lbl} className="fm-stat">
            <div className="fm-stat-icon" style={{background:s.iconBg}}>{s.icon}</div>
            <div className="fm-stat-val" style={{color:s.color}}>{s.val}</div>
            <div className="fm-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {tab==="rooms" ? (
        <>
          {/* Controls */}
          <div className="fm-controls">
            <div className="fm-search-wrap">
              <FiSearch size={13} className="fm-search-icon"/>
              <input className="fm-search" placeholder="Search room, department, site…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="fm-select" value={site} onChange={e=>setSite(e.target.value)}>
              {SITES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="fm-select" value={sort} onChange={e=>setSort(e.target.value)}>
              {SORTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fm-count">Showing {filtered.length} of {ROOM_REPORTS.length} rooms</div>
          <div>{filtered.map(r=><FMRoomCard key={r.id} r={r}/>)}</div>
        </>
      ) : (
        <>
          <div className="fm-controls">
            <div className="fm-search-wrap">
              <FiSearch size={13} className="fm-search-icon"/>
              <input className="fm-search" placeholder="Search by user or room…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="fm-select" value={site} onChange={e=>setSite(e.target.value)}>
              {SITES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fm-count">{allFeedbacks.length} responses total</div>
          {allFeedbacks
            .filter(f=>!search||[f.user,f.room,f.site].some(x=>x.toLowerCase().includes(search.toLowerCase())))
            .filter(f=>site==="All Sites"||f.site===site)
            .map((f,i)=>(
              <div key={i} className="fm-raw-item">
                <div className="fm-fb-avatar">{f.ini}</div>
                <div>
                  <div className="fm-fb-name">{f.user}</div>
                  <div className="fm-fb-meta">{f.room} · {f.site} · {f.meeting?.split("·")[1]?.trim()}</div>
                  {f.comment && <div className="fm-fb-comment">{f.comment}</div>}
                  <div className="fm-fb-cats">
                    {Object.entries(f.cats||{}).map(([k,v])=>{
                      const cm=CATS_META.find(c=>c.k===k);
                      return cm?<span key={k} className="fm-fb-cat-tag" style={{color:cm.color,background:cm.color+"15",border:`1px solid ${cm.color}25`}}>{cm.icon}&nbsp;{v}★</span>:null;
                    })}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                  <MiniStars value={f.overall} size={13}/>
                  <span style={{fontSize:15,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:SCORE_COLOR(f.overall)}}>{f.overall}.0</span>
                </div>
              </div>
            ))
          }
        </>
      )}
    </div>
  );
}

// ─── USER SUBMIT VIEW ─────────────────────────────────────────────────────────
const STEPS = ["Select Meeting","Overall Rating","Category Ratings","Comments","Submit"];

function UserView() {
  const [step,     setStep]    = useState(0);
  const [meeting,  setMeeting] = useState(null);
  const [overall,  setOverall] = useState(0);
  const [cats,     setCats]    = useState({});
  const [comment,  setComment] = useState("");
  const [done,     setDone]    = useState(false);

  const setCat = (k,v) => setCats(c=>({...c,[k]:v}));
  const reset  = () => { setStep(0);setMeeting(null);setOverall(0);setCats({});setComment("");setDone(false); };

  if (done) return (
    <div className="uf-container">
      <div className="fb-eyebrow">Leoni Tunisia · Smart Room AI</div>
      <div className="fb-page-title">
        <span className="fb-title-icon" style={{background:"linear-gradient(135deg,#002857,#0064c8)"}}><FiMessageSquare size={17}/></span>
        Submit Feedback
      </div>
      <div className="uf-card uf-success">
        <div className="uf-success-icon"><FiCheckCircle size={34}/></div>
        <div className="uf-success-title">Feedback Submitted!</div>
        <div className="uf-success-sub">
          Thank you — your feedback for <strong>{meeting?.room}</strong> has been recorded and will be reviewed by the Facility Manager.
        </div>
        <button className="uf-success-again" onClick={reset}>Submit another feedback</button>
      </div>
    </div>
  );

  const stepDot = (i) =>
    i < step ? "done" : i === step ? "curr" : "todo";

  return (
    <div className="uf-container">
      <div className="fb-eyebrow">Leoni Tunisia · Smart Room AI</div>
      <div className="fb-page-title">
        <span className="fb-title-icon" style={{background:"linear-gradient(135deg,#002857,#0064c8)"}}><FiMessageSquare size={17}/></span>
        Submit Feedback
      </div>

      {/* Step bar */}
      <div className="uf-step-bar">
        {STEPS.map((s,i)=>(
          <div key={s} className="uf-step">
            <div className={`uf-step-dot ${stepDot(i)}`}>
              {i < step ? <FiCheckCircle size={13}/> : i+1}
            </div>
            <span className={`uf-step-lbl${i===step?" curr":""}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Select meeting */}
      {step===0 && (
        <div className="uf-card">
          <div className="uf-card-title">Which meeting are you rating?</div>
          <div className="uf-card-sub">Select a meeting you attended</div>
          <div className="uf-meeting-list">
            {MY_MEETINGS.map(m=>(
              <div key={m.id} className={`uf-meeting-item${meeting?.id===m.id?" selected":""}`} onClick={()=>setMeeting(m)}>
                <div className="uf-meeting-icon"><FiCalendar size={16}/></div>
                <div>
                  <div className="uf-meeting-name">{m.room}</div>
                  <div className="uf-meeting-meta">{m.site} · {m.dept} · {m.date} · {m.time}</div>
                </div>
                <div className="uf-meeting-check"><FiCheckCircle size={12}/></div>
              </div>
            ))}
          </div>
          <div className="uf-nav" style={{marginTop:20}}>
            <div/>
            <button className="uf-btn uf-btn-primary" disabled={!meeting} onClick={()=>setStep(1)}>
              Next <FiArrowRight size={13}/>
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Overall rating */}
      {step===1 && (
        <div className="uf-card">
          <div className="uf-card-title">Overall Experience</div>
          <div className="uf-card-sub">{meeting?.room} · {meeting?.date}</div>
          <div style={{padding:"24px 0",textAlign:"center"}}>
            <div className="uf-overall-stars">
              <StarRow value={overall} onChange={setOverall} size={44}/>
            </div>
            <div className="uf-overall-label" style={{color:overall?SCORE_COLOR(overall):"#94a3b8",fontWeight:overall?700:400}}>
              {overall ? STAR_LABELS[overall] : "Tap to rate"}
            </div>
            {overall>0 && (
              <div style={{marginTop:12,fontSize:13,color:"#64748b"}}>
                You rated this meeting <strong style={{color:SCORE_COLOR(overall)}}>{overall} out of 5 stars</strong>
              </div>
            )}
          </div>
          <div className="uf-nav">
            <button className="uf-btn uf-btn-ghost" onClick={()=>setStep(0)}>Back</button>
            <button className="uf-btn uf-btn-primary" disabled={!overall} onClick={()=>setStep(2)}>
              Next <FiArrowRight size={13}/>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Category ratings */}
      {step===2 && (
        <div className="uf-card">
          <div className="uf-card-title">Rate by Category</div>
          <div className="uf-card-sub">Optional — rate specific aspects of the room</div>
          <div className="uf-cat-grid">
            {CATS_META.map(cat=>(
              <div key={cat.k} className="uf-cat-item">
                <div className="uf-cat-item-header">
                  <div className="uf-cat-icon" style={{background:cat.bg}}>
                    <span style={{color:cat.color}}>{cat.icon}</span>
                  </div>
                  <div>
                    <div className="uf-cat-label">{cat.l}</div>
                    <div className="uf-cat-desc">{cat.desc}</div>
                  </div>
                </div>
                <div className="uf-cat-stars">
                  <StarRow value={cats[cat.k]||0} onChange={v=>setCat(cat.k,v)} size={18}/>
                </div>
                {cats[cat.k]>0 && (
                  <div style={{fontSize:11,color:cat.color,marginTop:4,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>
                    {STAR_LABELS[cats[cat.k]]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="uf-nav" style={{marginTop:20}}>
            <button className="uf-btn uf-btn-ghost" onClick={()=>setStep(1)}>Back</button>
            <button className="uf-btn uf-btn-primary" onClick={()=>setStep(3)}>
              Next <FiArrowRight size={13}/>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Comment */}
      {step===3 && (
        <div className="uf-card">
          <div className="uf-card-title">Any Additional Comments?</div>
          <div className="uf-card-sub">Optional — share any specific observations or suggestions</div>
          <textarea
            className="uf-textarea"
            rows={5}
            placeholder="e.g. The temperature was a bit high during the second half of the meeting. The projector worked well."
            value={comment}
            onChange={e=>setComment(e.target.value)}
          />
          <div className="uf-nav" style={{marginTop:16}}>
            <button className="uf-btn uf-btn-ghost" onClick={()=>setStep(2)}>Back</button>
            <button className="uf-btn uf-btn-primary" onClick={()=>setStep(4)}>
              Review <FiArrowRight size={13}/>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & submit */}
      {step===4 && (
        <div className="uf-card">
          <div className="uf-card-title">Review Your Feedback</div>
          <div className="uf-card-sub">{meeting?.room} · {meeting?.site}</div>

          {/* Summary */}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:11,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Overall</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <StarRow value={overall} size={20} readOnly/>
                <span style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:SCORE_COLOR(overall)}}>{overall}.0</span>
                <span style={{fontSize:13,color:SCORE_COLOR(overall),fontWeight:700}}>{STAR_LABELS[overall]}</span>
              </div>
            </div>

            {Object.keys(cats).length > 0 && (
              <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",marginBottom:10,letterSpacing:.8,textTransform:"uppercase"}}>Categories</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {Object.entries(cats).map(([k,v])=>{
                    const cm=CATS_META.find(c=>c.k===k);
                    return cm&&v>0?(
                      <span key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:cm.color,background:cm.color+"12",border:`1px solid ${cm.color}25`,borderRadius:6,padding:"4px 10px",fontWeight:600}}>
                        {cm.icon}&nbsp;{cm.l}: {v}★
                      </span>
                    ):null;
                  })}
                </div>
              </div>
            )}

            {comment && (
              <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",border:"1px solid #e2e8f0",fontSize:13,color:"#475569",lineHeight:1.55,fontStyle:"italic"}}>
                "{comment}"
              </div>
            )}
          </div>

          <div className="uf-nav">
            <button className="uf-btn uf-btn-ghost" onClick={()=>setStep(3)}>Back</button>
            <button className="uf-btn uf-btn-primary" onClick={()=>setDone(true)}>
              <FiSend size={13}/>Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function FM_Feedback() {
  const [role, setRole] = useState("user"); // "user" | "fm"

  return (
    <>
      <style>{CSS}</style>
      <div className="fb-root">
        {/* Role switcher — in production this comes from auth context */}
        <div className="fb-role-bar">
          <span className="fb-role-label">View as:</span>
          <button className={`fb-role-btn${role==="user"?" active":""}`} onClick={()=>setRole("user")}>
            <FiUser size={11}/> Employee
          </button>
          <button className={`fb-role-btn${role==="fm"?" active":""}`} onClick={()=>setRole("fm")}>
            <FiBarChart2 size={11}/> Facility Manager
          </button>
        </div>

        <div className="fb-page">
          {role==="fm" ? <FMView/> : <UserView/>}
        </div>
      </div>
    </>
  );
}