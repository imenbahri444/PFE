import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  FaCheckCircle, FaExclamationTriangle, FaClock, FaStickyNote,
  FaSave, FaTimes, FaEdit, FaPlus, FaUserFriends, FaInfoCircle,
  FaChevronDown, FaChevronUp, FaRegCalendar, FaRegClock,
  FaSearch, FaMapMarkerAlt
} from "react-icons/fa";
import "./FM_Bookings.css";

const localizer = momentLocalizer(moment);

/* ── Data ───────────────────────────────────────────────────── */
const ROOMS = [
  { id:"RM001", name:"Conference A",        capacity:20, floor:2, amenities:["Projector","Whiteboard","Video Conference"] },
  { id:"RM002", name:"Meeting Room 2",      capacity:8,  floor:1, amenities:["TV Screen","Whiteboard"] },
  { id:"RM003", name:"Training Hall",       capacity:50, floor:3, amenities:["Projector","Sound System","Stage"] },
  { id:"RM004", name:"Executive Boardroom", capacity:16, floor:4, amenities:["Video Conference","Smart Board","Catering"] },
  { id:"RM005", name:"Innovation Hub",      capacity:12, floor:2, amenities:["Whiteboard","Standing Desks","Monitor"] },
  { id:"RM006", name:"Quiet Room",          capacity:4,  floor:1, amenities:["Privacy","Phone Booth"] },
];
const USERS = [
  { id:1, name:"Sarah Johnson",   email:"sarah.j@company.com",    department:"Marketing",   avatar:"SJ" },
  { id:2, name:"Michael Chen",    email:"michael.c@company.com",  department:"Engineering", avatar:"MC" },
  { id:3, name:"Emma Davis",      email:"emma.d@company.com",     department:"Design",      avatar:"ED" },
  { id:4, name:"James Wilson",    email:"james.w@company.com",    department:"Product",     avatar:"JW" },
  { id:5, name:"Lisa Anderson",   email:"lisa.a@company.com",     department:"QA",          avatar:"LA" },
  { id:6, name:"Robert Brown",    email:"robert.b@company.com",   department:"HR",          avatar:"RB" },
  { id:7, name:"Patricia Garcia", email:"patricia.g@company.com", department:"Training",    avatar:"PG" },
  { id:8, name:"John Smith",      email:"john.s@company.com",     department:"Sales",       avatar:"JS" },
];
const INIT = [
  { id:1, title:"Weekly Team Sync",   start:new Date(2026,1,23,10,0), end:new Date(2026,1,23,12,0),  roomId:"RM001", roomName:"Conference A",        state:"completed", status:"confirmed", duration:"2 hours",   roomCondition:"Clean and organized",            description:"Discuss Q2 roadmap and sprint planning.",   moderator:{name:"Sarah Johnson",  email:"sarah.j@company.com",    department:"Marketing", avatar:"SJ"}, guests:[{id:1,name:"Michael Chen",email:"michael.c@company.com",role:"Developer",status:"accepted"},{id:2,name:"Emma Davis",email:"emma.d@company.com",role:"Designer",status:"accepted"}] },
  { id:2, title:"Client Presentation",start:new Date(2026,1,23,14,0), end:new Date(2026,1,23,15,30), roomId:"RM002", roomName:"Meeting Room 2",       state:"delayed",   status:"confirmed", duration:"1.5 hours", roomCondition:"Projector bulb dim, needs replacement", description:"Product demo for potential enterprise client.", moderator:{name:"John Smith",     email:"john.s@company.com",     department:"Sales",     avatar:"JS"}, guests:[{id:4,name:"Alice Cooper",email:"alice.c@client.com",role:"Client",status:"accepted"}] },
  { id:3, title:"Training Workshop",  start:new Date(2026,1,24,9,0),  end:new Date(2026,1,24,12,0),  roomId:"RM003", roomName:"Training Hall",         state:"scheduled", status:"confirmed", duration:"3 hours",   roomCondition:"Good",                               description:"New employee orientation and training.",      moderator:{name:"Robert Brown",   email:"robert.b@company.com",   department:"HR",        avatar:"RB"}, guests:[{id:6,name:"Patricia Garcia",email:"patricia.g@company.com",role:"Trainee",status:"accepted"}] },
];
const COLORS = { completed:"#10b981", delayed:"#f59e0b", issue:"#ef4444", scheduled:"#3b82f6" };
const ICONS  = { completed:<FaCheckCircle />, delayed:<FaClock />, issue:<FaExclamationTriangle />, scheduled:<FaClock /> };
const cap    = s => s.charAt(0).toUpperCase() + s.slice(1);
const BLANK  = { title:"", roomId:"", start:null, end:null, description:"" };

