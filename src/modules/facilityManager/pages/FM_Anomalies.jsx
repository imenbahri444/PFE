import { useState, useEffect } from "react";
import {
  FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaCheckCircle,
  FaClock, FaMapMarkerAlt, FaBuilding, FaWrench, FaTools, FaClipboardList,
  FaArrowLeft, FaSearch, FaBell, FaEnvelope, FaPhone, FaDownload, FaShare
} from "react-icons/fa";
import { MdDevices } from "react-icons/md";

const CSS = `
:root{--bg:#f5f7fb;--card:#fff;--subtle:#f8fafc;--border:#e9eef2;--border-h:#e2e8f0;--tx:#1e293b;--tx2:#475569;--muted:#64748b;--blue:#2563eb;--green:#10b981;--red:#ef4444;--orange:#f97316;--yellow:#eab308;--shadow-sm:0 2px 8px rgba(0,0,0,.04);--shadow-md:0 12px 24px rgba(0,0,0,.08);--r:16px;--r-sm:10px;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.ac{padding:24px;background:var(--bg);min-height:100vh;max-width:1400px;margin:0 auto;}
.ac-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;}
.ac-title{color:var(--tx);font-size:1.8rem;font-weight:700;}
.ac-sub{color:var(--muted);font-size:.95rem;margin-top:4px;}
.hdr-stats{display:flex;gap:20px;background:var(--card);padding:12px 24px;border-radius:12px;box-shadow:var(--shadow-sm);border:1px solid var(--border);}
.stat-item{display:flex;flex-direction:column;align-items:center;min-width:55px;}
.stat-v{font-size:1.5rem;font-weight:700;line-height:1.2;}
.stat-v.critical{color:var(--red);}.stat-v.high{color:var(--orange);}.stat-v.medium{color:var(--yellow);}.stat-v.total{color:var(--blue);}
.stat-l{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-top:2px;}
.filters{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:22px;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow-sm);}
.f-top{display:flex;align-items:center;gap:12px;}
.search{flex:1;position:relative;display:flex;align-items:center;}
.search-ic{position:absolute;left:11px;color:var(--muted);font-size:.8rem;pointer-events:none;}
.search input{width:100%;height:36px;padding:0 32px;border:1px solid var(--border-h);border-radius:8px;font-size:.85rem;background:var(--subtle);color:var(--tx);transition:border-color .2s,box-shadow .2s;}
.search input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1);background:var(--card);}
.search-clr{position:absolute;right:10px;background:none;border:none;color:var(--muted);font-size:1rem;cursor:pointer;line-height:1;transition:color .15s;}
.search-clr:hover{color:var(--tx);}
.f-meta{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.f-count{font-size:.78rem;color:var(--muted);white-space:nowrap;}
.f-reset{font-size:.75rem;color:var(--blue);background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.2);border-radius:6px;padding:3px 10px;cursor:pointer;white-space:nowrap;transition:background .15s;}
.f-reset:hover{background:rgba(37,99,235,.14);}
.f-rows{display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px solid var(--border);}
.f-row{display:flex;align-items:center;gap:10px;min-height:28px;}
.f-row-lbl{font-size:.68rem;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);font-weight:600;min-width:62px;flex-shrink:0;}
.f-pills{display:flex;gap:5px;flex-wrap:wrap;}
.fp{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 11px;border-radius:20px;font-size:.75rem;font-weight:500;background:var(--subtle);border:1px solid var(--border-h);color:var(--muted);cursor:pointer;transition:background .15s,border-color .15s,color .15s;white-space:nowrap;}
.fp:hover{background:#f1f5f9;color:var(--tx);border-color:#cbd5e1;}
.fp.on{background:rgba(37,99,235,.1);border-color:rgba(37,99,235,.35);color:var(--blue);font-weight:600;}
.fp.on[data-val="critical"]{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.3);color:var(--red);}
.fp.on[data-val="high"]{background:rgba(249,115,22,.08);border-color:rgba(249,115,22,.3);color:var(--orange);}
.fp.on[data-val="medium"]{background:rgba(234,179,8,.08);border-color:rgba(234,179,8,.3);color:var(--yellow);}
.fp-dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px;}
.acard{background:var(--card);border-radius:var(--r);padding:20px;cursor:pointer;border:1px solid var(--border);border-left:4px solid transparent;box-shadow:var(--shadow-sm);transition:transform .2s,box-shadow .2s;animation:slideIn .3s ease both;}
.acard:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
.acard.sev-critical{border-left-color:var(--red);}.acard.sev-high{border-left-color:var(--orange);}.acard.sev-medium{border-left-color:var(--yellow);}.acard.sev-low{border-left-color:#94a3b8;}
.acard .ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.sev-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:600;}
.acard.sev-critical .sev-badge{background:rgba(239,68,68,.12);color:var(--red);}
.acard.sev-high .sev-badge{background:rgba(249,115,22,.12);color:var(--orange);}
.acard.sev-medium .sev-badge{background:rgba(234,179,8,.12);color:var(--yellow);}
.st-badge{padding:4px 10px;border-radius:20px;font-size:.68rem;font-weight:600;text-transform:capitalize;}
.st-badge.st-active{background:rgba(239,68,68,.12);color:var(--red);}
.st-badge.st-investigating{background:rgba(249,115,22,.12);color:var(--orange);}
.st-badge.st-pending{background:rgba(234,179,8,.12);color:var(--yellow);}
.st-badge.st-scheduled{background:rgba(37,99,235,.12);color:var(--blue);}
.st-badge.st-resolved{background:rgba(16,185,129,.12);color:var(--green);}
.card-title{color:var(--tx);font-size:.97rem;font-weight:600;margin:0 0 8px;line-height:1.4;}
.card-desc{color:var(--muted);font-size:.84rem;line-height:1.5;margin:0 0 12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.card-loc{display:flex;align-items:center;gap:6px;font-size:.78rem;color:var(--blue);background:var(--subtle);padding:6px 10px;border-radius:8px;margin-bottom:12px;}
.loc-ic{font-size:.72rem;color:var(--muted);}
.card-meta{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #f1f5f9;margin-bottom:10px;}
.meta-t{display:flex;align-items:center;gap:4px;font-size:.72rem;color:var(--muted);}
.meta-r{display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--tx);}
.av-sm{width:20px;height:20px;background:linear-gradient(135deg,var(--blue),#1d4ed8);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:.55rem;font-weight:700;}
.urg-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:#fee2e2;color:var(--red);border-radius:20px;font-size:.68rem;font-weight:600;}
/* Detail */
.detail{background:var(--card);border-radius:20px;padding:28px;box-shadow:var(--shadow-sm);border:1px solid var(--border);animation:slideIn .3s ease both;}
.back-btn{display:inline-flex;align-items:center;gap:8px;background:none;border:none;color:var(--muted);font-size:.88rem;cursor:pointer;padding:6px 0;margin-bottom:20px;transition:color .2s,transform .2s;}
.back-btn:hover{color:var(--blue);transform:translateX(-3px);}
.d-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border-h);}
.d-title-sec{flex:1;}
.d-sev{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:20px;font-size:.82rem;font-weight:600;margin-bottom:12px;}
.d-sev.sev-critical{background:rgba(239,68,68,.12);color:var(--red);}
.d-sev.sev-high{background:rgba(249,115,22,.12);color:var(--orange);}
.d-sev.sev-medium{background:rgba(234,179,8,.12);color:var(--yellow);}
.d-title{color:var(--tx);font-size:1.7rem;font-weight:700;line-height:1.3;}
.d-actions{display:flex;gap:8px;}
.act-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:var(--card);border:1px solid var(--border-h);border-radius:8px;color:var(--tx);font-size:.82rem;cursor:pointer;transition:background .2s,border-color .2s,color .2s;}
.act-btn:hover{background:var(--subtle);border-color:var(--blue);color:var(--blue);}
.d-content{display:grid;grid-template-columns:1fr 350px;gap:22px;}
.d-left,.d-right{display:flex;flex-direction:column;gap:18px;}
.info-s,.info-c{background:var(--subtle);border-radius:var(--r);padding:18px;border:1px solid var(--border-h);}
.info-s h3,.info-c h3{color:var(--tx);font-size:.92rem;font-weight:600;margin-bottom:14px;}
.d-desc{color:var(--tx2);font-size:.93rem;line-height:1.6;}
.loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.dc{display:flex;align-items:center;gap:10px;padding:12px;background:var(--card);border-radius:10px;border:1px solid var(--border-h);}
.dc-ic{font-size:1.1rem;color:var(--blue);flex-shrink:0;}
.dc div{display:flex;flex-direction:column;gap:2px;}
.dc strong{color:var(--tx);font-size:.88rem;}
.dc span{color:var(--muted);font-size:.78rem;}
.mats{display:flex;flex-direction:column;gap:8px;}
.mat{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--card);border-radius:var(--r-sm);border:1px solid var(--border-h);}
.mat.urg{border-left:3px solid var(--red);background:#fef2f2;}
.mat-info strong{color:var(--tx);font-size:.88rem;display:block;}
.mat-info span{color:var(--muted);font-size:.76rem;}
.urg-tag{padding:3px 8px;background:#fee2e2;color:var(--red);border-radius:20px;font-size:.66rem;font-weight:600;}
.acts{display:flex;flex-direction:column;gap:7px;}
.act-item{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--card);border-radius:8px;border:1px solid var(--border-h);font-size:.86rem;color:var(--tx);}
.act-item.done{background:#f0fdf4;border-color:#bbf7d0;}
.act-item.done span{color:#166534;text-decoration:line-through;}
.act-item input{width:15px;height:15px;cursor:default;flex-shrink:0;}
.tl{display:flex;flex-direction:column;gap:10px;}
.tl-item{display:flex;flex-direction:column;gap:2px;padding-bottom:10px;border-bottom:1px dashed var(--border-h);}
.tl-item:last-child{border-bottom:none;padding-bottom:0;}
.tl-item.sched{background:#eff6ff;padding:10px;border-radius:8px;border:1px solid #bfdbfe;}
.tl-lbl{color:var(--muted);font-size:.67rem;text-transform:uppercase;letter-spacing:.4px;}
.tl-val{color:var(--tx);font-size:.87rem;font-weight:500;}
.tl-badge{align-self:flex-start;padding:2px 7px;background:#f1f5f9;color:var(--tx2);border-radius:20px;font-size:.62rem;margin-top:2px;}
.rep{display:flex;gap:14px;align-items:center;}
.av-lg{width:56px;height:56px;background:linear-gradient(135deg,var(--blue),#1d4ed8);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:1.3rem;font-weight:700;flex-shrink:0;}
.rep-info{flex:1;display:flex;flex-direction:column;gap:3px;}
.rep-info strong{color:var(--tx);font-size:.95rem;}
.rep-info>span{color:var(--muted);font-size:.82rem;}
.rep-contact{display:flex;align-items:center;gap:6px;color:var(--tx2);font-size:.78rem;margin-top:3px;}
.assign{display:flex;flex-direction:column;gap:10px;}
.assign-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-h);}
.assign-row:last-child{border-bottom:none;}
.assign-lbl{color:var(--muted);font-size:.83rem;}
.assign-val{color:var(--tx);font-size:.87rem;font-weight:500;}
.st-badge-lg{padding:4px 12px;border-radius:20px;font-size:.78rem;font-weight:600;text-transform:capitalize;}
.st-badge-lg.st-active{background:rgba(239,68,68,.12);color:var(--red);}
.st-badge-lg.st-investigating{background:rgba(249,115,22,.12);color:var(--orange);}
.st-badge-lg.st-pending{background:rgba(234,179,8,.12);color:var(--yellow);}
.st-badge-lg.st-scheduled{background:rgba(37,99,235,.12);color:var(--blue);}
.notes{color:var(--tx2);font-size:.88rem;line-height:1.55;background:var(--card);padding:12px;border-radius:8px;border:1px solid var(--border-h);}
.qa{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.qa-btn{display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;background:var(--card);border:1px solid var(--border-h);border-radius:8px;color:var(--tx);font-size:.78rem;cursor:pointer;transition:background .2s,color .2s,border-color .2s;}
.qa-btn:hover{background:var(--blue);color:#fff;border-color:var(--blue);}
@keyframes slideIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
@media(max-width:1200px){.d-content{grid-template-columns:1fr;}}
@media(max-width:1024px){.ac-hdr{flex-direction:column;align-items:flex-start;gap:14px;}.grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:768px){.ac{padding:14px;}.grid{grid-template-columns:1fr;}.f-top{flex-direction:column;align-items:stretch;}.f-meta{justify-content:space-between;}.d-hdr{flex-direction:column;gap:14px;}.d-actions{width:100%;flex-wrap:wrap;}.act-btn{flex:1;justify-content:center;}.loc-grid{grid-template-columns:1fr;}.rep{flex-direction:column;text-align:center;}.rep-contact{justify-content:center;}.qa{grid-template-columns:1fr;}}
@media(max-width:480px){.hdr-stats{width:100%;justify-content:space-around;}.f-row{flex-wrap:wrap;}}
`;

