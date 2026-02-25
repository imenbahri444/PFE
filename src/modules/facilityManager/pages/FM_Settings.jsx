import { useState } from "react";
import {
  FiSettings, FiBell, FiShield, FiWifi, FiSliders, FiUsers,
  FiDatabase, FiClock, FiGlobe, FiKey, FiSave, FiAlertTriangle,
  FiMail, FiCpu, FiThermometer, FiWind, FiDownload, FiRefreshCw,
  FiMessageSquare, FiActivity,
} from "react-icons/fi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .st { min-height:100vh; background:#f8fafc; padding:28px 24px; font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; }

  .st-ey { font-size:10px;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:6px; }
  .st-ttl { margin:0 0 28px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-.5px;display:flex;align-items:center;gap:10px; }
  .st-tico { width:36px;height:36px;background:linear-gradient(135deg,#002857,#0064c8);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff; }

  .st-layout { display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:start; }
  @media (max-width:700px) { .st-layout{grid-template-columns:1fr} .st-snav{display:flex;flex-wrap:wrap} }

  .st-snav { background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:8px;position:sticky;top:24px;box-shadow:0 1px 4px rgba(0,0,0,.05); }
  .st-ni   { display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:500;color:#64748b;cursor:pointer;transition:background .15s,color .15s;border:none;background:transparent;width:100%;text-align:left;font-family:'Plus Jakarta Sans',sans-serif; }
  .st-ni:hover { background:#f8fafc;color:#0f172a; }
  .st-ni.on { background:linear-gradient(135deg,rgba(0,40,87,.07),rgba(0,100,200,.07));color:#002857;font-weight:700; }
  .st-ni.on svg { color:#00b2ff; }

  .st-panel { display:flex;flex-direction:column;gap:16px; }

  .st-sec { background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05); }
  .st-sh  { padding:14px 18px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:10px; }
  .st-sico{ width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .st-st  { font-weight:700;font-size:14px;color:#0f172a; }
  .st-ss  { font-size:11px;color:#94a3b8;font-family:'JetBrains Mono',monospace;margin-top:1px; }

  .st-row { display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid #f8fafc;gap:12px;transition:background .15s; }
  .st-row:last-child { border-bottom:none; }
  .st-row:hover { background:#fafbfc; }
  .st-rl { display:flex;flex-direction:column;gap:2px; }
  .st-rll { font-size:13px;font-weight:600;color:#1e293b; }
  .st-rld { font-size:11px;color:#94a3b8;line-height:1.4; }

  /* Toggle */
  .st-tog { position:relative;width:40px;height:22px;flex-shrink:0;cursor:pointer; }
  .st-tog input { opacity:0;width:0;height:0;position:absolute; }
  .st-trk { position:absolute;inset:0;border-radius:99px;background:#e2e8f0;transition:background .2s; }
  .st-tog input:checked ~ .st-trk { background:linear-gradient(135deg,#00b2ff,#0064c8); }
  .st-thm { position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s; }
  .st-tog input:checked ~ .st-trk .st-thm { transform:translateX(18px); }

  .st-inp { background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:7px 11px;font-size:12px;color:#0f172a;outline:none;font-family:'JetBrains Mono',monospace;width:90px;text-align:right;transition:border-color .15s; }
  .st-inp:focus { border-color:#00b2ff;box-shadow:0 0 0 3px rgba(0,178,255,.1); }
  .st-sel { background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:7px 10px;font-size:12px;color:#0f172a;outline:none;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:border-color .15s; }
  .st-sel:focus { border-color:#00b2ff; }

  .st-bar { display:flex;justify-content:flex-end;gap:10px;padding-top:4px; }
  .st-btn { display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:opacity .15s,transform .15s;border:1px solid transparent; }
  .st-btn:hover { opacity:.88;transform:translateY(-1px); }
  .st-pri { background:linear-gradient(135deg,#002857,#0064c8);color:#fff;box-shadow:0 4px 14px rgba(0,40,87,.25); }
  .st-gst { background:transparent;border-color:#e2e8f0;color:#64748b; }

  .st-drow { display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid #fef2f2;gap:12px; }
  .st-drow:last-child { border-bottom:none; }
  .st-dbtn { display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:background .15s; }
  .st-dbtn:hover { background:#fee2e2; }

  .st-tag { display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;font-family:'JetBrains Mono',monospace;letter-spacing:.4px; }
`;

function Tog({ label, desc, on: defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="st-row">
      <div className="st-rl">
        <span className="st-rll">{label}</span>
        {desc && <span className="st-rld">{desc}</span>}
      </div>
      <label className="st-tog">
        <input type="checkbox" checked={on} onChange={()=>setOn(v=>!v)}/>
        <div className="st-trk"><div className="st-thm"/></div>
      </label>
    </div>
  );
}

function Num({ label, desc, def, unit }) {
  const [v, setV] = useState(def);
  return (
    <div className="st-row">
      <div className="st-rl">
        <span className="st-rll">{label}</span>
        {desc && <span className="st-rld">{desc}</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        <input className="st-inp" type="number" value={v} onChange={e=>setV(e.target.value)}/>
        {unit && <span style={{fontSize:11,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>{unit}</span>}
      </div>
    </div>
  );
}

function Sel({ label, desc, opts, def }) {
  const [v, setV] = useState(def);
  return (
    <div className="st-row">
      <div className="st-rl">
        <span className="st-rll">{label}</span>
        {desc && <span className="st-rld">{desc}</span>}
      </div>
      <select className="st-sel" value={v} onChange={e=>setV(e.target.value)}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Sec({ icon, bg, title, sub, children }) {
  return (
    <div className="st-sec">
      <div className="st-sh">
        <div className="st-sico" style={{background:bg}}>{icon}</div>
        <div>
          <div className="st-st">{title}</div>
          {sub && <div className="st-ss">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

const NAVS = [
  { id:"notif",  icon:<FiBell size={14}/>,         l:"Notifications"   },
  { id:"ai",     icon:<FiCpu size={14}/>,           l:"AI & Automation" },
  { id:"comfort",icon:<FiThermometer size={14}/>,   l:"Comfort Rules"   },
  { id:"alerts", icon:<FiAlertTriangle size={14}/>, l:"Alerts"          },
  { id:"account",icon:<FiShield size={14}/>,        l:"Account & Security"},
  { id:"integr", icon:<FiWifi size={14}/>,          l:"Integrations"    },
  { id:"data",   icon:<FiDatabase size={14}/>,      l:"Data & Export"   },
  { id:"system", icon:<FiSettings size={14}/>,      l:"System"          },
];

export default function FM_Settings() {
  const [active, setActive] = useState("notif");

  return (
    <>
      <style>{CSS}</style>
      <div className="st">
        <div className="st-ey">Leoni Tunisia · Smart Room AI</div>
        <h2 className="st-ttl">
          <span className="st-tico"><FiSettings size={17}/></span>Settings
        </h2>

        <div className="st-layout">
          <div className="st-snav">
            {NAVS.map(n=>(
              <button key={n.id} className={`st-ni${active===n.id?" on":""}`} onClick={()=>setActive(n.id)}>
                {n.icon}{n.l}
              </button>
            ))}
          </div>

          <div className="st-panel">

            {active==="notif" && <>
              <Sec icon={<FiBell size={15} color="#0064c8"/>} bg="#eff6ff" title="Notification Preferences" sub="Control how and when you receive alerts">
                <Tog label="Email Notifications"    desc="Send alerts to your registered email address"  on={true}  />
                <Tog label="SMS Alerts"             desc="Receive critical alerts via text message"       on={false} />
                <Tog label="In-App Notifications"   desc="Show real-time alerts in the dashboard"         on={true}  />
                <Tog label="Daily Summary Report"   desc="Receive a daily digest every morning at 08:00" on={true}  />
                <Tog label="Weekly Analytics Email" desc="Weekly room utilization and feedback digest"    on={true}  />
              </Sec>
              <Sec icon={<FiClock size={15} color="#ca8a04"/>} bg="#fefce8" title="Quiet Hours" sub="Suppress non-critical notifications during these hours">
                <Sel label="Quiet Hours Start" opts={["20:00","21:00","22:00","23:00"]} def="22:00"/>
                <Sel label="Quiet Hours End"   opts={["06:00","07:00","08:00","09:00"]} def="07:00"/>
                <Tog label="Allow Critical Alerts in Quiet Hours" desc="CO₂ and safety alerts always push through" on={true}/>
              </Sec>
            </>}

            {active==="ai" && <>
              <Sec icon={<FiCpu size={15} color="#7c3aed"/>} bg="#f5f3ff" title="AI Engine" sub="Control automated intelligence and decision-making">
                <Tog label="AI Recommendations"        desc="Enable automatic environment optimization suggestions"      on={true}  />
                <Tog label="Auto-Accept Low-Risk Recs" desc="Automatically apply LOW priority recommendations"           on={false} />
                <Tog label="Predictive Ventilation"    desc="AI pre-conditions rooms 15 min before scheduled meetings"   on={true}  />
                <Tog label="Anomaly Detection"         desc="Flag unusual sensor readings for FM review"                  on={true}  />
                <Sel label="AI Sensitivity"            desc="How aggressively the AI triggers recommendations" opts={["Conservative","Balanced","Aggressive"]} def="Balanced"/>
                <Num label="Confidence Threshold"      desc="Min % confidence before surfacing a recommendation" def={75} unit="%"/>
              </Sec>
              <Sec icon={<FiRefreshCw size={15} color="#0369a1"/>} bg="#f0f9ff" title="Sensor Polling">
                <Num label="Polling Interval" desc="How often sensor data is refreshed"    def={60} unit="sec"/>
                <Num label="Data Retention"   desc="How long raw sensor logs are kept"     def={90} unit="days"/>
              </Sec>
            </>}

            {active==="comfort" && <>
              <Sec icon={<FiThermometer size={15} color="#ea580c"/>} bg="#fff7ed" title="Temperature Thresholds" sub="Global comfort boundaries across all rooms">
                <Num label="Min Comfortable Temp" def={20} unit="°C"/>
                <Num label="Max Comfortable Temp" def={24} unit="°C"/>
                <Num label="Alert Threshold"      desc="Trigger alert when temp exceeds this" def={26} unit="°C"/>
              </Sec>
              <Sec icon={<FiWind size={15} color="#0369a1"/>} bg="#f0f9ff" title="CO₂ Thresholds" sub="Air quality limits for ventilation triggers">
                <Num label="Warning Level"  desc="Trigger AI recommendation"  def={1000} unit="ppm"/>
                <Num label="Critical Level" desc="Trigger immediate FM alert"  def={1300} unit="ppm"/>
                <Num label="Target Level"   desc="HVAC aims to maintain below" def={800}  unit="ppm"/>
              </Sec>
              <Sec icon={<FiSliders size={15} color="#16a34a"/>} bg="#f0fdf4" title="HVAC Rules">
                <Tog label="Auto Boost Before Meetings" desc="Activate HVAC 10 min before room is booked"         on={true}/>
                <Tog label="Auto Off After Vacancy"     desc="Power down HVAC 5 min after last guest leaves"      on={true}/>
                <Num label="Post-Meeting Cooldown"      desc="Minutes to run HVAC after meeting ends" def={10} unit="min"/>
              </Sec>
            </>}

            {active==="alerts" && <>
              <Sec icon={<FiAlertTriangle size={15} color="#dc2626"/>} bg="#fef2f2" title="Alert Rules" sub="Configure what triggers an escalation">
                <Tog label="Overrun Alerts"           desc="Alert when meetings run beyond booked time"         on={true}  />
                <Tog label="No-Show Alerts"           desc="Alert when a booked room is not occupied"           on={true}  />
                <Tog label="Late Check-In Alerts"     desc="Alert when guests check in 10+ min late"            on={false} />
                <Tog label="Equipment Failure Alerts" desc="Notify FM when AV or HVAC faults are detected"      on={true}  />
                <Num label="Overrun Grace Period"     desc="Minutes past booked end before alert fires"   def={5}  unit="min"/>
                <Num label="No-Show Grace Period"     desc="Minutes before a no-show is declared"         def={15} unit="min"/>
              </Sec>
            </>}

            {active==="account" && <>
              <Sec icon={<FiShield size={15} color="#16a34a"/>} bg="#f0fdf4" title="Security" sub="Account protection and access control">
                <Tog label="Two-Factor Authentication" desc="Require 2FA at each login"                    on={true}/>
                <Tog label="Session Timeout"           desc="Auto logout after 30 min of inactivity"       on={true}/>
                <Sel label="Password Expiry"           opts={["30 days","60 days","90 days","Never"]}      def="90 days"/>
                <div className="st-row">
                  <div className="st-rl">
                    <span className="st-rll">Change Password</span>
                    <span className="st-rld">Last changed 45 days ago</span>
                  </div>
                  <button className="st-btn st-gst" style={{fontSize:12,padding:"6px 14px"}}><FiKey size={12}/> Change</button>
                </div>
              </Sec>
              <Sec icon={<FiUsers size={15} color="#4338ca"/>} bg="#eef2ff" title="Access & Roles">
                <Sel label="Default New User Role"   opts={["Viewer","Operator","Manager","Admin"]} def="Operator"/>
                <Tog label="Allow Self-Registration" desc="Let Leoni staff create accounts with corporate email" on={false}/>
                <Tog label="Guest Access"            desc="Allow read-only logins for external auditors"         on={false}/>
              </Sec>
            </>}

            {active==="integr" && <>
              <Sec icon={<FiWifi size={15} color="#0369a1"/>} bg="#f0f9ff" title="Connected Systems" sub="Manage integrations with external platforms">
                {[
                  ["Leoni HRMS",       "Sync guest list and employee IDs",          true ],
                  ["BMS / SCADA",      "Building Management System sensor feed",     true ],
                  ["Outlook Calendar", "Two-way room booking sync",                  true ],
                  ["SMTP Server",      "Email notification relay",                   true ],
                  ["ERP System",       "Asset management and maintenance ticketing",false ],
                  ["Slack",            "Push critical alerts to FM Slack channel",   false],
                ].map(([name,desc,connected])=>(
                  <div key={name} className="st-row">
                    <div className="st-rl">
                      <span className="st-rll">{name}</span>
                      <span className="st-rld">{desc}</span>
                    </div>
                    <span className="st-tag" style={connected
                      ?{color:"#16a34a",background:"#f0fdf4",border:"1px solid #bbf7d0"}
                      :{color:"#94a3b8",background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                      {connected?"Connected":"Disconnected"}
                    </span>
                  </div>
                ))}
              </Sec>
              <Sec icon={<FiGlobe size={15} color="#ca8a04"/>} bg="#fefce8" title="Locale & Language">
                <Sel label="Language"    opts={["English","Français","العربية"]}              def="English"/>
                <Sel label="Date Format" opts={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"]}      def="DD/MM/YYYY"/>
                <Sel label="Time Zone"   opts={["Africa/Tunis (UTC+1)","UTC","Europe/Paris"]} def="Africa/Tunis (UTC+1)"/>
              </Sec>
            </>}

            {active==="data" && <>
              <Sec icon={<FiDatabase size={15} color="#7c3aed"/>} bg="#f5f3ff" title="Data Management" sub="Retention, backup and GDPR controls">
                <Num label="Sensor Log Retention"     desc="Raw sensor data kept for N days"           def={90} unit="days"/>
                <Num label="Meeting Record Retention" desc="Meeting history kept for N months"          def={24} unit="mo"  />
                <Num label="Feedback Retention"       desc="User feedback kept for N months"            def={12} unit="mo"  />
                <Tog label="Anonymise Guest Data"     desc="Strip personal identifiers from archives"   on={true}/>
              </Sec>
              <Sec icon={<FiDownload size={15} color="#0369a1"/>} bg="#f0f9ff" title="Export">
                <Sel label="Default Export Format"    opts={["CSV","Excel","PDF","JSON"]}               def="Excel"/>
                <Tog label="Scheduled Weekly Export"  desc="Auto-email report every Monday 08:00"       on={false}/>
                <div className="st-row">
                  <div className="st-rl">
                    <span className="st-rll">Export Full Dataset Now</span>
                    <span className="st-rld">All rooms, meetings, sensors, feedback</span>
                  </div>
                  <button className="st-btn st-gst" style={{fontSize:12,padding:"6px 14px"}}><FiDownload size={12}/> Export</button>
                </div>
              </Sec>
            </>}

            {active==="system" && <>
              <Sec icon={<FiActivity size={15} color="#475569"/>} bg="#f1f5f9" title="System Information" sub="Platform health and version details">
                {[
                  ["Platform Version",  "v2.4.1"],
                  ["AI Engine",         "v1.9.0"],
                  ["Last Sensor Sync",  "2 min ago"],
                  ["Active Rooms",      "6"],
                  ["Active Sites",      "3 (Mateur, Sousse, Bir Mcherga)"],
                  ["Uptime",            "99.8% (30 days)"],
                ].map(([l,v])=>(
                  <div key={l} className="st-row">
                    <span className="st-rll">{l}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#334155",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </Sec>
              <Sec icon={<FiAlertTriangle size={15} color="#dc2626"/>} bg="#fef2f2" title="Danger Zone" sub="Irreversible actions — proceed with caution">
                {[["Clear Sensor Logs","Permanently delete all raw sensor history"],["Reset AI Model","Revert AI thresholds to factory defaults"],["Factory Reset","Wipe all configuration and data"]].map(([l,d])=>(
                  <div key={l} className="st-drow">
                    <div className="st-rl">
                      <span className="st-rll">{l}</span>
                      <span className="st-rld">{d}</span>
                    </div>
                    <button className="st-dbtn"><FiAlertTriangle size={11}/>{l.split(" ")[0]}</button>
                  </div>
                ))}
              </Sec>
            </>}

            <div className="st-bar">
              <button className="st-btn st-gst"><FiRefreshCw size={13}/>Reset</button>
              <button className="st-btn st-pri"><FiSave size={13}/>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}