/* ── Tiny helpers ───────────────────────────────────────────── */
const Av = ({ t, size="md" }) => <div className={`av av-${size}`}>{t}</div>;
const Dot = ({ state }) => <span className="ldot" style={{ background: COLORS[state], boxShadow:`0 0 0 3px ${COLORS[state]}30` }} />;

const EventCell = ({ event }) => (
  <div className={`cal-ev ${event.state}`}>
    <b>{moment(event.start).format("HH:mm")}</b>
    <span>{event.title}</span>
    <small>{event.roomName}</small>
  </div>
);

/* ── Component ──────────────────────────────────────────────── */
export default function FM_Bookings() {
  const [bookings, setB]  = useState(INIT);
  const [exp, setExp]     = useState(null);
  const [calV, setCalV]   = useState("week");
  const [calD, setCalD]   = useState(new Date());
  const [editId, setEId]  = useState(null);
  const [eDesc, setEDesc] = useState("");
  const [eCond, setECond] = useState("");
  const [modal, setModal] = useState(false);
  const [slot, setSlot]   = useState(null);
  const [nb, setNb]       = useState(BLANK);
  const [query, setQuery] = useState("");
  const [att, setAtt]     = useState([]);
  const [tab, setTab]     = useState("details");

  const openModal = (s) => {
    const sl = s || { start: new Date(), end: new Date(Date.now() + 3600000) };
    setSlot(sl); setNb({ ...BLANK, start: sl.start, end: sl.end });
    setAtt([]); setTab("details"); setModal(true);
  };

  const toggle   = (b) => { setExp(p => p?.id === b.id ? null : b); setEId(null); };
  const startEd  = (b, e) => { e.stopPropagation(); setEId(b.id); setEDesc(b.description||""); setECond(b.roomCondition||""); };
  const saveEd   = (id, e) => { e.stopPropagation(); setB(bs => bs.map(b => b.id===id ? {...b, description:eDesc, roomCondition:eCond} : b)); setExp(p => p?.id===id ? {...p, description:eDesc, roomCondition:eCond} : p); setEId(null); };
  const delB     = (id, e) => { e.stopPropagation(); if (!window.confirm("Cancel booking?")) return; setB(bs => bs.filter(b => b.id!==id)); if(exp?.id===id) setExp(null); };
  const setState = (id, s, e) => { e.stopPropagation(); setB(bs => bs.map(b => b.id===id ? {...b, state:s} : b)); setExp(p => p?.id===id ? {...p, state:s} : p); };
  const addAtt   = (u) => { if (!att.find(a => a.id===u.id)) setAtt(a => [...a, {...u, status:"pending"}]); };
  const remAtt   = (id) => setAtt(a => a.filter(x => x.id!==id));

  const timeChg = (type, val) => {
    const [h,m] = val.split(":").map(Number);
    if (type==="start") { const s=new Date(slot.start); s.setHours(h,m); setNb(b => ({...b, start:s, end:new Date(s.getTime()+(slot.end-slot.start))})); }
    else { const e=new Date(slot.start); e.setHours(h,m); setNb(b => ({...b, end:e})); }
  };

  const create = () => {
    if (!nb.title || !nb.roomId) return alert("Fill required fields");
    setB(bs => [...bs, { id:Date.now(), ...nb, roomName:ROOMS.find(r=>r.id===nb.roomId)?.name, status:"confirmed", state:"scheduled", moderator:USERS[0], guests:att, roomCondition:"Good", duration: moment(nb.end).diff(moment(nb.start),"hours",true).toFixed(1)+" hours" }]);
    setModal(false); setAtt([]); setQuery("");
  };

  const sorted = [...bookings].sort((a,b) => a.start - b.start);
  const fusers = USERS.filter(u => [u.name,u.email,u.department].some(s => s.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="bw">
      {/* Header */}
      <div className="bh">
        <div><h1>Bookings Management</h1><p>Schedule and manage all room bookings</p></div>
        <button className="btn-new" onClick={() => openModal(null)}><FaPlus /> New Booking</button>
      </div>

      <div className="bc">
        {/* Calendar */}
        <div className="cal-col">
          <div className="cal-card">
            <div className="cal-hd">
              <h2>Schedule</h2>
              <div className="cal-ctrls">
                {["day","week","month"].map(v => <button key={v} className={`vbtn${calV===v?" on":""}`} onClick={() => setCalV(v)}>{cap(v)}</button>)}
              </div>
            </div>
            <div className="cal-wrap">
              <Calendar localizer={localizer} events={bookings} startAccessor="start" endAccessor="end"
                view={calV} onView={setCalV} date={calD} onNavigate={setCalD} views={["day","week","month"]}
                style={{height:580}} onSelectEvent={toggle} onSelectSlot={openModal} selectable
                components={{ event: EventCell, toolbar: ()=>null }}
                eventPropGetter={ev => ({ style: { background:`${COLORS[ev.state]}18`, borderLeft:`4px solid ${COLORS[ev.state]}`, borderRadius:"8px", padding:"4px 8px" } })}
              />
            </div>
          </div>
          <div className="legend">
            {Object.entries(COLORS).map(([s,c]) => (
              <div className="legend-item" key={s}>
                <span className="ldot" style={{ background:c, boxShadow:`0 0 0 3px ${c}28` }} />
                <span>{cap(s)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bl-col">
          <div className="bl-hd">
            <h2>Upcoming Bookings</h2>
            <span className="bl-cnt">{bookings.length} total</span>
          </div>
          <div className="bl-body">
            {sorted.map(b => (
              <div key={b.id} className="bi">
                {/* Row */}
                <div className={`bi-row${exp?.id===b.id?" open":""}`} onClick={() => toggle(b)}>
                  <Dot state={b.state} />
                  <div className="bi-time">
                    <span className="bi-date">{moment(b.start).format("MMM D, YYYY")}</span>
                    <span className="bi-range">{moment(b.start).format("HH:mm")} – {moment(b.end).format("HH:mm")}</span>
                  </div>
                  <div className="bi-info">
                    <strong>{b.title}</strong>
                    <span className="bi-room"><FaMapMarkerAlt />{b.roomName}</span>
                  </div>
                  <div className="bi-acts" onClick={e => e.stopPropagation()}>
                    <button className="ib ib-edit"   onClick={e => startEd(b, e)}><FaEdit /></button>
                    <button className="ib ib-del"    onClick={e => delB(b.id, e)}><FaTimes /></button>
                    <button className="ib ib-expand" onClick={() => toggle(b)}>{exp?.id===b.id ? <FaChevronUp /> : <FaChevronDown />}</button>
                  </div>
                </div>

                {/* Expanded */}
                {exp?.id===b.id && (
                  <div className="bi-exp">
                    <span className={`sbadge s-${b.state}`}>{ICONS[b.state]} {cap(b.state)}</span>

                    <div className="sc-btns">
                      {["completed","delayed","issue"].map(s => (
                        <button key={s} className={`scb scb-${s}${b.state===s?" on":""}`} onClick={e => setState(b.id, s, e)}>
                          {ICONS[s]} {cap(s)}
                        </button>
                      ))}
                    </div>

                    <div className="xs">
                      <label>Moderator</label>
                      <div className="mod-row">
                        <Av t={b.moderator.avatar} />
                        <div><strong>{b.moderator.name}</strong><span>{b.moderator.email}</span><em>{b.moderator.department}</em></div>
                      </div>
                    </div>

                    <div className="xs">
                      <label>Attendees ({b.guests.length})</label>
                      <div className="att-list">
                        {b.guests.map(g => (
                          <div key={g.id} className="att-row">
                            <span>{g.name}</span>
                            <span className={`astat s-${g.status}`}>{g.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {editId===b.id ? (
                      <div className="ed-box">
                        <div className="ef"><label>Description</label><textarea rows={2} value={eDesc} onChange={e => setEDesc(e.target.value)} /></div>
                        <div className="ef"><label>Room Condition</label><textarea rows={2} value={eCond} onChange={e => setECond(e.target.value)} /></div>
                        <div className="ed-acts">
                          <button className="btn-save" onClick={e => saveEd(b.id, e)}><FaSave /> Save</button>
                          <button className="btn-cancel" onClick={e => { e.stopPropagation(); setEId(null); }}><FaTimes /> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="xs">
                        <label>Description</label><p>{b.description || "—"}</p>
                        <label>Room Condition</label><p>{b.roomCondition || "—"}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && slot && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <h2>New Booking</h2>
              <button className="modal-close" onClick={() => setModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="time-bar">
                <div className="tb-item"><FaRegCalendar /><div><small>Date</small><strong>{moment(slot.start).format("dddd, MMM D, YYYY")}</strong></div></div>
                <div className="tb-item"><FaRegClock /><div><small>Time</small><strong>{moment(slot.start).format("HH:mm")} – {moment(slot.end).format("HH:mm")}</strong></div></div>
              </div>

              <div className="tabs">
                {[{k:"details",i:<FaInfoCircle />,l:"Details"},{k:"attendees",i:<FaUserFriends />,l:"Attendees"},{k:"description",i:<FaStickyNote />,l:"Description"}].map(({k,i,l}) => (
                  <button key={k} className={`tab${tab===k?" on":""}`} onClick={() => setTab(k)}>{i}{l}</button>
                ))}
              </div>

              <div className="tab-body">
                {tab==="details" && (
                  <>
                    <div className="fg"><label>Meeting Title *</label><input type="text" autoFocus placeholder="e.g., Weekly Team Sync" value={nb.title} onChange={e => setNb(b=>({...b,title:e.target.value}))} /></div>
                    <div className="fg"><label>Room *</label>
                      <select value={nb.roomId} onChange={e => setNb(b=>({...b,roomId:e.target.value}))}>
                        <option value="">Select a room</option>
                        {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name} – Floor {r.floor} (Cap: {r.capacity})</option>)}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="fg"><label>Start</label><input type="time" value={moment(nb.start).format("HH:mm")} onChange={e => timeChg("start",e.target.value)} /></div>
                      <div className="fg"><label>End</label><input type="time" value={moment(nb.end).format("HH:mm")} onChange={e => timeChg("end",e.target.value)} /></div>
                    </div>
                    {nb.roomId && (
                      <div className="room-prev">
                        <p>Amenities</p>
                        <div className="amenities">{ROOMS.find(r=>r.id===nb.roomId)?.amenities.map((a,i) => <span key={i}>{a}</span>)}</div>
                      </div>
                    )}
                  </>
                )}
                {tab==="attendees" && (
                  <>
                    <div className="search-wrap"><FaSearch /><input placeholder="Search people…" value={query} onChange={e => setQuery(e.target.value)} /></div>
                    {att.length > 0 && (
                      <div className="sel-att">
                        {att.map(a => <span key={a.id} className="sel-tag">{a.name}<button onClick={() => remAtt(a.id)}><FaTimes /></button></span>)}
                      </div>
                    )}
                    <div className="ulist">
                      {fusers.map(u => {
                        const added = !!att.find(a => a.id===u.id);
                        return (
                          <div key={u.id} className="urow">
                            <Av t={u.avatar} />
                            <div className="uinfo"><strong>{u.name}</strong><span>{u.email}</span><em>{u.department}</em></div>
                            <button className={`add-btn${added?" added":""}`} onClick={() => addAtt(u)} disabled={added}>{added?"Added":"Add"}</button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {tab==="description" && (
                  <div className="fg"><label>Description</label><textarea rows={7} placeholder="Add agenda, goals, or notes…" value={nb.description} onChange={e => setNb(b=>({...b,description:e.target.value}))} /></div>
                )}
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-create" onClick={create}>Create Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}