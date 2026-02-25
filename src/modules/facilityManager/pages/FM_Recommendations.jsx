import { useState, useMemo } from "react";
import {
  FiWind, FiThermometer, FiSettings, FiLayers, FiBriefcase,
  FiMapPin, FiSearch, FiChevronDown, FiCheck, FiX, FiRotateCcw,
  FiAlertTriangle, FiArrowUpRight, FiClock, FiSliders,
} from "react-icons/fi";
import { TbBuildingFactory2 } from "react-icons/tb";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DATA = [
  { id:1, room:"Boardroom A",    floor:"Floor 2", department:"Management",   site:"Leoni Mateur",      type:"CO2",         priority:"critical", co2:1420, temp:26.4, hvac:34, message:"CO₂ levels critical — reduce occupancy or boost ventilation immediately.", status:"Pending",  time:"2 min ago"  },
  { id:2, room:"Meeting Room 3", floor:"Floor 1", department:"Engineering",  site:"Leoni Sousse",      type:"Temperature", priority:"high",     co2:890,  temp:23.8, hvac:61, message:"Temperature 2.3°C above comfort threshold. Recommend cooling adjustment.",   status:"Pending",  time:"5 min ago"  },
  { id:3, room:"Executive Suite",floor:"Floor 3", department:"Executive",    site:"Leoni Bir Mcherga", type:"CO2",         priority:"medium",   co2:1050, temp:22.1, hvac:55, message:"CO₂ trending upward. Proactive ventilation advised before next session.",   status:"Accepted", time:"12 min ago" },
  { id:4, room:"Innovation Lab", floor:"Ground",  department:"R&D",          site:"Leoni Mateur",      type:"HVAC",        priority:"low",      co2:620,  temp:21.5, hvac:88, message:"HVAC efficiency at 88% — schedule preventive maintenance within 7 days.",   status:"Pending",  time:"18 min ago" },
  { id:5, room:"Training Room B",floor:"Floor 1", department:"HR & Training",site:"Leoni Sousse",      type:"Temperature", priority:"medium",   co2:760,  temp:24.9, hvac:72, message:"Slight temperature variance detected. Minor HVAC recalibration suggested.", status:"Rejected", time:"31 min ago" },
  { id:6, room:"Focus Pod 2",    floor:"Floor 2", department:"Quality",      site:"Leoni Bir Mcherga", type:"CO2",         priority:"high",     co2:1180, temp:23.0, hvac:45, message:"Single-occupancy room showing high CO₂ — check ventilation duct.",         status:"Pending",  time:"44 min ago" },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const PRIORITY = {
  critical: { color:"#dc2626", bg:"#fef2f2", border:"#fecaca", label:"CRITICAL" },
  high:     { color:"#ea580c", bg:"#fff7ed", border:"#fed7aa", label:"HIGH"     },
  medium:   { color:"#ca8a04", bg:"#fefce8", border:"#fde68a", label:"MEDIUM"   },
  low:      { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", label:"LOW"      },
};
const STATUS = {
  Pending:  { color:"#64748b", dot:"#94a3b8", bg:"#f8fafc", border:"#e2e8f0" },
  Accepted: { color:"#16a34a", dot:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0" },
  Rejected: { color:"#dc2626", dot:"#ef4444", bg:"#fef2f2", border:"#fecaca" },
};
const TYPE_ICON = {
  CO2:         <FiWind        size={14} />,
  Temperature: <FiThermometer size={14} />,
  HVAC:        <FiSettings    size={14} />,
};
const PORDER   = { critical:0, high:1, medium:2, low:3 };
const FTYPES   = ["All","CO2","Temperature","HVAC"];
const FSTATUS  = ["All","Pending","Accepted","Rejected"];
const FSITES   = ["All Sites","Leoni Mateur","Leoni Sousse","Leoni Bir Mcherga"];
const SORTS    = ["Priority","CO2 ↑","Temp ↑","HVAC ↓"];

// ─── Shared styles ────────────────────────────────────────────────────────────
const mono = { fontFamily:"'SF Mono','Fira Code',monospace" };
const btnStyle = (color, ghost=false) => ({
  display:"inline-flex", alignItems:"center", gap:5,
  padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer",
  border:`1px solid ${color}`, background: ghost ? "transparent" : `${color}18`,
  color, transition:"background 0.15s",
});
const selectStyle = {
  background:"#fff", border:"1px solid #e2e8f0", borderRadius:7,
  padding:"7px 10px", color:"#475569", fontSize:11, outline:"none",
  cursor:"pointer", ...mono, boxShadow:"0 1px 2px rgba(0,0,0,0.04)",
};

// ─── Gauge ────────────────────────────────────────────────────────────────────
function Gauge({ value, max, label, unit, warn, danger }) {
  const pct   = Math.min(value / max, 1);
  const color = value >= danger ? "#dc2626" : value >= warn ? "#ea580c" : "#16a34a";
  return (
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#94a3b8", marginBottom:4, ...mono }}>
        <span style={{ textTransform:"uppercase", letterSpacing:0.5 }}>{label}</span>
        <span style={{ color, fontWeight:700 }}>{value}{unit}</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"#e2e8f0", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct*100}%`, background:color, borderRadius:99, transition:"width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ─── Meta chip ────────────────────────────────────────────────────────────────
function Chip({ icon, label, color="#475569", bg="#f1f5f9", border="#e2e8f0" }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, color, background:bg, border:`1px solid ${border}`, borderRadius:5, padding:"3px 8px", whiteSpace:"nowrap" }}>
      <span style={{ opacity:0.7, display:"flex" }}>{icon}</span>
      {label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function RecCard({ rec, onDecision }) {
  const [open, setOpen] = useState(false);
  const p = PRIORITY[rec.priority];
  const s = STATUS[rec.status];

  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background:"#fff", border:"1px solid #e2e8f0",
        borderLeft:`3px solid ${p.color}`, borderRadius:10,
        padding:"14px 16px", cursor:"pointer", userSelect:"none",
        boxShadow: open
          ? `0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px ${p.color}28`
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition:"box-shadow 0.2s",
      }}
    >
      {/* ── Row 1: title + badges ── */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        <span style={{ color:p.color, display:"flex", flexShrink:0 }}>{TYPE_ICON[rec.type]}</span>
        <span style={{ fontWeight:700, fontSize:14, color:"#0f172a", flex:1, letterSpacing:-0.2 }}>{rec.room}</span>

        {/* Priority badge */}
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.8, color:p.color, background:p.bg, border:`1px solid ${p.border}`, borderRadius:4, padding:"2px 8px", ...mono }}>
          {p.label}
        </span>

        {/* Status badge */}
        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:s.color, background:s.bg, border:`1px solid ${s.border}`, borderRadius:4, padding:"2px 8px", ...mono }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0, display:"inline-block" }} />
          {rec.status}
        </span>

        {/* Time */}
        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#cbd5e1", ...mono }}>
          <FiClock size={10} />{rec.time}
        </span>

        {/* Chevron */}
        <FiChevronDown size={14} color="#cbd5e1" style={{ transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "none", flexShrink:0 }} />
      </div>

      {/* ── Row 2: room meta ── */}
      <div style={{ display:"flex", gap:6, marginTop:9, flexWrap:"wrap" }}>
        <Chip icon={<FiLayers size={11}/>}              label={rec.floor}      color="#475569" bg="#f8fafc"  border="#e2e8f0" />
        <Chip icon={<FiBriefcase size={11}/>}           label={rec.department} color="#4338ca" bg="#eef2ff"  border="#c7d2fe" />
        <Chip icon={<TbBuildingFactory2 size={11}/>}    label={rec.site}       color="#0369a1" bg="#f0f9ff"  border="#bae6fd" />
      </div>

      {/* ── Row 3: sensor gauges ── */}
      <div style={{ display:"flex", gap:14, marginTop:11 }}>
        <Gauge value={rec.co2}  max={1600} label="CO₂"  unit=" ppm" warn={1000} danger={1300} />
        <Gauge value={rec.temp} max={30}   label="Temp"  unit="°C"  warn={24}   danger={26}   />
        <Gauge value={rec.hvac} max={100}  label="HVAC"  unit="%"   warn={75}   danger={90}   />
      </div>

      {/* ── Expanded panel ── */}
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#f8fafc", borderRadius:7, padding:"10px 12px", borderLeft:`3px solid ${p.color}`, marginBottom:12 }}>
            <FiAlertTriangle size={14} color={p.color} style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ margin:0, fontSize:13, color:"#475569", lineHeight:1.6 }}>{rec.message}</p>
          </div>

          <div style={{ display:"flex", gap:8 }} onClick={e => e.stopPropagation()}>
            {rec.status === "Pending" ? (
              <>
                <button onClick={() => onDecision(rec.id, "Accepted")} style={btnStyle("#16a34a")}>
                  <FiCheck size={12} /> Accept
                </button>
                <button onClick={() => onDecision(rec.id, "Rejected")} style={btnStyle("#dc2626")}>
                  <FiX size={12} /> Reject
                </button>
              </>
            ) : (
              <button onClick={() => onDecision(rec.id, "Pending")} style={btnStyle("#94a3b8", true)}>
                <FiRotateCcw size={12} /> Reset to Pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pill toggle group ────────────────────────────────────────────────────────
function PillGroup({ options, active, onChange }) {
  return (
    <div style={{ display:"flex", background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:7, padding:2, gap:2 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding:"5px 10px", fontSize:11, fontWeight: active===o ? 700 : 400,
          background: active===o ? "#fff" : "transparent",
          color: active===o ? "#0f172a" : "#64748b",
          border:"none", cursor:"pointer", ...mono, borderRadius:5,
          boxShadow: active===o ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          transition:"all 0.15s",
        }}>{o}</button>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FM_Recommendations() {
  const [recs,         setRecs]         = useState(DATA);
  const [filterType,   setFilterType]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSite,   setFilterSite]   = useState("All Sites");
  const [sortBy,       setSortBy]       = useState("Priority");
  const [search,       setSearch]       = useState("");

  const handle = (id, dec) => setRecs(r => r.map(x => x.id===id ? {...x, status:dec} : x));

  const visible = useMemo(() => {
    let r = recs
      .filter(r => filterType   === "All"       || r.type   === filterType)
      .filter(r => filterStatus === "All"        || r.status === filterStatus)
      .filter(r => filterSite   === "All Sites"  || r.site   === filterSite)
      .filter(r => !search || [r.room, r.department, r.site, r.message].some(f => f.toLowerCase().includes(search.toLowerCase())));
    const s = sortBy;
    if (s==="Priority") r = [...r].sort((a,b) => PORDER[a.priority]-PORDER[b.priority]);
    if (s==="CO2 ↑")   r = [...r].sort((a,b) => b.co2 -a.co2);
    if (s==="Temp ↑")  r = [...r].sort((a,b) => b.temp-a.temp);
    if (s==="HVAC ↓")  r = [...r].sort((a,b) => a.hvac-b.hvac);
    return r;
  }, [recs, filterType, filterStatus, filterSite, sortBy, search]);

  const counts = {
    pending:  recs.filter(r => r.status==="Pending").length,
    critical: recs.filter(r => r.priority==="critical").length,
    accepted: recs.filter(r => r.status==="Accepted").length,
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", padding:"24px 20px", color:"#0f172a" }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:2, color:"#94a3b8", ...mono, marginBottom:5, textTransform:"uppercase" }}>
            Leoni Tunisia · Smart Room AI Engine
          </div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"#0f172a", letterSpacing:-0.5, display:"flex", alignItems:"center", gap:8 }}>
            <FiArrowUpRight size={18} color="#4338ca" />
            AI Recommendations
          </h2>
        </div>

        {/* Stat chips */}
        <div style={{ display:"flex", gap:8 }}>
          {[
            ["Pending",  counts.pending,  "#ea580c","#fff7ed","#fed7aa"],
            ["Critical", counts.critical, "#dc2626","#fef2f2","#fecaca"],
            ["Accepted", counts.accepted, "#16a34a","#f0fdf4","#bbf7d0"],
          ].map(([label, val, color, bg, border]) => (
            <div key={label} style={{ textAlign:"center", background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 14px", minWidth:60 }}>
              <div style={{ fontSize:18, fontWeight:700, color, ...mono, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8, alignItems:"center" }}>

        {/* Search */}
        <div style={{ position:"relative", flex:"1 1 180px" }}>
          <FiSearch size={13} color="#94a3b8" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
          <input
            placeholder="Search rooms, departments, sites…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", boxSizing:"border-box", background:"#fff", border:"1px solid #e2e8f0", borderRadius:7, padding:"7px 12px 7px 30px", color:"#0f172a", fontSize:12, outline:"none", boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}
          />
        </div>

        <PillGroup options={FTYPES}  active={filterType}   onChange={setFilterType}   />
        <PillGroup options={FSTATUS} active={filterStatus} onChange={setFilterStatus} />

        {/* Site filter */}
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <FiMapPin size={11} color="#94a3b8" style={{ position:"absolute", left:9, pointerEvents:"none" }} />
          <select value={filterSite} onChange={e => setFilterSite(e.target.value)} style={{ ...selectStyle, paddingLeft:24 }}>
            {FSITES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <FiSliders size={11} color="#94a3b8" style={{ position:"absolute", left:9, pointerEvents:"none" }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...selectStyle, paddingLeft:24 }}>
            {SORTS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize:11, color:"#94a3b8", ...mono, marginBottom:12 }}>
        Showing {visible.length} of {recs.length} recommendations
      </div>

      {/* ── Cards ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {visible.length === 0
          ? (
            <div style={{ textAlign:"center", color:"#cbd5e1", padding:"48px 0", fontSize:13, ...mono }}>
              — No recommendations match current filters —
            </div>
          )
          : visible.map(rec => <RecCard key={rec.id} rec={rec} onDecision={handle} />)
        }
      </div>
    </div>
  );
}