import { useState, useMemo } from "react";
import {
  FiClock, FiUsers, FiSearch, FiChevronDown, FiUser,
  FiThermometer, FiWind, FiSettings, FiSun, FiAlertTriangle,
  FiCheckCircle, FiArrowRight, FiAlertCircle, FiTag, FiBox,
  FiMapPin, FiBookmark, FiFilter, FiTool, FiPackage, FiShield,
  FiActivity, FiCalendar, FiHash,
} from "react-icons/fi";

/* ─── SHARED TOKENS ──────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --navy:   #002857;
  --blue:   #0064c8;
  --sky:    #00b2ff;
  --bg:     #f0f4f8;
  --card:   #ffffff;
  --border: #e2e8f0;
  --border2:#f1f5f9;
  --tx:     #0f172a;
  --tx2:    #475569;
  --muted:  #94a3b8;
  --green:  #16a34a;
  --red:    #dc2626;
  --orange: #ea580c;
  --yellow: #ca8a04;
  --mono:   'JetBrains Mono', monospace;
  --sans:   'Plus Jakarta Sans', sans-serif;
  --r:      12px;
  --r-sm:   8px;
  --sh:     0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
  --sh-lg:  0 8px 32px rgba(0,40,87,.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pg { min-height: 100vh; background: var(--bg); padding: 28px 24px; font-family: var(--sans); color: var(--tx); }

/* ── Tabs ── */
.tabs { display: flex; gap: 4px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 5px; margin-bottom: 22px; box-shadow: var(--sh); width: fit-content; }
.tab  { display: flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--tx2); transition: background .18s, color .18s; }
.tab.on { background: linear-gradient(135deg, var(--navy), var(--blue)); color: #fff; box-shadow: 0 2px 8px rgba(0,40,87,.22); }
.tab-badge { font-size: 10px; font-family: var(--mono); background: rgba(255,255,255,.25); border-radius: 4px; padding: 1px 6px; }
.tab:not(.on) .tab-badge { background: var(--border); color: var(--muted); }

/* ── Page header ── */
.pg-hd { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 22px; }
.pg-eye { font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; font-family: var(--mono); margin-bottom: 5px; }
.pg-ttl { font-size: 22px; font-weight: 800; color: var(--tx); letter-spacing: -.5px; display: flex; align-items: center; gap: 10px; }
.pg-ico { width: 36px; height: 36px; background: linear-gradient(135deg, var(--navy), var(--blue)); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }

/* ── Stats row ── */
.stats { display: flex; gap: 10px; flex-wrap: wrap; }
.stat  { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; text-align: center; min-width: 68px; box-shadow: var(--sh); }
.stat-v { font-size: 20px; font-weight: 800; font-family: var(--mono); line-height: 1; }
.stat-l { font-size: 10px; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: .4px; }

/* ── Controls ── */
.ctl { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; align-items: center; }
.sw  { position: relative; flex: 1 1 200px; }
.si  { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.inp { width: 100%; box-sizing: border-box; background: var(--card); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 8px 12px 8px 32px; font-size: 13px; color: var(--tx); outline: none; font-family: var(--sans); box-shadow: var(--sh); transition: border-color .15s; }
.inp:focus { border-color: var(--sky); box-shadow: 0 0 0 3px rgba(0,178,255,.1); }
.sel { background: var(--card); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 8px 10px; font-size: 12px; color: var(--tx2); outline: none; cursor: pointer; font-family: var(--mono); box-shadow: var(--sh); }
.cnt { font-size: 11px; color: var(--muted); font-family: var(--mono); margin-bottom: 12px; }

/* ── List ── */
.list { display: flex; flex-direction: column; gap: 10px; }
.empty { text-align: center; color: var(--muted); padding: 60px 0; font-size: 13px; font-family: var(--mono); }

/* ── Card (shared) ── */
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; box-shadow: var(--sh); transition: box-shadow .2s; cursor: pointer; }
.card:hover { box-shadow: var(--sh-lg); }
.card.op    { box-shadow: var(--sh-lg); }

/* ── Meeting card header ── */
.mch { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 14px 16px; }
.ref { background: linear-gradient(135deg, var(--navy), var(--blue)); color: #fff; font-family: var(--mono); font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 6px; white-space: nowrap; letter-spacing: .5px; }
.crm { font-weight: 700; font-size: 15px; color: var(--tx); letter-spacing: -.2px; margin-bottom: 5px; }
.chips { display: flex; gap: 5px; flex-wrap: wrap; }
.chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 2px 8px; border-radius: 5px; white-space: nowrap; font-weight: 500; }
.cr-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.tb { display: flex; align-items: center; gap: 5px; font-size: 12px; font-family: var(--mono); color: var(--tx2); white-space: nowrap; }
.badge-or { font-size: 10px; font-weight: 700; color: var(--red);   background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 2px 7px; font-family: var(--mono); }
.badge-ok { font-size: 10px; font-weight: 700; color: var(--green); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 2px 7px; font-family: var(--mono); }
.chev { color: var(--border); transition: transform .2s; }
.card.op .chev { transform: rotate(180deg); }

/* ── Meeting card body ── */
.mbody { border-top: 1px solid var(--border2); padding: 0 16px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; animation: fadeIn .2s ease; }
.sec-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; font-family: var(--mono); margin: 14px 0 8px; display: flex; align-items: center; gap: 6px; }
.trow { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
.tl-k { color: var(--tx2); }
.tl-v { font-family: var(--mono); font-weight: 600; color: var(--tx); }
.eg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ec { background: #f8fafc; border: 1px solid var(--border); border-radius: var(--r-sm); padding: 10px 12px; }
.el { font-size: 10px; color: var(--muted); font-family: var(--mono); margin-bottom: 4px; display: flex; align-items: center; gap: 5px; }
.ev { font-size: 15px; font-weight: 700; font-family: var(--mono); }
.eb { height: 3px; border-radius: 99px; background: var(--border); margin-top: 5px; overflow: hidden; }
.ef { height: 100%; border-radius: 99px; transition: width .6s ease; }
.mod-box { background: linear-gradient(135deg,#f0f9ff,#e0f2fe); border: 1px solid #bae6fd; border-radius: 9px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; }
.mod-av  { width: 38px; height: 38px; background: linear-gradient(135deg,var(--navy),var(--blue)); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.mod-nm  { font-weight: 700; font-size: 13px; color: var(--tx); }
.mod-sub { font-size: 11px; color: var(--tx2); font-family: var(--mono); }
.note-box { background: #fefce8; border: 1px solid #fde68a; border-radius: var(--r-sm); padding: 10px 12px; font-size: 12px; color: #713f12; line-height: 1.55; }
.fw { grid-column: 1 / -1; }
.gt { width: 100%; border-collapse: collapse; }
.gt th { text-align: left; font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: .4px; text-transform: uppercase; padding: 4px 8px; font-family: var(--mono); border-bottom: 1px solid var(--border2); }
.gt td { font-size: 12px; color: #334155; padding: 7px 8px; border-bottom: 1px solid var(--border2); vertical-align: middle; }
.gt tr:last-child td { border-bottom: none; }
.gid { font-family: var(--mono); font-size: 10px; color: var(--muted); background: #f8fafc; padding: 2px 6px; border-radius: 4px; }
.ci-ok   { color: var(--green); font-family: var(--mono); font-size: 11px; }
.ci-late { color: var(--red);   font-family: var(--mono); font-size: 11px; }

/* ── Anomaly card header ── */
.ach { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 14px 16px; }
.sev-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
.an-title { font-weight: 700; font-size: 15px; color: var(--tx); letter-spacing: -.2px; margin-bottom: 5px; }
.sev-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 5px; font-family: var(--mono); text-transform: uppercase; letter-spacing: .4px; }
.sev-critical { background: #fef2f2; color: var(--red);    border: 1px solid #fecaca; }
.sev-high     { background: #fff7ed; color: var(--orange); border: 1px solid #fed7aa; }
.sev-medium   { background: #fefce8; color: var(--yellow); border: 1px solid #fde68a; }
.sev-low      { background: #f0fdf4; color: var(--green);  border: 1px solid #bbf7d0; }
.dot-critical { background: var(--red); }
.dot-high     { background: var(--orange); }
.dot-medium   { background: var(--yellow); }
.dot-low      { background: var(--green); }
.st-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 5px; font-family: var(--mono); border: 1px solid transparent; }
.st-resolved    { color: var(--green); background: #f0fdf4; border-color: #bbf7d0; }
.st-active      { color: var(--red);   background: #fef2f2; border-color: #fecaca; }
.st-investigating { color: var(--orange); background: #fff7ed; border-color: #fed7aa; }
.st-pending     { color: var(--yellow); background: #fefce8; border-color: #fde68a; }
.st-scheduled   { color: var(--blue);  background: #eff6ff; border-color: #bfdbfe; }

/* ── Anomaly card body ── */
.abody { border-top: 1px solid var(--border2); padding: 0 16px 16px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; animation: fadeIn .2s ease; }
.info-box { background: #f8fafc; border: 1px solid var(--border); border-radius: var(--r-sm); padding: 12px 14px; }
.info-box h4 { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; font-family: var(--mono); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.info-row { display: flex; justify-content: space-between; align-items: flex-start; font-size: 12px; margin-bottom: 7px; gap: 8px; }
.info-row:last-child { margin-bottom: 0; }
.info-k { color: var(--tx2); white-space: nowrap; flex-shrink: 0; }
.info-v { font-family: var(--mono); font-weight: 600; color: var(--tx); text-align: right; }
.mat-list { display: flex; flex-direction: column; gap: 6px; }
.mat-item { display: flex; justify-content: space-between; align-items: center; background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 7px 10px; font-size: 12px; }
.mat-item.urg { border-left: 3px solid var(--red); }
.mat-nm  { font-weight: 600; color: var(--tx); display: block; }
.mat-qty { color: var(--muted); font-family: var(--mono); font-size: 10px; }
.urg-tag { font-size: 10px; font-weight: 700; color: var(--red); background: #fef2f2; border-radius: 4px; padding: 2px 6px; white-space: nowrap; }
.rep-box { display: flex; align-items: center; gap: 10px; }
.rep-av  { width: 34px; height: 34px; background: linear-gradient(135deg,var(--navy),var(--blue)); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; flex-shrink: 0; }
.rep-nm  { font-weight: 700; font-size: 13px; color: var(--tx); }
.rep-role{ font-size: 11px; color: var(--tx2); font-family: var(--mono); }
.act-list { display: flex; flex-direction: column; gap: 5px; }
.act-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--tx); }
.act-item.done span { text-decoration: line-through; color: var(--muted); }
.act-cb { width: 13px; height: 13px; accent-color: var(--blue); flex-shrink: 0; }
.desc-txt { font-size: 12px; color: var(--tx2); line-height: 1.6; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
`;

/* ─── DATA ───────────────────────────────────────────────────── */
const MEETINGS = [
  { id:"M-2401", ref:"REF-20240125-01", room:"Boardroom A", floor:"Floor 2", dept:"Management", site:"Leoni Mateur", date:"2024-01-25", bStart:"10:00", bEnd:"11:30", aEnd:"11:48", dur:108, bDur:90, mod:{ name:"Amira Ben Salah", id:"U-0041", ini:"AB" }, status:"overrun", env:{ co2:1180, temp:25.8, hvac:62, light:78 }, guests:[{ name:"Karim Mansouri", id:"U-0082", ci:"09:58", role:"Guest", late:false },{ name:"Safa Trabelsi", id:"U-0113", ci:"10:03", role:"Guest", late:false },{ name:"Mehdi Chaabane", id:"U-0095", ci:"10:14", role:"Guest", late:true },{ name:"Lina Hamdi", id:"U-0077", ci:"10:01", role:"Co-host", late:false }], note:"AC malfunctioned mid-session. Maintenance notified." },
  { id:"M-2398", ref:"REF-20240125-02", room:"Meeting Room 3", floor:"Floor 1", dept:"Engineering", site:"Leoni Sousse", date:"2024-01-25", bStart:"09:00", bEnd:"10:00", aEnd:"09:58", dur:58, bDur:60, mod:{ name:"Youssef Gharbi", id:"U-0031", ini:"YG" }, status:"on-time", env:{ co2:760, temp:22.4, hvac:71, light:85 }, guests:[{ name:"Rim Boujnah", id:"U-0054", ci:"08:57", role:"Guest", late:false },{ name:"Anis Belhaj", id:"U-0066", ci:"09:02", role:"Guest", late:false },{ name:"Noura Khelil", id:"U-0049", ci:"09:00", role:"Guest", late:false }], note:"" },
  { id:"M-2391", ref:"REF-20240124-05", room:"Executive Suite", floor:"Floor 3", dept:"Executive", site:"Leoni Bir Mcherga", date:"2024-01-24", bStart:"14:00", bEnd:"15:00", aEnd:"15:22", dur:82, bDur:60, mod:{ name:"Chadi Fekih", id:"U-0010", ini:"CF" }, status:"overrun", env:{ co2:940, temp:23.1, hvac:58, light:90 }, guests:[{ name:"Ines Dridi", id:"U-0021", ci:"14:00", role:"Guest", late:false },{ name:"Ramzi Louati", id:"U-0038", ci:"14:07", role:"Guest", late:true },{ name:"Manel Zribi", id:"U-0056", ci:"13:58", role:"Co-host", late:false },{ name:"Tarek Ben Ali", id:"U-0071", ci:"14:02", role:"Guest", late:false },{ name:"Amal Jebali", id:"U-0083", ci:"14:11", role:"Guest", late:true }], note:"Extended by executive decision. CO₂ flagged high near end." },
  { id:"M-2385", ref:"REF-20240124-02", room:"Innovation Lab", floor:"Ground", dept:"R&D", site:"Leoni Mateur", date:"2024-01-24", bStart:"11:00", bEnd:"12:00", aEnd:"12:01", dur:61, bDur:60, mod:{ name:"Sarra Mejri", id:"U-0028", ini:"SM" }, status:"on-time", env:{ co2:580, temp:21.3, hvac:82, light:72 }, guests:[{ name:"Omar Saidi", id:"U-0092", ci:"10:59", role:"Guest", late:false },{ name:"Hajer Belghith", id:"U-0101", ci:"11:04", role:"Guest", late:true }], note:"" },
];

const ANOMALIES = [
  { id:"AN-001", ref:"ANO-20240125-01", room:"Boardroom A", floor:"Floor 2", dept:"Management", site:"Leoni Mateur", date:"2024-01-25", detectedAt:"2024-01-25T10:22:00", resolvedAt:"2024-01-25T13:45:00", severity:"critical", category:"air-quality", status:"resolved", title:"CO₂ Levels Critical", description:"CO₂ concentration exceeded 1000ppm for 30 minutes. Ventilation system malfunction confirmed during active meeting.", itAdmin:{ name:"Jean Dupont", id:"U-IT-01", ini:"JD", email:"jean.dupont@leoni.com" }, system:"HVAC System", affectedUsers:12, duration:"3h 23min", materials:[{ name:"HVAC Filter (HEPA Grade)", qty:2, unit:"pcs", urgent:true, cost:"€ 140" },{ name:"CO₂ Sensor Calibration Kit", qty:1, unit:"kit", urgent:false, cost:"€ 85" }], actions:[{ desc:"Checked ventilation ducts — blockage confirmed", done:true },{ desc:"Replaced HVAC filters", done:true },{ desc:"Recalibrated CO₂ sensor", done:true },{ desc:"Increased air exchange rate to 120%", done:true }], notes:"Issue triggered by simultaneous occupancy of 12 persons exceeding room capacity. Policy update recommended." },
  { id:"AN-002", ref:"ANO-20240124-03", room:"Executive Suite", floor:"Floor 3", dept:"Executive", site:"Leoni Bir Mcherga", date:"2024-01-24", detectedAt:"2024-01-24T15:05:00", resolvedAt:"2024-01-24T17:30:00", severity:"high", category:"hvac", status:"resolved", title:"HVAC Underperformance", description:"HVAC operating at 58% capacity during executive meeting. Temperature stability affected.", itAdmin:{ name:"Marie Martin", id:"U-IT-02", ini:"MM", email:"marie.martin@leoni.com" }, system:"HVAC System", affectedUsers:5, duration:"2h 25min", materials:[{ name:"HVAC Control Board", qty:1, unit:"pcs", urgent:true, cost:"€ 320" },{ name:"Refrigerant R-410A", qty:1, unit:"can", urgent:false, cost:"€ 60" }], actions:[{ desc:"Diagnosed control board fault", done:true },{ desc:"Replaced HVAC control board", done:true },{ desc:"Topped up refrigerant", done:true }], notes:"Control board showed firmware version mismatch after last system update." },
  { id:"AN-003", ref:"ANO-20240123-07", room:"Meeting Room 3", floor:"Floor 1", dept:"Engineering", site:"Leoni Sousse", date:"2024-01-23", detectedAt:"2024-01-23T08:15:00", resolvedAt:"2024-01-23T10:00:00", severity:"medium", category:"sensor", status:"resolved", title:"Temperature Sensor Offline", description:"Temperature sensor stopped reporting. Possible hardware failure or connection issue discovered during routine check.", itAdmin:{ name:"Pierre Dubois", id:"U-IT-03", ini:"PD", email:"pierre.dubois@leoni.com" }, system:"Sensor Network", affectedUsers:0, duration:"1h 45min", materials:[{ name:"Temperature Sensor (IoT)", qty:1, unit:"pcs", urgent:true, cost:"€ 95" },{ name:"Wireless Module ZigBee", qty:1, unit:"pcs", urgent:false, cost:"€ 40" }], actions:[{ desc:"Checked sensor network connectivity", done:true },{ desc:"Replaced faulty sensor unit", done:true },{ desc:"Tested and validated data stream", done:true }], notes:"Sensor lifespan exceeded 3 years. Recommend scheduled replacement cycle for all units." },
  { id:"AN-004", ref:"ANO-20240122-02", room:"Innovation Lab", floor:"Ground", dept:"R&D", site:"Leoni Mateur", date:"2024-01-22", detectedAt:"2024-01-22T09:30:00", resolvedAt:"2024-01-22T11:15:00", severity:"medium", category:"lighting", status:"resolved", title:"Lighting System Malfunction", description:"Three LED fixtures not responding to SmartRoom commands. Manual flickering reported.", itAdmin:{ name:"Sophie Bernard", id:"U-IT-04", ini:"SB", email:"sophie.bernard@leoni.com" }, system:"Lighting Control", affectedUsers:6, duration:"1h 45min", materials:[{ name:"LED Driver 40W DALI", qty:3, unit:"pcs", urgent:true, cost:"€ 210" },{ name:"Ethernet Patch Cable Cat6", qty:1, unit:"pcs", urgent:false, cost:"€ 8" }], actions:[{ desc:"Identified faulty LED drivers via diagnostics", done:true },{ desc:"Replaced 3 LED drivers", done:true },{ desc:"Verified DALI bus integrity", done:true }], notes:"Flickering attributed to driver age (>5 years). Batch replacement of lab fixtures planned for Q2." },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
const ec   = (v, w, d) => v >= d ? "var(--red)" : v >= w ? "var(--orange)" : "var(--green)";
const ew   = (v, max) => `${Math.min(v / max, 1) * 100}%`;
const fmt  = iso => new Date(iso).toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
const fmtD = s => s.split("T")[0];

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
function EnvCard({ icon, label, value, unit, warn, danger, max }) {
  const c = ec(value, warn, danger);
  return (
    <div className="ec">
      <div className="el">{icon}{label}</div>
      <div className="ev" style={{ color: c }}>{value}<span style={{ fontSize: 10, fontWeight: 400, color: "var(--muted)" }}>{unit}</span></div>
      <div className="eb"><div className="ef" style={{ width: ew(value, max), background: c }} /></div>
    </div>
  );
}

function MeetingCard({ m }) {
  const [open, setOpen] = useState(false);
  const overrun = m.dur - m.bDur;
  return (
    <div className={`card${open ? " op" : ""}`} onClick={() => setOpen(v => !v)}>
      <div className="mch">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="ref">{m.ref}</span>
          <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)" }}>{m.date}</span>
        </div>
        <div>
          <div className="crm">{m.room}</div>
          <div className="chips">
            <span className="chip" style={{ background:"#f8fafc", color:"#475569", border:"1px solid var(--border)" }}><FiTag size={10}/>{m.floor}</span>
            <span className="chip" style={{ background:"#eef2ff", color:"#4338ca", border:"1px solid #c7d2fe" }}><FiBookmark size={10}/>{m.dept}</span>
            <span className="chip" style={{ background:"#f0f9ff", color:"#0369a1", border:"1px solid #bae6fd" }}><FiMapPin size={10}/>{m.site}</span>
          </div>
        </div>
        <div className="cr-meta">
          <div className="tb"><FiClock size={11}/>{m.bStart}<FiArrowRight size={10}/>{m.aEnd}</div>
          {m.status === "overrun" ? <span className="badge-or">+{overrun} min overrun</span> : <span className="badge-ok">On Time</span>}
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--tx2)" }}><FiUsers size={11}/>{m.guests.length} guests</div>
          <FiChevronDown size={16} className="chev"/>
        </div>
      </div>

      {open && (
        <div className="mbody" onClick={e => e.stopPropagation()}>
          <div>
            <div className="sec-lbl"><FiUser size={11}/>Moderator</div>
            <div className="mod-box">
              <div className="mod-av">{m.mod.ini}</div>
              <div><div className="mod-nm">{m.mod.name}</div><div className="mod-sub">ID {m.mod.id} · Moderator</div></div>
            </div>
          </div>
          <div>
            <div className="sec-lbl"><FiClock size={11}/>Session Timing</div>
            {[["Booked Start", m.bStart], ["Booked End", m.bEnd], ["Actual End", m.aEnd], ["Booked Duration", `${m.bDur} min`], ["Actual Duration", `${m.dur} min`], ["Overrun", overrun > 0 ? `+${overrun} min` : "None"]].map(([l, v]) => (
              <div key={l} className="trow">
                <span className="tl-k">{l}</span>
                <span className="tl-v" style={{ color: l === "Overrun" && overrun > 0 ? "var(--red)" : "var(--tx)" }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="sec-lbl"><FiSettings size={11}/>Room Environment</div>
            <div className="eg">
              <EnvCard icon={<FiWind size={10}/>}        label="CO₂"     value={m.env.co2}   unit=" ppm" warn={1000} danger={1300} max={1600}/>
              <EnvCard icon={<FiThermometer size={10}/>} label="Temp"    value={m.env.temp}  unit="°C"   warn={24}   danger={26}   max={30}/>
              <EnvCard icon={<FiSettings size={10}/>}    label="HVAC"    value={m.env.hvac}  unit="%"    warn={75}   danger={90}   max={100}/>
              <EnvCard icon={<FiSun size={10}/>}         label="Lighting"value={m.env.light} unit="%"    warn={90}   danger={95}   max={100}/>
            </div>
          </div>
          {m.note && (
            <div>
              <div className="sec-lbl"><FiAlertCircle size={11}/>FM Notes</div>
              <div className="note-box">{m.note}</div>
            </div>
          )}
          <div className="fw">
            <div className="sec-lbl"><FiUsers size={11}/>Attendees ({m.guests.length})</div>
            <table className="gt">
              <thead><tr><th>Name</th><th>User ID</th><th>Role</th><th>Check-In</th><th>Status</th></tr></thead>
              <tbody>
                {m.guests.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 600, color: "var(--tx)" }}>{g.name}</td>
                    <td><span className="gid">{g.id}</span></td>
                    <td style={{ color: "var(--tx2)" }}>{g.role}</td>
                    <td><span className={g.late ? "ci-late" : "ci-ok"}>{g.ci}</span></td>
                    <td>{g.late
                      ? <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--red)" }}><FiAlertTriangle size={10}/>Late</span>
                      : <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--green)" }}><FiCheckCircle size={10}/>On Time</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AnomalyCard({ a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card${open ? " op" : ""}`} onClick={() => setOpen(v => !v)}>
      <div className="ach">
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <span className="ref">{a.ref}</span>
          <span style={{ fontSize:10, color:"var(--muted)", fontFamily:"var(--mono)" }}>{a.date}</span>
        </div>
        <div>
          <div className="an-title">{a.title}</div>
          <div className="chips">
            <span className={`sev-badge sev-${a.severity}`}><span className={`sev-dot dot-${a.severity}`} style={{width:6,height:6,borderRadius:"50%",display:"inline-block"}}/>{a.severity.toUpperCase()}</span>
            <span className="chip" style={{ background:"#f8fafc", color:"#475569", border:"1px solid var(--border)" }}><FiTag size={10}/>{a.floor}</span>
            <span className="chip" style={{ background:"#eef2ff", color:"#4338ca", border:"1px solid #c7d2fe" }}><FiMapPin size={10}/>{a.room}</span>
            <span className="chip" style={{ background:"#f0f9ff", color:"#0369a1", border:"1px solid #bae6fd" }}><FiBookmark size={10}/>{a.site}</span>
          </div>
        </div>
        <div className="cr-meta">
          <span className={`st-badge st-${a.status}`}>{a.status}</span>
          <div className="tb"><FiClock size={11}/>Duration: {a.duration}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--tx2)" }}><FiUsers size={11}/>{a.affectedUsers} affected</div>
          <FiChevronDown size={16} className="chev"/>
        </div>
      </div>

      {open && (
        <div className="abody" onClick={e => e.stopPropagation()}>
          {/* Col 1 — Timeline + Reporter */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div className="info-box">
              <h4><FiCalendar size={10}/>Timeline</h4>
              {[["Detected", fmt(a.detectedAt)], ["Resolved", fmt(a.resolvedAt)], ["Duration", a.duration], ["System", a.system], ["Category", a.category.replace("-"," ")]].map(([k,v]) => (
                <div key={k} className="info-row"><span className="info-k">{k}</span><span className="info-v">{v}</span></div>
              ))}
            </div>
            <div className="info-box">
              <h4><FiUser size={10}/>IT Administrator</h4>
              <div className="rep-box">
                <div className="rep-av">{a.itAdmin.ini}</div>
                <div><div className="rep-nm">{a.itAdmin.name}</div><div className="rep-role">{a.itAdmin.id}</div><div className="rep-role">{a.itAdmin.email}</div></div>
              </div>
            </div>
            <div className="info-box">
              <h4><FiActivity size={10}/>Description</h4>
              <p className="desc-txt">{a.description}</p>
              {a.notes && <p className="desc-txt" style={{ marginTop:8, fontStyle:"italic", color:"var(--muted)" }}>{a.notes}</p>}
            </div>
          </div>

          {/* Col 2 — Materials */}
          <div>
            <div className="info-box" style={{ height:"100%" }}>
              <h4><FiPackage size={10}/>Materials Used</h4>
              <div className="mat-list">
                {a.materials.map((m, i) => (
                  <div key={i} className={`mat-item${m.urgent ? " urg" : ""}`}>
                    <div>
                      <span className="mat-nm">{m.name}</span>
                      <span className="mat-qty">Qty: {m.qty} {m.unit} · {m.cost}</span>
                    </div>
                    {m.urgent && <span className="urg-tag">Urgent</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid var(--border)", fontSize:11, color:"var(--muted)", fontFamily:"var(--mono)" }}>
                Total cost: <span style={{ color:"var(--tx)", fontWeight:600 }}>{a.materials.reduce((s,m)=>{const n=parseFloat(m.cost.replace("€","").trim());return s+n;},0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}</span>
              </div>
            </div>
          </div>

          {/* Col 3 — Actions */}
          <div>
            <div className="info-box" style={{ height:"100%" }}>
              <h4><FiTool size={10}/>Corrective Actions</h4>
              <div className="act-list">
                {a.actions.map((ac, i) => (
                  <div key={i} className={`act-item${ac.done ? " done" : ""}`}>
                    <input type="checkbox" className="act-cb" checked={ac.done} readOnly/>
                    <span>{ac.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid var(--border)", display:"flex", gap:8 }}>
                <div style={{ flex:1, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:6, padding:"6px 10px", fontSize:11, fontFamily:"var(--mono)", color:"var(--green)", textAlign:"center" }}>
                  {a.actions.filter(x=>x.done).length}/{a.actions.length} done
                </div>
                <div style={{ flex:1, background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:6, padding:"6px 10px", fontSize:11, fontFamily:"var(--mono)", color:"#0369a1", textAlign:"center" }}>
                  {a.affectedUsers} users
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PANELS ─────────────────────────────────────────────────── */
const SITES = ["All Sites", "Leoni Mateur", "Leoni Sousse", "Leoni Bir Mcherga"];

function MeetingPanel() {
  const [search, setSearch] = useState("");
  const [site, setSite]     = useState("All Sites");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => MEETINGS
    .filter(m => site === "All Sites" || m.site === site)
    .filter(m => status === "All" || m.status === status)
    .filter(m => !search || [m.room, m.ref, m.mod.name, m.dept, m.site].some(f => f.toLowerCase().includes(search.toLowerCase())))
  , [search, site, status]);

  const overruns = MEETINGS.filter(m => m.status === "overrun").length;
  const totalGuests = MEETINGS.reduce((s, m) => s + m.guests.length, 0);

  return (
    <>
      <div className="pg-hd">
        <div>
          <div className="pg-eye">Leoni Tunisia · Smart Room AI</div>
          <h2 className="pg-ttl"><span className="pg-ico"><FiClock size={17}/></span>Meeting History</h2>
        </div>
        <div className="stats">
          {[["Total", MEETINGS.length, "#002857"], ["Overruns", overruns, "var(--red)"], ["Guests", totalGuests, "#0369a1"], ["Sites", 3, "var(--green)"]].map(([l, v, c]) => (
            <div key={l} className="stat"><div className="stat-v" style={{ color:c }}>{v}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="ctl">
        <div className="sw"><FiSearch size={13} className="si"/><input className="inp" placeholder="Search room, ref, moderator, department…" value={search} onChange={e => setSearch(e.target.value)}/></div>
        <select className="sel" value={site}   onChange={e => setSite(e.target.value)}>{SITES.map(s => <option key={s}>{s}</option>)}</select>
        <select className="sel" value={status} onChange={e => setStatus(e.target.value)}><option value="All">All Status</option><option value="on-time">On Time</option><option value="overrun">Overrun</option></select>
      </div>
      <div className="cnt">Showing {filtered.length} of {MEETINGS.length} meetings</div>
      <div className="list">
        {filtered.length === 0 ? <div className="empty">— No meetings match current filters —</div> : filtered.map(m => <MeetingCard key={m.id} m={m}/>)}
      </div>
    </>
  );
}

function AnomalyPanel() {
  const [search, setSearch] = useState("");
  const [site, setSite]     = useState("All Sites");
  const [sev, setSev]       = useState("All");

  const filtered = useMemo(() => ANOMALIES
    .filter(a => site === "All Sites" || a.site === site)
    .filter(a => sev  === "All" || a.severity === sev)
    .filter(a => !search || [a.room, a.ref, a.title, a.itAdmin.name, a.dept, a.site].some(f => f.toLowerCase().includes(search.toLowerCase())))
  , [search, site, sev]);

  const bySev = s => ANOMALIES.filter(a => a.severity === s).length;
  const totalMats = ANOMALIES.reduce((s, a) => s + a.materials.length, 0);

  return (
    <>
      <div className="pg-hd">
        <div>
          <div className="pg-eye">Leoni Tunisia · Smart Room AI</div>
          <h2 className="pg-ttl"><span className="pg-ico"><FiAlertTriangle size={17}/></span>Anomaly History</h2>
        </div>
        <div className="stats">
          {[["Total", ANOMALIES.length, "#002857"], ["Critical", bySev("critical"), "var(--red)"], ["High", bySev("high"), "var(--orange)"], ["Materials", totalMats, "#0369a1"]].map(([l, v, c]) => (
            <div key={l} className="stat"><div className="stat-v" style={{ color:c }}>{v}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="ctl">
        <div className="sw"><FiSearch size={13} className="si"/><input className="inp" placeholder="Search room, ref, admin, category…" value={search} onChange={e => setSearch(e.target.value)}/></div>
        <select className="sel" value={site}   onChange={e => setSite(e.target.value)}>{SITES.map(s => <option key={s}>{s}</option>)}</select>
        <select className="sel" value={sev}    onChange={e => setSev(e.target.value)}><option value="All">All Severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
      </div>
      <div className="cnt">Showing {filtered.length} of {ANOMALIES.length} anomalies</div>
      <div className="list">
        {filtered.length === 0 ? <div className="empty">— No anomalies match current filters —</div> : filtered.map(a => <AnomalyCard key={a.id} a={a}/>)}
      </div>
    </>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function FM_History() {
  const [tab, setTab] = useState("meetings");
  return (
    <>
      <style>{CSS}</style>
      <div className="pg">
        <div className="tabs">
          <button className={`tab${tab === "meetings" ? " on" : ""}`} onClick={() => setTab("meetings")}>
            <FiClock size={13}/>Meetings<span className="tab-badge">{MEETINGS.length}</span>
          </button>
          <button className={`tab${tab === "anomalies" ? " on" : ""}`} onClick={() => setTab("anomalies")}>
            <FiAlertTriangle size={13}/>Anomalies<span className="tab-badge">{ANOMALIES.length}</span>
          </button>
        </div>
        {tab === "meetings" ? <MeetingPanel/> : <AnomalyPanel/>}
      </div>
    </>
  );
}