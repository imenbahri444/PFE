import { useState, useEffect } from "react";
import {
  FaUsers, FaMapMarkerAlt, FaBuilding, FaThermometerHalf, FaTint,
  FaLightbulb, FaUserFriends, FaExclamationTriangle, FaArrowLeft,
  FaSearch, FaFilter, FaChartLine, FaWifi, FaSyncAlt,
  FaCalendarAlt, FaUserTie
} from "react-icons/fa";
import { MdCo2, MdDevices } from "react-icons/md";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

.rm{padding:24px;background:#f0f4f9;min-height:100vh;font-family:'DM Sans',sans-serif;}
.rm *,.rm *::before,.rm *::after{box-sizing:border-box;}

/* ── List header ── */
.rm-hdr{margin-bottom:20px;}
.rm-hdr h2{color:#1e293b;font-size:1.5rem;font-weight:700;margin:0 0 4px;letter-spacing:-.02em;}
.rm-hdr p{color:#64748b;font-size:.85rem;margin:0;}
.rm-bar{display:flex;gap:12px;margin-bottom:22px;flex-wrap:wrap;}
.rm-sw{position:relative;display:flex;align-items:center;flex:2;min-width:250px;}
.rm-fw{position:relative;display:flex;align-items:center;flex:1;min-width:160px;}
.rm-si,.rm-fi{position:absolute;left:12px;color:#94a3b8;font-size:.8rem;pointer-events:none;}
.rm-inp,.rm-sel{width:100%;height:40px;padding:0 12px 0 36px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.85rem;background:white;transition:all .2s;font-family:'DM Sans',sans-serif;color:#1e293b;}
.rm-sel{appearance:none;cursor:pointer;}
.rm-inp:focus,.rm-sel:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1);}

/* ── Grid ── */
.rm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;}

/* ── Card ── */
.rm-card{background:white;border-radius:16px;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);box-shadow:0 2px 8px rgba(15,23,42,.06),0 0 0 1px rgba(15,23,42,.04);display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease both;}
.rm-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(37,99,235,.14),0 0 0 1px rgba(37,99,235,.12);}
.rm-stripe{height:4px;}
.rm-stripe.available{background:linear-gradient(90deg,#10b981,#34d399);}
.rm-stripe.occupied{background:linear-gradient(90deg,#f59e0b,#fbbf24);}
.rm-inner{padding:16px;display:flex;flex-direction:column;gap:12px;flex:1;}
.rm-chdr{display:flex;justify-content:space-between;align-items:flex-start;}
.rm-chdr-l h3{color:#0f172a;font-size:1rem;font-weight:700;margin:0 0 5px;letter-spacing:-.01em;}
.rm-cid{color:#94a3b8;font-size:.62rem;background:#f1f5f9;padding:2px 7px;border-radius:6px;font-weight:600;letter-spacing:.3px;}
.rm-cap{background:linear-gradient(135deg,#eff6ff,#dbeafe);color:#2563eb;padding:5px 10px;border-radius:20px;font-size:.7rem;font-weight:700;display:flex;align-items:center;gap:4px;border:1px solid #bfdbfe;}
.rm-meta{background:#f8fafc;padding:10px 12px;border-radius:10px;display:flex;flex-direction:column;gap:5px;border:1px solid #f1f5f9;}
.rm-mrow{display:flex;align-items:center;gap:8px;}
.rm-mic{color:#94a3b8;font-size:.72rem;width:14px;flex-shrink:0;}
.rm-mlbl{color:#94a3b8;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px;min-width:36px;}
.rm-mval{color:#475569;font-size:.78rem;font-weight:500;}
.rm-status{display:flex;align-items:center;gap:8px;}
.rm-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.rm-dot.available{background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.15);}
.rm-dot.occupied{background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.15);}
.rm-stxt{color:#1e293b;font-weight:600;font-size:.75rem;text-transform:capitalize;}
.rm-live{margin-left:auto;color:#94a3b8;font-size:.65rem;display:flex;align-items:center;gap:3px;}
.rm-sensors{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #f1f5f9;}
.rm-si2{display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:7px;background:white;border:1px solid #f1f5f9;transition:background .2s;}
.rm-si2:hover{background:#eff6ff;border-color:#bfdbfe;}
.rm-sic{font-size:.75rem;color:#64748b;}
.rm-sv{font-size:.65rem;font-weight:700;color:#1e293b;}
.rm-slbl{font-size:.52rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.3px;}
.rm-comfort{background:linear-gradient(135deg,#f8fafc,#f1f5f9);padding:11px 13px;border-radius:10px;border:1px solid #e9eef2;}
.rm-ctop{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.rm-clbl{color:#64748b;font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px;display:flex;align-items:center;gap:5px;}
.rm-cscore{font-weight:800;font-size:.9rem;}
.rm-cbar-bg{height:5px;background:#e9eef2;border-radius:3px;overflow:hidden;margin-bottom:7px;}
.rm-cbar{height:100%;border-radius:3px;transition:width .5s ease;}
.rm-crow{display:flex;align-items:center;justify-content:space-between;}
.rm-cbadge{padding:3px 10px;border-radius:20px;font-size:.65rem;font-weight:700;}
.rm-cissues{display:flex;align-items:center;gap:4px;font-size:.65rem;color:#ef4444;background:rgba(239,68,68,.08);padding:3px 8px;border-radius:20px;font-weight:600;}
.rm-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f5f9;padding:10px 16px;background:#fafbfc;}
.rm-amenities{display:flex;gap:4px;flex-wrap:wrap;}
.rm-atag{font-size:.58rem;color:#64748b;background:#f1f5f9;padding:2px 7px;border-radius:20px;font-weight:500;border:1px solid #e9eef2;}
.rm-vlink{color:#2563eb;font-size:.72rem;font-weight:600;display:flex;align-items:center;gap:4px;flex-shrink:0;transition:gap .2s;}
.rm-card:hover .rm-vlink{gap:7px;}
.rm-nodata{grid-column:1/-1;text-align:center;padding:48px;background:white;border-radius:16px;color:#64748b;font-size:.9rem;border:2px dashed #e2e8f0;}

/* ── Detail view ── */
.rm-back{display:inline-flex;align-items:center;gap:7px;background:none;border:none;color:#64748b;font-family:'DM Sans',sans-serif;font-size:.85rem;cursor:pointer;padding:0;margin-bottom:22px;transition:color .15s;}
.rm-back:hover{color:#1e293b;}
.rm-detail{background:white;border-radius:20px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);}

.rm-dhero{padding:28px 32px;display:flex;gap:22px;align-items:center;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);position:relative;overflow:hidden;}
.rm-dhero::after{content:'';position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:rgba(37,99,235,.12);pointer-events:none;}
.rm-dav{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;box-shadow:0 8px 24px rgba(0,0,0,.3);}
.rm-dhi{flex:1;}
.rm-dname{font-size:1.5rem;font-weight:700;color:white;margin:0 0 4px;letter-spacing:-.02em;}
.rm-dsub{font-size:.875rem;color:#94a3b8;margin:0 0 10px;}
.rm-dbs{display:flex;gap:8px;flex-wrap:wrap;}
.rm-db{padding:4px 12px;border-radius:20px;font-size:.72rem;font-weight:600;}
.rm-db.avail{background:rgba(16,185,129,.2);color:#34d399;}
.rm-db.occ{background:rgba(245,158,11,.2);color:#fbbf24;}
.rm-db.dept{background:rgba(37,99,235,.25);color:#93c5fd;}
.rm-db.cap{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);}
.rm-dacts{display:flex;gap:8px;flex-shrink:0;}
.rm-dbtn{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;border:1.5px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);transition:all .15s;}
.rm-dbtn:hover{background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.3);}
.rm-dbtn.primary{background:rgba(37,99,235,.5);border-color:rgba(37,99,235,.6);color:white;}
.rm-dbtn.primary:hover{background:rgba(37,99,235,.7);}

.rm-tabs{display:flex;gap:4px;padding:0 24px;border-bottom:1px solid #e8e8e8;background:#f8fafc;}
.rm-tab{padding:12px 18px;border:none;background:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#64748b;border-bottom:2px solid transparent;margin-bottom:-1px;border-radius:4px 4px 0 0;transition:color .15s,border-color .15s;font-weight:500;}
.rm-tab:hover{color:#334155;}
.rm-tab.on{color:#2563eb;border-bottom-color:#2563eb;font-weight:600;}

.rm-dbody{padding:28px 32px;display:grid;grid-template-columns:1fr 1fr;gap:20px;}

.rm-dc{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:16px;padding:20px;}
.rm-dc.full{grid-column:span 2;}
.rm-dct{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin:0 0 16px;}

/* Sensor cards in detail */
.rm-sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;}
.rm-sc{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 10px;border-radius:12px;background:white;border:1.5px solid #e9eef2;text-align:center;transition:all .2s;}
.rm-sc:hover{border-color:#bfdbfe;background:#eff6ff;}
.rm-scic{font-size:1.4rem;}
.rm-scv{font-size:1.1rem;font-weight:700;color:#0f172a;}
.rm-scl{font-size:.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.3px;}
.rm-scu{font-size:.7rem;color:#64748b;font-weight:500;}

/* Comfort in detail */
.rm-cdetail{display:flex;gap:20px;align-items:flex-start;}
.rm-cring{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.rm-cring-in{width:76px;height:76px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;flex-direction:column;}
.rm-cnum{font-size:1.5rem;font-weight:800;line-height:1;}
.rm-cmax{font-size:.6rem;color:#94a3b8;}
.rm-cfactors{display:flex;flex-direction:column;gap:8px;flex:1;}
.rm-cf{display:flex;align-items:center;gap:8px;font-size:.82rem;}
.rm-cfn{color:#475569;flex:1;}
.rm-cfv{font-weight:700;color:#0f172a;min-width:36px;}
.rm-cfs{padding:2px 8px;border-radius:20px;font-size:.68rem;font-weight:600;text-transform:capitalize;}
.rm-cfs.optimal,.rm-cfs.good{background:#dcfce7;color:#166534;}
.rm-cfs.warning{background:#fef9c3;color:#854d0e;}
.rm-cfs.bad,.rm-cfs.critical{background:#fee2e2;color:#991b1b;}

/* Devices in detail */
.rm-devg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.rm-dev{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:white;border-radius:10px;border:1.5px solid #e9eef2;}
.rm-devn{font-size:.85rem;color:#475569;font-weight:500;}
.rm-devs{font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px;}
.rm-devs.on{background:#dcfce7;color:#166534;}
.rm-devs.auto{background:#dbeafe;color:#1d4ed8;}
.rm-devs.open{background:#dcfce7;color:#166534;}
.rm-devs.standby{background:#f1f5f9;color:#64748b;}
.rm-devs.off{background:#fee2e2;color:#991b1b;}

/* Amenities */
.rm-ags{display:flex;flex-wrap:wrap;gap:8px;}
.rm-ag{display:flex;align-items:center;gap:6px;padding:6px 14px;background:white;border-radius:20px;border:1.5px solid #e9eef2;font-size:.8rem;color:#475569;font-weight:500;}

/* Bookings */
.rm-bcard{background:white;border:1.5px solid #e9eef2;border-radius:12px;padding:16px;margin-bottom:12px;}
.rm-btime{font-size:.8rem;font-weight:700;color:#2563eb;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.rm-btitle{font-size:1rem;font-weight:700;color:#0f172a;margin:0 0 4px;}
.rm-bmod{font-size:.8rem;color:#64748b;margin:0 0 12px;display:flex;align-items:center;gap:5px;}
.rm-bst{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;background:#dbeafe;color:#1d4ed8;margin-bottom:12px;}
.rm-batt-hdr{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:8px;}
.rm-batt{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9;}
.rm-batt:last-child{border-bottom:none;}
.rm-battav{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;}
.rm-battn{font-size:.82rem;font-weight:600;color:#0f172a;}
.rm-battr{font-size:.72rem;color:#64748b;}
.rm-battck{margin-left:auto;font-size:.7rem;font-weight:600;color:#10b981;background:#dcfce7;padding:2px 8px;border-radius:20px;}

/* Live dot */
.rm-ldot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pulse 1.4s ease-in-out infinite;display:inline-block;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
@media(max-width:1024px){.rm-dbody{grid-template-columns:1fr;}.rm-dc.full{grid-column:span 1;}}
@media(max-width:900px){.rm-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){.rm-grid{grid-template-columns:1fr;}.rm{padding:14px;}.rm-bar{flex-direction:column;}.rm-sw,.rm-fw{width:100%;}.rm-dhero{flex-wrap:wrap;}.rm-devg{grid-template-columns:1fr;}}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const SENSORS = {
  RM001: { temperature:22.5, humidity:45, co2:450,  light:380, pir:0 },
  RM002: { temperature:23.1, humidity:42, co2:620,  light:250, pir:1 },
  RM003: { temperature:21.8, humidity:48, co2:430,  light:420, pir:0 },
  RM004: { temperature:22.0, humidity:44, co2:820,  light:180, pir:0 },
};
const COMFORT = {
  RM001: { score:8.5, status:"Good",     factors:[{name:"Temperature",status:"optimal",value:"22.5°C"},{name:"Humidity",status:"optimal",value:"45%"},{name:"CO₂",status:"good",value:"450ppm"},{name:"Light",status:"optimal",value:"380lx"}] },
  RM002: { score:6.2, status:"Moderate", factors:[{name:"Temperature",status:"optimal",value:"23.1°C"},{name:"Humidity",status:"good",value:"42%"},{name:"CO₂",status:"warning",value:"620ppm"},{name:"Light",status:"warning",value:"250lx"}] },
  RM003: { score:9.0, status:"Optimal",  factors:[{name:"Temperature",status:"optimal",value:"21.8°C"},{name:"Humidity",status:"optimal",value:"48%"},{name:"CO₂",status:"good",value:"430ppm"},{name:"Light",status:"optimal",value:"420lx"}] },
  RM004: { score:4.5, status:"Poor",     factors:[{name:"Temperature",status:"warning",value:"22.0°C"},{name:"Humidity",status:"good",value:"44%"},{name:"CO₂",status:"critical",value:"820ppm"},{name:"Light",status:"bad",value:"180lx"}] },
};
const DEVICES = {
  RM001: { Lights:"on", HVAC:"auto", Blinds:"open", Projector:"standby" },
  RM002: { Lights:"on", HVAC:"auto", Blinds:"open", Projector:"on" },
  RM003: { Lights:"on", HVAC:"auto", Blinds:"open", Projector:"standby" },
  RM004: { Lights:"off", HVAC:"auto", Blinds:"open", Projector:"standby" },
};
const BOOKINGS = [
  { id:1, title:"Weekly Team Sync",    start:"10:00", end:"12:00", moderator:"Sarah Johnson", status:"confirmed", attendees:[{name:"Sarah Johnson",role:"Moderator",checkin:"09:55"},{name:"Michael Chen",role:"Developer",checkin:"09:58"},{name:"Emma Davis",role:"Designer",checkin:"10:02"}] },
  { id:2, title:"Client Presentation", start:"14:00", end:"15:30", moderator:"John Smith",    status:"confirmed", attendees:[{name:"John Smith",role:"Account Exec",checkin:"13:55"},{name:"Alice Cooper",role:"Client",checkin:"14:00"},{name:"Bob Martin",role:"Client",checkin:"14:02"}] },
];
const ROOMS = [
  { roomId:"RM001", name:"Conference A",        department:"Sales & Marketing", floor:2, capacity:20, status:"Available", amenities:["Projector","Whiteboard","Video Conf","Smart TV"],       location:"Floor 2, East Wing",  emoji:"🏢" },
  { roomId:"RM002", name:"Meeting Room 2",      department:"Engineering",        floor:1, capacity:8,  status:"Occupied",  amenities:["TV Screen","Whiteboard","Video Conf"],                   location:"Floor 1, West Wing",  emoji:"💻" },
  { roomId:"RM003", name:"Training Hall",       department:"HR & Training",      floor:3, capacity:50, status:"Available", amenities:["Projector","Sound System","Stage","Microphones"],        location:"Floor 3, North Wing", emoji:"🎓" },
  { roomId:"RM004", name:"Executive Boardroom", department:"Executive",          floor:4, capacity:16, status:"Available", amenities:["Video Conf","Smart Board","Catering","Privacy Blinds"],  location:"Floor 4, South Wing", emoji:"👔" },
];
const DEPTS = ["All","Sales & Marketing","Engineering","HR & Training","Executive"];
const CC = { Good:"#10b981", Optimal:"#10b981", Moderate:"#f59e0b", Poor:"#ef4444" };

// ─── Component ────────────────────────────────────────────────────────────────
export default function FM_Rooms() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab]           = useState("live");
  const [dept, setDept]         = useState("All");
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [lastUpd, setLastUpd]   = useState(new Date());

  const handleSelect = room => { setSelected(room); setTab("live"); setLoading(true); setTimeout(() => { setLoading(false); setLastUpd(new Date()); }, 800); };

  useEffect(() => {
    if (!selected) return;
    const t = setInterval(() => setLastUpd(new Date()), 30000);
    return () => clearInterval(t);
  }, [selected]);

  const visible = ROOMS.filter(r =>
    (dept === "All" || r.department === dept) &&
    [r.name, r.roomId, r.department].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Detail view ──
  if (selected) {
    const s  = SENSORS[selected.roomId];
    const c  = COMFORT[selected.roomId];
    const dv = DEVICES[selected.roomId];
    const cc = CC[c?.status] || "#64748b";
    const barW = c ? (c.score / 10 * 100).toFixed(0) : 0;
    const st = selected.status.toLowerCase();

    return (
      <>
        <style>{CSS}</style>
        <div className="rm">
          <button className="rm-back" onClick={() => setSelected(null)}><FaArrowLeft /> Back to Rooms</button>
          <div className="rm-detail">

            {/* Hero */}
            <div className="rm-dhero">
              <div className="rm-dav">{selected.emoji}</div>
              <div className="rm-dhi">
                <h2 className="rm-dname">{selected.name}</h2>
                <p className="rm-dsub">{selected.roomId} · {selected.location}</p>
                <div className="rm-dbs">
                  <span className={`rm-db ${st === "available" ? "avail" : "occ"}`}>{selected.status}</span>
                  <span className="rm-db dept">{selected.department}</span>
                  <span className="rm-db cap"><FaUsers style={{fontSize:'.65rem'}} /> {selected.capacity} seats</span>
                </div>
              </div>
              <div className="rm-dacts">
                <div style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>
                  <span className="rm-ldot" /><span>LIVE</span>
                  <span style={{color:"rgba(255,255,255,.3)"}}>· {lastUpd.toLocaleTimeString()}</span>
                  <button className="rm-dbtn" onClick={() => { setLoading(true); setTimeout(()=>{setLoading(false);setLastUpd(new Date());},600); }} style={{marginLeft:4,padding:"6px 10px"}}>
                    <FaSyncAlt style={{fontSize:'.7rem'}} />
                  </button>
                </div>
                <button className="rm-dbtn primary"><FaCalendarAlt /> Book Room</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="rm-tabs">
              {["live","bookings"].map(t => (
                <button key={t} className={`rm-tab${tab===t?" on":""}`} onClick={() => setTab(t)}>
                  {t === "live" ? "Live Status" : "Bookings & Schedule"}
                </button>
              ))}
            </div>

            {/* Body */}
            {loading ? (
              <div style={{padding:"48px",textAlign:"center",color:"#64748b"}}>
                <FaSyncAlt style={{animation:"spin 1s linear infinite",fontSize:"1.5rem",marginBottom:12,display:"block",margin:"0 auto 12px"}} />
                <p style={{margin:0,fontSize:".9rem"}}>Fetching live sensor data…</p>
              </div>
            ) : (
              <div className="rm-dbody">
                {tab === "live" ? (<>
                  {/* Room Info */}
                  <div className="rm-dc">
                    <p className="rm-dct">Room Information</p>
                    {[["Department",selected.department],["Capacity",`${selected.capacity} people`],["Floor",`Floor ${selected.floor}`],["Location",selected.location]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                        <span style={{fontSize:".8rem",color:"#64748b",fontWeight:500}}>{l}</span>
                        <span style={{fontSize:".85rem",color:"#0f172a",fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Comfort */}
                  <div className="rm-dc">
                    <p className="rm-dct">AI Comfort Analysis</p>
                    {c && (
                      <div className="rm-cdetail">
                        <div className="rm-cring" style={{background:`conic-gradient(${cc} 0deg ${c.score*36}deg,#e9eef2 ${c.score*36}deg 360deg)`}}>
                          <div className="rm-cring-in">
                            <span className="rm-cnum" style={{color:cc}}>{c.score}</span>
                            <span className="rm-cmax">/10</span>
                          </div>
                        </div>
                        <div className="rm-cfactors">
                          <div style={{fontSize:".9rem",fontWeight:700,color:cc,marginBottom:4}}>{c.status}</div>
                          {c.factors.map(f => (
                            <div className="rm-cf" key={f.name}>
                              <span className="rm-cfn">{f.name}</span>
                              <span className="rm-cfv">{f.value}</span>
                              <span className={`rm-cfs ${f.status}`}>{f.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Live Sensors */}
                  <div className="rm-dc full">
                    <p className="rm-dct">Live Sensor Data · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Updated {lastUpd.toLocaleTimeString()}</span></p>
                    <div className="rm-sg">
                      {[[<MdCo2 />,            s.co2,         "CO₂",         "ppm"],
                        [<FaThermometerHalf />, s.temperature, "Temperature", "°C"],
                        [<FaTint />,            s.humidity,    "Humidity",    "%"],
                        [<FaLightbulb />,       s.light,       "Light",       "lx"],
                        [<FaUserFriends />,     s.pir?"Yes":"No","Motion",   "PIR"],
                      ].map(([icon,val,lbl,unit]) => (
                        <div className="rm-sc" key={lbl}>
                          <span className="rm-scic">{icon}</span>
                          <span className="rm-scv">{val}</span>
                          <span className="rm-scl">{lbl}</span>
                          <span className="rm-scu">{unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Devices */}
                  <div className="rm-dc">
                    <p className="rm-dct">Device State</p>
                    <div className="rm-devg">
                      {Object.entries(dv).map(([name, state]) => (
                        <div className="rm-dev" key={name}>
                          <span className="rm-devn">{name}</span>
                          <span className={`rm-devs ${state}`}>{state.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="rm-dc">
                    <p className="rm-dct">Amenities</p>
                    <div className="rm-ags">
                      {selected.amenities.map(a => <span key={a} className="rm-ag">✓ {a}</span>)}
                    </div>
                  </div>
                </>) : (<>
                  {/* Bookings */}
                  <div className="rm-dc full">
                    <p className="rm-dct">Today's Meetings</p>
                    {BOOKINGS.map(b => (
                      <div className="rm-bcard" key={b.id}>
                        <div className="rm-btime"><FaCalendarAlt /> {b.start} – {b.end}</div>
                        <h4 className="rm-btitle">{b.title}</h4>
                        <p className="rm-bmod"><FaUserTie /> Moderator: {b.moderator}</p>
                        <span className="rm-bst">{b.status}</span>
                        <div className="rm-batt-hdr">Attendees ({b.attendees.length})</div>
                        {b.attendees.map(a => (
                          <div className="rm-batt" key={a.name}>
                            <div className="rm-battav">{a.name[0]}</div>
                            <div><div className="rm-battn">{a.name}</div><div className="rm-battr">{a.role}</div></div>
                            {a.checkin && <span className="rm-battck">✓ {a.checkin}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>)}
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </>
    );
  }

  // ── List view ──
  return (
    <>
      <style>{CSS}</style>
      <div className="rm">
        <div className="rm-hdr">
          <h2>Rooms & Monitoring</h2>
          <p>Live environmental status and room management</p>
        </div>
        <div className="rm-bar">
          <div className="rm-sw"><FaSearch className="rm-si" /><input className="rm-inp" placeholder="Search by name, ID or department…" value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="rm-fw"><FaFilter className="rm-fi" /><select className="rm-sel" value={dept} onChange={e => setDept(e.target.value)}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
        </div>
        <div className="rm-grid">
          {visible.length === 0 && <div className="rm-nodata">No rooms match your search.</div>}
          {visible.map(room => {
            const s  = SENSORS[room.roomId];
            const c  = COMFORT[room.roomId];
            const st = room.status.toLowerCase();
            const cc = CC[c?.status] || "#64748b";
            return (
              <div key={room.roomId} className="rm-card" onClick={() => handleSelect(room)}>
                <div className={`rm-stripe ${st}`} />
                <div className="rm-inner">
                  <div className="rm-chdr">
                    <div className="rm-chdr-l"><h3>{room.name}</h3><span className="rm-cid">{room.roomId}</span></div>
                    <span className="rm-cap"><FaUsers /> {room.capacity}</span>
                  </div>
                  <div className="rm-meta">
                    <div className="rm-mrow"><FaBuilding className="rm-mic" /><span className="rm-mlbl">Floor</span><span className="rm-mval">{room.floor} — {room.location.split(',')[1]?.trim()}</span></div>
                    <div className="rm-mrow"><FaMapMarkerAlt className="rm-mic" /><span className="rm-mlbl">Dept</span><span className="rm-mval">{room.department}</span></div>
                  </div>
                  <div className="rm-status">
                    <span className={`rm-dot ${st}`} />
                    <span className="rm-stxt">{room.status}</span>
                    <span className="rm-live"><FaWifi style={{fontSize:'.6rem'}} /> Live</span>
                  </div>
                  {s && (
                    <div className="rm-sensors">
                      {[[<MdCo2/>,s.co2,"CO₂"],[<FaThermometerHalf/>,s.temperature,"Temp"],[<FaTint/>,s.humidity,"Hum"],[<FaLightbulb/>,s.light,"Lux"],[<FaUserFriends/>,s.pir?"Yes":"No","PIR"]].map(([icon,val,lbl])=>(
                        <div className="rm-si2" key={lbl} title={lbl}>
                          <span className="rm-sic">{icon}</span>
                          <span className="rm-sv">{val}</span>
                          <span className="rm-slbl">{lbl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {c && (
                    <div className="rm-comfort">
                      <div className="rm-ctop">
                        <span className="rm-clbl"><FaChartLine style={{fontSize:'.7rem'}} /> AI Comfort</span>
                        <span className="rm-cscore" style={{color:cc}}>{c.score}<span style={{fontSize:'.65rem',fontWeight:500,color:'#94a3b8'}}>/10</span></span>
                      </div>
                      <div className="rm-cbar-bg"><div className="rm-cbar" style={{width:`${(c.score/10*100).toFixed(0)}%`,background:`linear-gradient(90deg,${cc}99,${cc})`}} /></div>
                      <div className="rm-crow">
                        <span className="rm-cbadge" style={{background:`${cc}18`,color:cc}}>{c.status}</span>
                        {COMFORT[room.roomId]?.factors?.some(f=>f.status==="bad"||f.status==="critical"||f.status==="warning") && (
                          <span className="rm-cissues"><FaExclamationTriangle style={{fontSize:'.6rem'}} /> Issues</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="rm-foot">
                  <div className="rm-amenities">
                    {room.amenities.slice(0,2).map(a=><span key={a} className="rm-atag">{a}</span>)}
                    {room.amenities.length>2 && <span className="rm-atag">+{room.amenities.length-2}</span>}
                  </div>
                  <span className="rm-vlink">Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}