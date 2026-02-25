import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid, FiMonitor, FiCalendar, FiCpu, FiSliders,
  FiAlertOctagon, FiUsers, FiFileText, FiSettings,
  FiLogOut, FiMessageSquare, FiClock,
} from "react-icons/fi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .sb { width:72px; height:100vh; background:linear-gradient(175deg,#002857 0%,#001530 100%); display:flex; flex-direction:column; position:fixed; left:0;top:0;bottom:0; z-index:100; transition:width .28s cubic-bezier(.4,0,.2,1); overflow:hidden; box-shadow:4px 0 32px rgba(0,20,60,.45); font-family:'Plus Jakarta Sans',sans-serif; }
  .sb.x { width:240px; }
  .sb::after { content:''; position:absolute; right:0;top:0;bottom:0; width:1px; background:linear-gradient(180deg,transparent,rgba(0,178,255,.22) 40%,transparent); pointer-events:none; }

  /* Header */
  .sb-hd { display:flex; align-items:center; gap:10px; padding:20px 16px 18px; border-bottom:1px solid rgba(255,255,255,.07); cursor:pointer; flex-shrink:0; user-select:none; }
  .sb-mark { width:36px;height:36px; background:linear-gradient(135deg,#00b2ff,#0064c8); border-radius:10px; display:flex;align-items:center;justify-content:center; font-weight:800;font-size:13px;color:#fff; flex-shrink:0; box-shadow:0 4px 14px rgba(0,178,255,.35); letter-spacing:-.5px; }
  .sb-txt { white-space:nowrap;overflow:hidden; opacity:0; transform:translateX(-8px); transition:opacity .2s .05s,transform .2s .05s; }
  .sb.x .sb-txt { opacity:1;transform:none; }
  .sb-name { font-weight:800;font-size:15px;color:#fff;line-height:1.15; }
  .sb-sub  { font-size:10px;color:rgba(255,255,255,.38);letter-spacing:.7px;font-family:'JetBrains Mono',monospace; }

  /* Nav */
  .sb-nav { flex:1; padding:10px 8px; display:flex; flex-direction:column; gap:2px; overflow-y:auto;overflow-x:hidden; scrollbar-width:none; }
  .sb-nav::-webkit-scrollbar { display:none; }

  .sb-sep { height:1px; background:rgba(255,255,255,.06); margin:6px 4px; flex-shrink:0; }

  /* Nav item shared */
  .sb-i {
    display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:10px;
    color:rgba(255,255,255,.48); text-decoration:none; transition:background .18s,color .18s,transform .18s;
    white-space:nowrap; cursor:pointer; position:relative; border:none; background:transparent;
    width:100%; text-align:left; font-family:'Plus Jakarta Sans',sans-serif; box-sizing:border-box;
  }
  .sb-i:hover { background:rgba(0,178,255,.11); color:rgba(255,255,255,.82); transform:translateX(2px); }
  .sb-i.active { background:linear-gradient(135deg,rgba(0,178,255,.22),rgba(0,100,200,.18)); color:#fff; box-shadow:inset 0 0 0 1px rgba(0,178,255,.22); }
  .sb-i.active .sb-ic { color:#00b2ff; }
  .sb-i.active::before { content:''; position:absolute; left:0;top:22%;height:56%; width:3px; background:#00b2ff; border-radius:0 3px 3px 0; }

  /* Feedback item accent */
  .sb-i.fb-accent { border:1px solid rgba(0,178,255,.16); background:rgba(0,178,255,.06); }
  .sb-i.fb-accent:hover { background:rgba(0,178,255,.14); border-color:rgba(0,178,255,.3); }
  .sb-i.fb-accent.active { background:linear-gradient(135deg,rgba(0,178,255,.25),rgba(0,100,200,.2)); border-color:rgba(0,178,255,.35); }

  /* Tooltip when collapsed */
  .sb:not(.x) .sb-i[data-tip]:hover::after {
    content:attr(data-tip);
    position:absolute; left:calc(100% + 12px); top:50%; transform:translateY(-50%);
    background:#001530; color:#fff; font-size:11px; font-weight:500;
    padding:6px 11px; border-radius:7px; white-space:nowrap; pointer-events:none;
    box-shadow:0 4px 16px rgba(0,0,0,.45),0 0 0 1px rgba(0,178,255,.18); z-index:200;
  }

  .sb-ic  { font-size:16px; min-width:28px; display:flex;align-items:center;justify-content:center; flex-shrink:0; transition:color .18s; }
  .sb-lbl { font-size:13px;font-weight:500; opacity:0; transform:translateX(-6px); transition:opacity .18s .04s,transform .18s .04s; overflow:hidden; }
  .sb.x .sb-lbl { opacity:1;transform:none; }

  /* Badge */
  .sb-badge {
    min-width:18px; height:18px; border-radius:9px;
    background:#dc2626; color:#fff;
    font-size:10px; font-weight:700; font-family:'JetBrains Mono',monospace;
    display:flex;align-items:center;justify-content:center;
    padding:0 5px; margin-left:auto; flex-shrink:0;
    opacity:0; transform:scale(.7); transition:opacity .18s,transform .18s;
  }
  .sb.x .sb-badge { opacity:1; transform:scale(1); }

  /* Logout Button - Solid Orange, Smaller */
  .sb-logout-container {
    padding: 12px 12px 16px;
    border-top: 1px solid rgba(255,255,255,.07);
    flex-shrink:0;
  }
  
  .sb-logout-btn {
    display:flex; align-items:center; justify-content:center; gap:8px;
    width:100%; padding:8px 10px;
    background:#ff7514;
    border:none; border-radius:8px;
    color:white; font-size:12px; font-weight:600;
    cursor:pointer; transition:all .18s ease;
    white-space:nowrap;
  }
  
  .sb-logout-btn:hover {
    background:#ff8c2e;
    transform:translateY(-1px);
  }
  
  .sb-logout-btn .sb-ic {
    color:white;
    min-width:18px;
    font-size:14px;
  }
  
  .sb.x .sb-logout-btn {
    justify-content:flex-start;
    padding:8px 14px;
  }
  
  .sb:not(.x) .sb-logout-btn {
    padding:8px 0;
  }
  
  .sb:not(.x) .sb-logout-btn .sb-lbl {
    display:none;
  }
`;

// Nav structure — null = divider
const NAV = [
  { to:"/fm",                icon:<FiGrid size={16}/>,         label:"Dashboard",           end:true },
  { to:"/fm/rooms",          icon:<FiMonitor size={16}/>,      label:"Rooms & Monitoring"              },
  { to:"/fm/bookings",       icon:<FiCalendar size={16}/>,     label:"Bookings"                        },
  null,
  { to:"/fm/recommendations",icon:<FiCpu size={16}/>,          label:"AI Recommendations"              },
  { to:"/fm/comfort-rules",  icon:<FiSliders size={16}/>,      label:"Comfort Rules"                   },
  { to:"/fm/anomalies",      icon:<FiAlertOctagon size={16}/>, label:"Anomalies"                       },
  null,
  { to:"/fm/users",          icon:<FiUsers size={16}/>,        label:"Users"                           },
  { to:"/fm/reports",        icon:<FiFileText size={16}/>,     label:"Reports"                         },
  { to:"/fm/history",        icon:<FiClock size={16}/>,        label:"Meeting History"                 },
  null,
  { to:"/fm/feedback",       icon:<FiMessageSquare size={16}/>,label:"Feedback",    badge:4, accent:true },
  { to:"/fm/settings",       icon:<FiSettings size={16}/>,     label:"Settings"                        },
];

export default function FM_Sidebar({ collapsed, onToggle }) {
  return (
    <>
      <style>{CSS}</style>
      <div className={`sb${collapsed ? "" : " x"}`}>

        {/* Header / toggle */}
        <div className="sb-hd" onClick={onToggle}>
          <div className="sb-mark">FM</div>
          <div className="sb-txt">
            <div className="sb-name">FM Panel</div>
            <div className="sb-sub">Leoni Tunisia</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          {NAV.map((item, i) =>
            item === null
              ? <div key={`sep-${i}`} className="sb-sep"/>
              : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  data-tip={item.label}
                  className={({ isActive }) =>
                    `sb-i${item.accent ? " fb-accent" : ""}${isActive ? " active" : ""}`
                  }
                >
                  <span className="sb-ic">{item.icon}</span>
                  <span className="sb-lbl">{item.label}</span>
                  {item.badge && (
                    <span className="sb-badge">{item.badge}</span>
                  )}
                </NavLink>
              )
          )}
        </nav>

        {/* Logout Button - Solid Orange at Bottom */}
        <div className="sb-logout-container">
          <button className="sb-logout-btn" data-tip="Logout">
            <span className="sb-ic"><FiLogOut size={14}/></span>
            <span className="sb-lbl">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}