const INITIAL_DATA = [
  { id:1, title:"CO2 Levels Critical in Conference A", description:"CO2 concentration has exceeded critical threshold of 1000ppm for 30 minutes. Ventilation system may be malfunctioning.", severity:"critical", category:"air-quality", status:"active", location:{roomId:"RM001",roomName:"Conference A",floor:2,department:"Sales & Marketing"}, sensor:{id:"SEN001",type:"CO2 Sensor",currentValue:1240,unit:"ppm",threshold:1000}, detectedAt:"2026-02-23T09:15:00", lastUpdated:"2026-02-23T09:45:00", duration:"30 minutes", reportedBy:{name:"Jean Dupont",role:"IT Administrator",email:"jean.dupont@company.com",phone:"+33 1 23 45 67 89",avatar:"JD"}, assignedTo:"Facility Management", system:"HVAC System", affectedUsers:12, materials:[{name:"HVAC Filter Replacement",quantity:2,unit:"pieces",urgent:true},{name:"CO2 Sensor Calibration Kit",quantity:1,unit:"kit",urgent:false}], actions:[{id:1,description:"Check ventilation system",completed:false},{id:2,description:"Calibrate CO2 sensor",completed:false},{id:3,description:"Increase air exchange rate",completed:true}], notes:"Multiple complaints from employees about stuffy air. Maintenance notified." },
  { id:2, title:"Temperature Sensor Offline - Meeting Room 2", description:"Temperature sensor has stopped reporting data. Possible hardware failure or connection issue.", severity:"high", category:"hardware", status:"investigating", location:{roomId:"RM002",roomName:"Meeting Room 2",floor:1,department:"Engineering"}, sensor:{id:"SEN005",type:"Temperature Sensor",currentValue:null,unit:"°C",threshold:"N/A"}, detectedAt:"2026-02-23T08:30:00", lastUpdated:"2026-02-23T09:30:00", duration:"1 hour", reportedBy:{name:"Marie Martin",role:"IT Administrator",email:"marie.martin@company.com",phone:"+33 1 23 45 67 90",avatar:"MM"}, assignedTo:"IT Support", system:"Sensor Network", affectedUsers:0, materials:[{name:"Temperature Sensor",quantity:1,unit:"piece",urgent:true},{name:"Wireless Module",quantity:1,unit:"piece",urgent:false}], actions:[{id:1,description:"Check sensor connection",completed:false},{id:2,description:"Replace batteries",completed:true},{id:3,description:"Replace sensor if faulty",completed:false}], notes:"Sensor not responding to ping. Network connectivity confirmed." },
  { id:3, title:"Lighting System Malfunction - Training Hall", description:"Three light fixtures not responding to commands. Flickering reported during training session.", severity:"medium", category:"lighting", status:"pending", location:{roomId:"RM003",roomName:"Training Hall",floor:3,department:"HR & Training"}, actuator:{id:"ACT007",type:"Lighting Actuator",status:"faulty"}, detectedAt:"2026-02-23T07:45:00", lastUpdated:"2026-02-23T08:15:00", duration:"1.5 hours", reportedBy:{name:"Pierre Dubois",role:"IT Administrator",email:"pierre.dubois@company.com",phone:"+33 1 23 45 67 91",avatar:"PD"}, assignedTo:"Electrical Maintenance", system:"Lighting Control", affectedUsers:8, materials:[{name:"LED Driver",quantity:3,unit:"pieces",urgent:true},{name:"Light Fixture",quantity:1,unit:"piece",urgent:false}], actions:[{id:1,description:"Check circuit breaker",completed:true},{id:2,description:"Test individual fixtures",completed:false},{id:3,description:"Replace faulty drivers",completed:false}], notes:"Intermittent issue. Happens more frequently during peak usage." },
  { id:4, title:"Projector Bulb Failure - Executive Boardroom", description:"Projector bulb has reached end of life. Replacement needed for upcoming board meeting.", severity:"medium", category:"av-equipment", status:"scheduled", location:{roomId:"RM004",roomName:"Executive Boardroom",floor:4,department:"Executive"}, device:{id:"AV001",type:"Projector",model:"Sony VPL-FHZ60"}, detectedAt:"2026-02-22T16:30:00", lastUpdated:"2026-02-23T09:00:00", duration:"16.5 hours", scheduledFix:"2026-02-24T08:00:00", reportedBy:{name:"Sophie Bernard",role:"IT Administrator",email:"sophie.bernard@company.com",phone:"+33 1 23 45 67 92",avatar:"SB"}, assignedTo:"AV Team", system:"AV Equipment", affectedUsers:6, materials:[{name:"Projector Bulb",quantity:1,unit:"piece",urgent:true},{name:"Air Filter",quantity:1,unit:"piece",urgent:false}], actions:[{id:1,description:"Order replacement bulb",completed:true},{id:2,description:"Schedule maintenance",completed:true},{id:3,description:"Replace bulb",completed:false}], notes:"Board meeting scheduled for 10 AM. Must be fixed before then." },
  { id:5, title:"Network Connectivity Issue - Innovation Hub", description:"WiFi access point in Innovation Hub is experiencing intermittent connectivity. Users reporting dropped connections.", severity:"high", category:"network", status:"investigating", location:{roomId:"RM005",roomName:"Innovation Hub",floor:2,department:"R&D"}, device:{id:"NW001",type:"Access Point",model:"Cisco AP-9152"}, detectedAt:"2026-02-23T08:00:00", lastUpdated:"2026-02-23T09:15:00", duration:"1.25 hours", reportedBy:{name:"Thomas Petit",role:"Network Administrator",email:"thomas.petit@company.com",phone:"+33 1 23 45 67 93",avatar:"TP"}, assignedTo:"Network Team", system:"Network Infrastructure", affectedUsers:15, materials:[{name:"Network Cable Cat6",quantity:1,unit:"box",urgent:false},{name:"Access Point",quantity:1,unit:"piece",urgent:false}], actions:[{id:1,description:"Check switch configuration",completed:false},{id:2,description:"Test signal strength",completed:true},{id:3,description:"Replace access point if faulty",completed:false}], notes:"Issue started after network upgrade. Possibly configuration related." },
  { id:6, title:"Door Lock Malfunction - Quiet Room", description:"Electronic door lock not responding to access cards. Manual override working.", severity:"medium", category:"security", status:"active", location:{roomId:"RM006",roomName:"Quiet Room",floor:1,department:"General"}, device:{id:"SEC001",type:"Electronic Lock",model:"Assa Abloy"}, detectedAt:"2026-02-23T06:30:00", lastUpdated:"2026-02-23T08:45:00", duration:"2.25 hours", reportedBy:{name:"Isabelle Moreau",role:"Security Admin",email:"isabelle.moreau@company.com",phone:"+33 1 23 45 67 94",avatar:"IM"}, assignedTo:"Security Team", system:"Access Control", affectedUsers:4, materials:[{name:"Lock Mechanism",quantity:1,unit:"piece",urgent:false},{name:"Battery Pack",quantity:2,unit:"pieces",urgent:true}], actions:[{id:1,description:"Replace batteries",completed:true},{id:2,description:"Test card reader",completed:true},{id:3,description:"Replace lock mechanism",completed:false}], notes:"Temporary fix applied. Replacement parts ordered." },
];

