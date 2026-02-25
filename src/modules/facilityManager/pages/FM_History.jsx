import { useState, useMemo } from "react";
import {
  FiClock, FiUsers, FiSearch, FiChevronDown, FiUser, FiHash,
  FiThermometer, FiWind, FiSettings, FiSun, FiAlertTriangle,
  FiCheckCircle, FiArrowRight, FiAlertCircle, FiTag, FiBox,
  FiMapPin, FiBookmark, FiFilter,
} from "react-icons/fi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .hi { min-height:100vh; background:#f8fafc; padding:28px 24px; font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; }

  .hi-hd { display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:24px; }
  .hi-ey { font-size:10px;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:6px; }
  .hi-ttl { margin:0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-.5px;display:flex;align-items:center;gap:10px; }
  .hi-tico { width:36px;height:36px;background:linear-gradient(135deg,#002857,#0064c8);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0; }

  .hi-stats { display:flex;gap:10px;flex-wrap:wrap; }
  .hi-stat { background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 16px;text-align:center;min-width:68px;box-shadow:0 1px 3px rgba(0,0,0,.05); }
  .hi-sv { font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace;line-height:1; }
  .hi-sl { font-size:10px;color:#94a3b8;margin-top:4px;text-transform:uppercase;letter-spacing:.4px; }

  .hi-ctl { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center; }
  .hi-sw  { position:relative;flex:1 1 200px; }
  .hi-si  { position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none; }
  .hi-inp { width:100%;box-sizing:border-box;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px 8px 32px;font-size:13px;color:#0f172a;outline:none;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 1px 2px rgba(0,0,0,.04);transition:border-color .15s; }
  .hi-inp:focus { border-color:#00b2ff;box-shadow:0 0 0 3px rgba(0,178,255,.1); }
  .hi-sel { background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;font-size:12px;color:#475569;outline:none;cursor:pointer;font-family:'JetBrains Mono',monospace;box-shadow:0 1px 2px rgba(0,0,0,.04); }
  .hi-cnt { font-size:11px;color:#94a3b8;font-family:'JetBrains Mono',monospace;margin-bottom:12px; }

  .hi-list { display:flex;flex-direction:column;gap:10px; }

  .hi-card { background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05);transition:box-shadow .2s;cursor:pointer; }
  .hi-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.09); }
  .hi-card.op { box-shadow:0 6px 28px rgba(0,40,87,.12); }

  .hi-ch { display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:14px 16px; }

  .hi-ref { background:linear-gradient(135deg,#002857,#0064c8);color:#fff;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;padding:4px 10px;border-radius:6px;white-space:nowrap;letter-spacing:.5px; }

  .hi-cm { display:flex;flex-direction:column;gap:5px;overflow:hidden; }
  .hi-crm { font-weight:700;font-size:15px;color:#0f172a;letter-spacing:-.2px; }
  .hi-chips { display:flex;gap:5px;flex-wrap:wrap; }
  .hi-chip { display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 8px;border-radius:5px;white-space:nowrap;font-weight:500; }

  .hi-cr { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
  .hi-tb { display:flex;align-items:center;gap:5px;font-size:12px;font-family:'JetBrains Mono',monospace;color:#475569;white-space:nowrap; }
  .hi-or { font-size:10px;font-weight:700;color:#dc2626;background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:2px 7px;font-family:'JetBrains Mono',monospace; }
  .hi-ok { font-size:10px;font-weight:700;color:#16a34a;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:2px 7px;font-family:'JetBrains Mono',monospace; }
  .hi-cv { color:#cbd5e1;transition:transform .2s; }
  .hi-card.op .hi-cv { transform:rotate(180deg); }

  .hi-body { border-top:1px solid #f1f5f9;padding:0 16px 16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;animation:exi .2s ease; }
  @keyframes exi { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }

  .hi-st { font-size:10px;font-weight:700;letter-spacing:1px;color:#94a3b8;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin:14px 0 8px;display:flex;align-items:center;gap:6px; }

  /* Timing rows */
  .hi-trow { display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px; }
  .hi-tl { color:#64748b; }
  .hi-tv { font-family:'JetBrains Mono',monospace;font-weight:600;color:#0f172a; }

  /* Env */
  .hi-eg { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
  .hi-ec { background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px; }
  .hi-el { font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace;margin-bottom:4px;display:flex;align-items:center;gap:5px; }
  .hi-ev { font-size:15px;font-weight:700;font-family:'JetBrains Mono',monospace; }
  .hi-eb { height:3px;border-radius:99px;background:#e2e8f0;margin-top:5px;overflow:hidden; }
  .hi-ef { height:100%;border-radius:99px;transition:width .6s ease; }

  /* Moderator */
  .hi-mod { background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:9px;padding:12px 14px;display:flex;align-items:center;gap:12px; }
  .hi-mav { width:38px;height:38px;background:linear-gradient(135deg,#002857,#0064c8);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0; }
  .hi-mn { font-weight:700;font-size:13px;color:#0f172a; }
  .hi-ms { font-size:11px;color:#64748b;font-family:'JetBrains Mono',monospace; }

  /* Notes */
  .hi-note { background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:10px 12px;font-size:12px;color:#713f12;line-height:1.55; }

  /* Full width */
  .hi-fw { grid-column:1 / -1; }

  /* Guest table */
  .hi-gt { width:100%;border-collapse:collapse; }
  .hi-gt th { text-align:left;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:.4px;text-transform:uppercase;padding:4px 8px;font-family:'JetBrains Mono',monospace;border-bottom:1px solid #f1f5f9; }
  .hi-gt td { font-size:12px;color:#334155;padding:7px 8px;border-bottom:1px solid #f8fafc;vertical-align:middle; }
  .hi-gt tr:last-child td { border-bottom:none; }
  .hi-gid { font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;background:#f8fafc;padding:2px 6px;border-radius:4px; }
  .ci-ok   { color:#16a34a;font-family:'JetBrains Mono',monospace;font-size:11px; }
  .ci-late { color:#dc2626;font-family:'JetBrains Mono',monospace;font-size:11px; }

  .hi-empty { text-align:center;color:#cbd5e1;padding:60px 0;font-size:13px;font-family:'JetBrains Mono',monospace; }
`;

const MEETINGS = [
  {
    id:"M-2401", ref:"REF-20240125-01",
    room:"Boardroom A", floor:"Floor 2", dept:"Management", site:"Leoni Mateur",
    date:"2024-01-25", bStart:"10:00", bEnd:"11:30", aEnd:"11:48",
    dur:108, bDur:90, mod:{ name:"Amira Ben Salah", id:"U-0041", ini:"AB" }, status:"overrun",
    env:{ co2:1180, temp:25.8, hvac:62, light:78 },
    guests:[
      { name:"Karim Mansouri",  id:"U-0082", ci:"09:58", role:"Guest",   late:false },
      { name:"Safa Trabelsi",   id:"U-0113", ci:"10:03", role:"Guest",   late:false },
      { name:"Mehdi Chaabane",  id:"U-0095", ci:"10:14", role:"Guest",   late:true  },
      { name:"Lina Hamdi",      id:"U-0077", ci:"10:01", role:"Co-host", late:false },
    ],
    note:"AC malfunctioned mid-session. Maintenance notified.",
  },
  {
    id:"M-2398", ref:"REF-20240125-02",
    room:"Meeting Room 3", floor:"Floor 1", dept:"Engineering", site:"Leoni Sousse",
    date:"2024-01-25", bStart:"09:00", bEnd:"10:00", aEnd:"09:58",
    dur:58, bDur:60, mod:{ name:"Youssef Gharbi", id:"U-0031", ini:"YG" }, status:"on-time",
    env:{ co2:760, temp:22.4, hvac:71, light:85 },
    guests:[
      { name:"Rim Boujnah",  id:"U-0054", ci:"08:57", role:"Guest", late:false },
      { name:"Anis Belhaj",  id:"U-0066", ci:"09:02", role:"Guest", late:false },
      { name:"Noura Khelil", id:"U-0049", ci:"09:00", role:"Guest", late:false },
    ],
    note:"",
  },
  {
    id:"M-2391", ref:"REF-20240124-05",
    room:"Executive Suite", floor:"Floor 3", dept:"Executive", site:"Leoni Bir Mcherga",
    date:"2024-01-24", bStart:"14:00", bEnd:"15:00", aEnd:"15:22",
    dur:82, bDur:60, mod:{ name:"Chadi Fekih", id:"U-0010", ini:"CF" }, status:"overrun",
    env:{ co2:940, temp:23.1, hvac:58, light:90 },
    guests:[
      { name:"Ines Dridi",    id:"U-0021", ci:"14:00", role:"Guest",   late:false },
      { name:"Ramzi Louati",  id:"U-0038", ci:"14:07", role:"Guest",   late:true  },
      { name:"Manel Zribi",   id:"U-0056", ci:"13:58", role:"Co-host", late:false },
      { name:"Tarek Ben Ali", id:"U-0071", ci:"14:02", role:"Guest",   late:false },
      { name:"Amal Jebali",   id:"U-0083", ci:"14:11", role:"Guest",   late:true  },
    ],
    note:"Extended by executive decision. CO₂ flagged high near end.",
  },
  {
    id:"M-2385", ref:"REF-20240124-02",
    room:"Innovation Lab", floor:"Ground", dept:"R&D", site:"Leoni Mateur",
    date:"2024-01-24", bStart:"11:00", bEnd:"12:00", aEnd:"12:01",
    dur:61, bDur:60, mod:{ name:"Sarra Mejri", id:"U-0028", ini:"SM" }, status:"on-time",
    env:{ co2:580, temp:21.3, hvac:82, light:72 },
    guests:[
      { name:"Omar Saidi",    id:"U-0092", ci:"10:59", role:"Guest", late:false },
      { name:"Hajer Belghith",id:"U-0101", ci:"11:04", role:"Guest", late:true  },
    ],
    note:"",
  },
];

const ec = (v,w,d) => v>=d?"#dc2626":v>=w?"#ea580c":"#16a34a";
const ew = (v,max) => `${Math.min(v/max,1)*100}%`;

function EnvCard({ icon, label, value, unit, warn, danger, max }) {
  const c = ec(value,warn,danger);
  return (
    <div className="hi-ec">
      <div className="hi-el">{icon}{label}</div>
      <div className="hi-ev" style={{color:c}}>{value}<span style={{fontSize:10,fontWeight:400,color:"#94a3b8"}}>{unit}</span></div>
      <div className="hi-eb"><div className="hi-ef" style={{width:ew(value,max),background:c}}/></div>
    </div>
  );
}

function Card({ m }) {
  const [open, setOpen] = useState(false);
  const overrun = m.dur - m.bDur;
  return (
    <div className={`hi-card${open?" op":""}`} onClick={()=>setOpen(v=>!v)}>
      <div className="hi-ch">
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <span className="hi-ref">{m.ref}</span>
          <span style={{fontSize:10,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>{m.date}</span>
        </div>

        <div className="hi-cm">
          <span className="hi-crm">{m.room}</span>
          <div className="hi-chips">
            <span className="hi-chip" style={{background:"#f8fafc",color:"#475569",border:"1px solid #e2e8f0"}}><FiTag size={10}/>{m.floor}</span>
            <span className="hi-chip" style={{background:"#eef2ff",color:"#4338ca",border:"1px solid #c7d2fe"}}><FiBookmark size={10}/>{m.dept}</span>
            <span className="hi-chip" style={{background:"#f0f9ff",color:"#0369a1",border:"1px solid #bae6fd"}}><FiMapPin size={10}/>{m.site}</span>
          </div>
        </div>

        <div className="hi-cr">
          <div className="hi-tb"><FiClock size={11}/>{m.bStart}<FiArrowRight size={10}/>{m.aEnd}</div>
          {m.status==="overrun"
            ? <span className="hi-or">+{overrun} min overrun</span>
            : <span className="hi-ok">On Time</span>
          }
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#64748b"}}><FiUsers size={11}/>{m.guests.length} guests</div>
          <FiChevronDown size={16} className="hi-cv"/>
        </div>
      </div>

      {open && (
        <div className="hi-body" onClick={e=>e.stopPropagation()}>

          <div>
            <div className="hi-st"><FiUser size={11}/>Moderator</div>
            <div className="hi-mod">
              <div className="hi-mav">{m.mod.ini}</div>
              <div>
                <div className="hi-mn">{m.mod.name}</div>
                <div className="hi-ms">ID {m.mod.id} · Moderator</div>
              </div>
            </div>
          </div>

          <div>
            <div className="hi-st"><FiClock size={11}/>Session Timing</div>
            {[
              ["Booked Start",     m.bStart],
              ["Booked End",       m.bEnd],
              ["Actual End",       m.aEnd],
              ["Booked Duration",  `${m.bDur} min`],
              ["Actual Duration",  `${m.dur} min`],
              ["Overrun",          overrun>0?`+${overrun} min`:"None"],
            ].map(([l,v])=>(
              <div key={l} className="hi-trow">
                <span className="hi-tl">{l}</span>
                <span className="hi-tv" style={{color:l==="Overrun"&&overrun>0?"#dc2626":"#0f172a"}}>{v}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="hi-st"><FiSettings size={11}/>Room Environment</div>
            <div className="hi-eg">
              <EnvCard icon={<FiWind size={10}/>}        label="CO₂"     value={m.env.co2}   unit=" ppm" warn={1000} danger={1300} max={1600}/>
              <EnvCard icon={<FiThermometer size={10}/>} label="Temp"    value={m.env.temp}  unit="°C"   warn={24}   danger={26}   max={30}  />
              <EnvCard icon={<FiSettings size={10}/>}    label="HVAC"    value={m.env.hvac}  unit="%"    warn={75}   danger={90}   max={100} />
              <EnvCard icon={<FiSun size={10}/>}         label="Lighting"value={m.env.light} unit="%"    warn={90}   danger={95}   max={100} />
            </div>
          </div>

          {m.note && (
            <div>
              <div className="hi-st"><FiAlertCircle size={11}/>FM Notes</div>
              <div className="hi-note">{m.note}</div>
            </div>
          )}

          <div className="hi-fw">
            <div className="hi-st"><FiUsers size={11}/>Attendees ({m.guests.length})</div>
            <table className="hi-gt">
              <thead>
                <tr><th>Name</th><th>User ID</th><th>Role</th><th>Check-In</th><th>Status</th></tr>
              </thead>
              <tbody>
                {m.guests.map(g=>(
                  <tr key={g.id}>
                    <td style={{fontWeight:600,color:"#0f172a"}}>{g.name}</td>
                    <td><span className="hi-gid">{g.id}</span></td>
                    <td style={{color:"#64748b"}}>{g.role}</td>
                    <td><span className={g.late?"ci-late":"ci-ok"}>{g.ci}</span></td>
                    <td>
                      {g.late
                        ? <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#dc2626"}}><FiAlertTriangle size={10}/>Late</span>
                        : <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#16a34a"}}><FiCheckCircle size={10}/>On Time</span>
                      }
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

const SITES = ["All Sites","Leoni Mateur","Leoni Sousse","Leoni Bir Mcherga"];

export default function FM_History() {
  const [search, setSearch] = useState("");
  const [site,   setSite]   = useState("All Sites");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(()=>MEETINGS
    .filter(m=>site==="All Sites"||m.site===site)
    .filter(m=>status==="All"||m.status===status)
    .filter(m=>!search||[m.room,m.ref,m.mod.name,m.dept,m.site].some(f=>f.toLowerCase().includes(search.toLowerCase())))
  ,[search,site,status]);

  const overruns    = MEETINGS.filter(m=>m.status==="overrun").length;
  const totalGuests = MEETINGS.reduce((s,m)=>s+m.guests.length,0);

  return (
    <>
      <style>{CSS}</style>
      <div className="hi">
        <div className="hi-hd">
          <div>
            <div className="hi-ey">Leoni Tunisia · Smart Room AI</div>
            <h2 className="hi-ttl">
              <span className="hi-tico"><FiClock size={17}/></span>
              Meeting History
            </h2>
          </div>
          <div className="hi-stats">
            {[["Total",MEETINGS.length,"#002857"],["Overruns",overruns,"#dc2626"],["Guests",totalGuests,"#0369a1"],["Sites",3,"#16a34a"]].map(([l,v,c])=>(
              <div key={l} className="hi-stat">
                <div className="hi-sv" style={{color:c}}>{v}</div>
                <div className="hi-sl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hi-ctl">
          <div className="hi-sw">
            <FiSearch size={13} className="hi-si"/>
            <input className="hi-inp" placeholder="Search room, ref, moderator, department…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="hi-sel" value={site}   onChange={e=>setSite(e.target.value)}>
            {SITES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="hi-sel" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="on-time">On Time</option>
            <option value="overrun">Overrun</option>
          </select>
        </div>

        <div className="hi-cnt">Showing {filtered.length} of {MEETINGS.length} meetings</div>

        <div className="hi-list">
          {filtered.length===0
            ? <div className="hi-empty">— No meetings match current filters —</div>
            : filtered.map(m=><Card key={m.id} m={m}/>)
          }
        </div>
      </div>
    </>
  );
}