const SEV_WEIGHT = { critical:3, high:2, medium:1, low:0 };
const SEV_ICON = {
  critical: <FaExclamationCircle />,
  high:     <FaExclamationTriangle />,
  medium:   <FaInfoCircle />,
  low:      <FaInfoCircle />,
};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const timeAgo = d => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  const h = Math.floor(m / 60), days = Math.floor(h / 24);
  if (m < 60) return `${m} minute${m !== 1 ? "s" : ""} ago`;
  if (h < 24) return `${h} hour${h !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

const Pill = ({ val, active, onClick, dot, children }) => (
  <button className={`fp${active ? " on" : ""}`} data-val={val} onClick={onClick}>
    {dot && <i className="fp-dot" style={{ background: dot }} />}
    {children}
  </button>
);

export default function FM_Anomalies() {
  const [anomalies] = useState(() => { try { return JSON.parse(localStorage.getItem("anomalies")) || INITIAL_DATA; } catch { return INITIAL_DATA; } });
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filters, setFilters]   = useState({ severity:"all", status:"all", category:"all", sort:"newest" });

  useEffect(() => { localStorage.setItem("anomalies", JSON.stringify(anomalies)); }, [anomalies]);

  const sf = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const isDirty = filters.severity !== "all" || filters.status !== "all" || filters.category !== "all" || search;
  const reset = () => { setFilters(f => ({ ...f, severity:"all", status:"all", category:"all" })); setSearch(""); };

  const visible = anomalies
    .filter(a => {
      const q = search.toLowerCase();
      return (a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.location.roomName.toLowerCase().includes(q))
        && (filters.severity === "all" || a.severity === filters.severity)
        && (filters.status   === "all" || a.status   === filters.status)
        && (filters.category === "all" || a.category === filters.category);
    })
    .sort((a, b) => {
      if (filters.sort === "severity") return SEV_WEIGHT[b.severity] - SEV_WEIGHT[a.severity];
      if (filters.sort === "oldest")  return new Date(a.detectedAt) - new Date(b.detectedAt);
      return new Date(b.detectedAt) - new Date(a.detectedAt);
    });

  if (!selected) return (
    <>
      <style>{CSS}</style>
      <div className="ac">
        <div className="ac-hdr">
          <div>
            <h1 className="ac-title">System Anomalies</h1>
            <p className="ac-sub">Monitor and manage all system anomalies, sensor failures, and equipment issues</p>
          </div>
          <div className="hdr-stats">
            {["critical","high","medium"].map(k => (
              <div className="stat-item" key={k}>
                <span className={`stat-v ${k}`}>{anomalies.filter(a => a.severity === k).length}</span>
                <span className="stat-l">{cap(k)}</span>
              </div>
            ))}
            <div className="stat-item">
              <span className="stat-v total">{anomalies.length}</span>
              <span className="stat-l">Total</span>
            </div>
          </div>
        </div>

        <div className="filters">
          <div className="f-top">
            <div className="search">
              <FaSearch className="search-ic" />
              <input placeholder="Search anomalies…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="search-clr" onClick={() => setSearch("")}>×</button>}
            </div>
            <div className="f-meta">
              <span className="f-count">{visible.length} of {anomalies.length} results</span>
              {isDirty && <button className="f-reset" onClick={reset}>Clear filters</button>}
            </div>
          </div>
          <div className="f-rows">
            <div className="f-row">
              <span className="f-row-lbl">Severity</span>
              <div className="f-pills">
                <Pill val="all"      active={filters.severity==="all"}      onClick={() => sf("severity","all")}>All</Pill>
                <Pill val="critical" active={filters.severity==="critical"} onClick={() => sf("severity","critical")} dot="#ef4444">Critical</Pill>
                <Pill val="high"     active={filters.severity==="high"}     onClick={() => sf("severity","high")}     dot="#f97316">High</Pill>
                <Pill val="medium"   active={filters.severity==="medium"}   onClick={() => sf("severity","medium")}   dot="#eab308">Medium</Pill>
              </div>
            </div>
            <div className="f-row">
              <span className="f-row-lbl">Status</span>
              <div className="f-pills">
                {["all","active","investigating","pending","scheduled"].map(v => (
                  <Pill key={v} val={v} active={filters.status===v} onClick={() => sf("status",v)}>{v === "all" ? "All" : cap(v)}</Pill>
                ))}
              </div>
            </div>
            <div className="f-row">
              <span className="f-row-lbl">Category</span>
              <div className="f-pills">
                {[["all","All"],["air-quality","Air Quality"],["hardware","Hardware"],["lighting","Lighting"],["av-equipment","AV"],["network","Network"],["security","Security"]].map(([v,l]) => (
                  <Pill key={v} val={v} active={filters.category===v} onClick={() => sf("category",v)}>{l}</Pill>
                ))}
              </div>
            </div>
            <div className="f-row">
              <span className="f-row-lbl">Sort by</span>
              <div className="f-pills">
                {[["newest","Newest"],["oldest","Oldest"],["severity","Severity"]].map(([v,l]) => (
                  <Pill key={v} val={v} active={filters.sort===v} onClick={() => sf("sort",v)}>{l}</Pill>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid">
          {visible.map(a => (
            <div key={a.id} className={`acard sev-${a.severity}`} onClick={() => setSelected(a)}>
              <div className="ch">
                <span className="sev-badge">{SEV_ICON[a.severity]} {cap(a.severity)}</span>
                <span className={`st-badge st-${a.status}`}>{a.status}</span>
              </div>
              <h3 className="card-title">{a.title}</h3>
              <p className="card-desc">{a.description}</p>
              <div className="card-loc"><FaMapMarkerAlt className="loc-ic" />{a.location.roomName} · Floor {a.location.floor}</div>
              <div className="card-meta">
                <div className="meta-t"><FaClock /><span>{timeAgo(a.detectedAt)}</span></div>
                <div className="meta-r"><div className="av-sm">{a.reportedBy.avatar}</div><span>{a.reportedBy.name}</span></div>
              </div>
              {a.materials?.some(m => m.urgent) && <div className="urg-badge"><FaWrench /> Materials Needed</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const a = selected;
  return (
    <>
      <style>{CSS}</style>
      <div className="ac">
        <div className="detail">
          <button className="back-btn" onClick={() => setSelected(null)}><FaArrowLeft /> Back to Anomalies</button>
          <div className="d-hdr">
            <div className="d-title-sec">
              <div className={`d-sev sev-${a.severity}`}>{SEV_ICON[a.severity]} {cap(a.severity)}</div>
              <h2 className="d-title">{a.title}</h2>
            </div>
            <div className="d-actions">
              <button className="act-btn"><FaCheckCircle /> Mark Resolved</button>
              <button className="act-btn"><FaWrench /> Assign to Team</button>
              <button className="act-btn"><FaDownload /> Export</button>
            </div>
          </div>

          <div className="d-content">
            <div className="d-left">
              <div className="info-s"><h3>Description</h3><p className="d-desc">{a.description}</p></div>
              <div className="info-s">
                <h3>Location</h3>
                <div className="loc-grid">
                  <div className="dc"><FaBuilding className="dc-ic" /><div><strong>{a.location.roomName}</strong><span>Room {a.location.roomId}</span></div></div>
                  <div className="dc"><FaMapMarkerAlt className="dc-ic" /><div><strong>Floor {a.location.floor}</strong><span>{a.location.department}</span></div></div>
                </div>
              </div>
              <div className="info-s">
                <h3>Affected System</h3>
                <div className="dc">
                  <MdDevices className="dc-ic" />
                  <div>
                    <strong>{a.system}</strong>
                    {a.sensor   && <span>{a.sensor.type} · Current: {a.sensor.currentValue ?? "N/A"} {a.sensor.unit}</span>}
                    {a.actuator && <span>{a.actuator.type} · Status: {a.actuator.status}</span>}
                    {a.device   && <span>{a.device.type} · Model: {a.device.model}</span>}
                  </div>
                </div>
              </div>
              <div className="info-s">
                <h3>Required Materials</h3>
                <div className="mats">
                  {a.materials.map((m, i) => (
                    <div key={i} className={`mat${m.urgent ? " urg" : ""}`}>
                      <div className="mat-info"><strong>{m.name}</strong><span>Qty: {m.quantity} {m.unit}</span></div>
                      {m.urgent && <span className="urg-tag">Urgent</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="info-s">
                <h3>Action Items</h3>
                <div className="acts">
                  {a.actions.map(act => (
                    <div key={act.id} className={`act-item${act.completed ? " done" : ""}`}>
                      <input type="checkbox" checked={act.completed} readOnly />
                      <span>{act.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-right">
              <div className="info-c">
                <h3>Timeline</h3>
                <div className="tl">
                  {[
                    { label:"Detected",     value:new Date(a.detectedAt).toLocaleString(),  badge:timeAgo(a.detectedAt) },
                    { label:"Last Updated", value:new Date(a.lastUpdated).toLocaleString() },
                    { label:"Duration",     value:a.duration },
                    ...(a.scheduledFix ? [{ label:"Scheduled Fix", value:new Date(a.scheduledFix).toLocaleString(), sched:true }] : [])
                  ].map((t, i) => (
                    <div key={i} className={`tl-item${t.sched ? " sched" : ""}`}>
                      <span className="tl-lbl">{t.label}</span>
                      <span className="tl-val">{t.value}</span>
                      {t.badge && <span className="tl-badge">{t.badge}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="info-c">
                <h3>Reporter</h3>
                <div className="rep">
                  <div className="av-lg">{a.reportedBy.avatar}</div>
                  <div className="rep-info">
                    <strong>{a.reportedBy.name}</strong>
                    <span>{a.reportedBy.role}</span>
                    <div className="rep-contact"><FaEnvelope /> {a.reportedBy.email}</div>
                    <div className="rep-contact"><FaPhone /> {a.reportedBy.phone}</div>
                  </div>
                </div>
              </div>
              <div className="info-c">
                <h3>Assignment</h3>
                <div className="assign">
                  <div className="assign-row"><span className="assign-lbl">Assigned To</span><span className="assign-val">{a.assignedTo}</span></div>
                  <div className="assign-row"><span className="assign-lbl">Affected Users</span><span className="assign-val">{a.affectedUsers}</span></div>
                  <div className="assign-row"><span className="assign-lbl">Status</span><span className={`st-badge-lg st-${a.status}`}>{a.status}</span></div>
                </div>
              </div>
              <div className="info-c"><h3>Notes</h3><p className="notes">{a.notes}</p></div>
              <div className="info-c">
                <h3>Quick Actions</h3>
                <div className="qa">
                  {[[<FaBell />, "Notify Team"], [<FaClipboardList />, "Add Note"], [<FaTools />, "Order Materials"], [<FaShare />, "Share"]].map(([icon, label]) => (
                    <button key={label} className="qa-btn">{icon} {label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}