import { useState, useMemo, memo } from "react";
import {
  FiCpu, FiAlertTriangle, FiCheckCircle, FiAlertCircle,
  FiWind, FiStar, FiSettings, FiUsers, FiClock, FiCalendar,
  FiDownload, FiRefreshCw, FiChevronRight, FiTag, FiMapPin,
  FiActivity, FiZap, FiEye, FiArrowUp, FiArrowDown,
  FiInfo, FiTarget, FiBarChart2,
} from "react-icons/fi";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --b900:#001230;--b700:#002857;--b600:#003580;--b500:#0064c8;--b400:#00b2ff;--b100:#e8f7ff;
  --ok:#16a34a;--ok-bg:#f0fdf4;--ok-bd:#bbf7d0;
  --warn:#ea580c;--warn-bg:#fff7ed;--warn-bd:#fed7aa;
  --err:#dc2626;--err-bg:#fef2f2;--err-bd:#fecaca;
  --amb:#ca8a04;--amb-bg:#fefce8;
  --pur:#7c3aed;--pur-bg:#f5f3ff;
  --s0:#fff;--s1:#f8fafc;--s2:#f4f6f9;
  --bd:#e2e8f0;--bd2:#cbd5e1;
  --t1:#0f172a;--t2:#334155;--t3:#475569;--t4:#64748b;--t5:#94a3b8;
  --sans:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
  --r:12px;--r2:16px;
  --sh:0 1px 4px rgba(0,0,0,.05);--sh2:0 4px 16px rgba(0,0,0,.08);
}
.rp{min-height:100vh;background:var(--s2);font-family:var(--sans);color:var(--t1);padding-bottom:60px}
/* topbar */
.rp-top{background:linear-gradient(135deg,var(--b900) 0%,var(--b700) 55%,var(--b600) 100%);padding:24px 28px 0;position:relative;overflow:hidden}
.rp-top::before{content:'';position:absolute;top:-80px;right:-80px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(0,178,255,.09) 0%,transparent 65%);pointer-events:none}
.rp-top-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;position:relative;z-index:1}
.rp-eyebrow{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.38);text-transform:uppercase;font-family:var(--mono);margin-bottom:5px}
.rp-h1{font-size:23px;font-weight:800;color:#fff;letter-spacing:-.5px;display:flex;align-items:center;gap:10px;margin-bottom:6px}
.rp-h1-icon{width:36px;height:36px;background:rgba(0,178,255,.18);border:1px solid rgba(0,178,255,.28);border-radius:9px;display:flex;align-items:center;justify-content:center;color:var(--b400);flex-shrink:0}
.rp-sub{font-size:12px;color:rgba(255,255,255,.4);font-family:var(--mono)}
.rp-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(0,178,255,.12);border:1px solid rgba(0,178,255,.24);border-radius:99px;padding:4px 11px;font-size:11px;color:var(--b400);font-family:var(--mono);font-weight:500}
.rp-dot{width:7px;height:7px;border-radius:50%;background:var(--b400);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)}}
/* controls */
.rp-ctrl{display:flex;gap:7px;flex-wrap:wrap;align-items:center}
.rp-sel{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:7px;padding:7px 11px;font-size:12px;color:#fff;outline:none;cursor:pointer;font-family:var(--mono);transition:.14s}
.rp-sel:hover{background:rgba(255,255,255,.14);border-color:rgba(0,178,255,.4)}
.rp-sel option{background:var(--b700);color:#fff}
.rp-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--sans);transition:.14s;border:1px solid transparent}
.rp-btn:hover{transform:translateY(-1px)}
.rp-ghost{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:rgba(255,255,255,.65)}
.rp-ghost:hover{background:rgba(255,255,255,.15);color:#fff}
.rp-accent{background:linear-gradient(135deg,var(--b400),var(--b500));color:#fff;box-shadow:0 4px 14px rgba(0,178,255,.35)}
/* tabs */
.rp-tabs{display:flex;padding:0 28px;margin-top:18px;position:relative;z-index:1}
.rp-tab{display:flex;align-items:center;gap:6px;padding:10px 16px;font-size:13px;font-weight:600;color:rgba(255,255,255,.38);cursor:pointer;border:none;background:transparent;font-family:var(--sans);border-bottom:2px solid transparent;transition:.14s}
.rp-tab:hover{color:rgba(255,255,255,.72)}
.rp-tab.on{color:#fff;border-bottom-color:var(--b400)}
/* body */
.rp-body{padding:20px 28px}
/* kpis */
.kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:11px;margin-bottom:20px}
@media(max-width:900px){.kpis{grid-template-columns:repeat(3,1fr)}}
@media(max-width:580px){.kpis{grid-template-columns:repeat(2,1fr)}}
.kpi{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:15px 17px;box-shadow:var(--sh);display:flex;flex-direction:column;gap:4px;animation:up .33s ease both}
@keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.kpi-ic{width:29px;height:29px;border-radius:7px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}
.kpi-v{font-size:23px;font-weight:800;font-family:var(--mono);line-height:1}
.kpi-l{font-size:10px;color:var(--t5);text-transform:uppercase;letter-spacing:.4px}
.kpi-d{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;font-family:var(--mono)}
/* section header */
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}
.sh-l{font-size:14px;font-weight:800;color:var(--t1);display:flex;align-items:center;gap:7px;letter-spacing:-.2px}
.sh-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.sh-m{font-size:11px;color:var(--t5);font-family:var(--mono)}
.sh-a{display:inline-flex;align-items:center;gap:4px;font-size:12px;padding:5px 10px;border-radius:6px;border:1px solid var(--bd);background:var(--s0);color:var(--t4);cursor:pointer;font-family:var(--sans);font-weight:600}
/* exec */
.exec{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r2);padding:20px 22px;margin-bottom:20px;box-shadow:var(--sh);position:relative;overflow:hidden}
.exec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,var(--b400),var(--b500))}
.exec-g{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:start}
.exec-hd{font-size:16px;font-weight:800;color:var(--t1);letter-spacing:-.3px;margin-bottom:9px}
.exec-bd{font-size:13px;color:var(--t3);line-height:1.7}
.exec-bd strong{color:var(--t1);font-weight:700}
.exec-sc{text-align:center;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:var(--r);padding:17px 20px;min-width:115px}
.exec-sc-v{font-size:38px;font-weight:800;font-family:var(--mono);line-height:1;background:linear-gradient(135deg,var(--b700),var(--b500));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.exec-sc-l{font-size:10px;color:#0369a1;font-weight:700;letter-spacing:.5px;margin-top:3px;text-transform:uppercase}
.exec-sc-s{font-size:10px;color:var(--t5);margin-top:2px;font-family:var(--mono)}
/* rooms */
.rooms{display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:11px;margin-bottom:20px}
.rc{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:17px;box-shadow:var(--sh);transition:box-shadow .18s,border-color .18s}
.rc:hover{box-shadow:var(--sh2);border-color:rgba(0,100,200,.2)}
.rc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
.rc-nm{font-weight:800;font-size:14px;color:var(--t1);margin-bottom:5px;letter-spacing:-.2px}
.rc-chips{display:flex;gap:4px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:500;padding:2px 7px;border-radius:4px;white-space:nowrap}
.hs{font-size:27px;font-weight:800;font-family:var(--mono);line-height:1;text-align:right}
.hg{font-size:9px;font-weight:700;letter-spacing:.7px;text-align:right;margin-top:2px;font-family:var(--mono)}
.mr{display:flex;align-items:center;gap:7px;margin-bottom:6px}
.mr-l{font-size:11px;color:var(--t4);width:64px;flex-shrink:0}
.mr-t{flex:1;height:4px;border-radius:99px;background:var(--s2);overflow:hidden}
.mr-f{height:100%;border-radius:99px;transition:width .6s ease}
.mr-v{font-size:11px;font-family:var(--mono);font-weight:700;width:40px;text-align:right;flex-shrink:0}
.rc-ft{display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--s2);font-size:11px;color:var(--t5)}
/* findings */
.findings{display:flex;flex-direction:column;gap:9px;margin-bottom:20px}
.fd{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:16px 18px;display:grid;grid-template-columns:auto 1fr auto;gap:13px;align-items:start;box-shadow:var(--sh);animation:up .33s ease both;transition:box-shadow .18s}
.fd:hover{box-shadow:var(--sh2)}
.fd-ic{width:37px;height:37px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fd-ty{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:var(--mono);margin-bottom:3px}
.fd-tt{font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px;letter-spacing:-.2px}
.fd-bd{font-size:12px;color:var(--t3);line-height:1.6}
.fd-bd strong{color:var(--t1);font-weight:700}
.fd-tgs{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.fd-tag{display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;border-radius:4px;font-family:var(--mono);font-weight:600}
.fd-rt{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0}
.conf{text-align:center;background:var(--s1);border:1px solid var(--bd);border-radius:7px;padding:7px 11px}
.conf-v{font-size:15px;font-weight:800;font-family:var(--mono)}
.conf-l{font-size:9px;color:var(--t5);text-transform:uppercase;letter-spacing:.5px;margin-top:1px}
.abt{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid;font-family:var(--sans);transition:opacity .13s;white-space:nowrap}
.abt:hover{opacity:.78}
/* trends */
.trs{display:grid;grid-template-columns:repeat(auto-fill,minmax(296px,1fr));gap:13px;margin-bottom:20px}
.tr{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:18px;box-shadow:var(--sh)}
.tr-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}
.tr-tt{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:2px}
.tr-sb{font-size:11px;color:var(--t5);font-family:var(--mono)}
.tr-v{font-size:21px;font-weight:800;font-family:var(--mono);text-align:right}
.tr-d{font-size:11px;font-weight:700;font-family:var(--mono);display:flex;align-items:center;gap:3px;justify-content:flex-end;margin-top:2px}
.bars{display:flex;align-items:flex-end;gap:3px;height:52px}
.bw{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.b{width:100%;border-radius:3px 3px 0 0;transition:height .45s ease;min-height:2px}
.bl{font-size:9px;color:var(--t5);font-family:var(--mono)}
/* recs */
.recs{display:flex;flex-direction:column;gap:9px;margin-bottom:20px}
.rec{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:15px 18px;box-shadow:var(--sh);display:grid;grid-template-columns:auto 1fr auto;gap:13px;align-items:center;animation:up .33s ease both;transition:box-shadow .18s}
.rec:hover{box-shadow:var(--sh2)}
.rec-ic{width:35px;height:35px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rec-pr{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:var(--mono);margin-bottom:2px}
.rec-tt{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px}
.rec-bd{font-size:12px;color:var(--t4);line-height:1.5}
.rec-rt{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
.eff{text-align:center;background:var(--s1);border:1px solid var(--bd);border-radius:7px;padding:5px 9px}
.eff-v{font-size:12px;font-weight:700;font-family:var(--mono)}
.eff-l{font-size:9px;color:var(--t5);text-transform:uppercase;letter-spacing:.4px}
/* predictions */
.alerts{display:flex;flex-direction:column;gap:7px}
.al{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:13px 15px;display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;box-shadow:var(--sh);animation:up .33s ease both}
.al-d{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.al-tt{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:2px}
.al-bd{font-size:11px;color:var(--t4)}
.al-wn{font-size:11px;font-family:var(--mono);font-weight:600;white-space:nowrap}
/* misc */
.legend{background:var(--s0);border:1px solid var(--bd);border-radius:var(--r);padding:15px 18px;box-shadow:var(--sh)}
.callout{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:var(--r);padding:17px 19px;margin-top:4px}
.pred-info{background:var(--pur-bg);border:1px solid #ddd6fe;border-radius:var(--r);padding:13px 17px;margin-bottom:14px;display:flex;align-items:flex-start;gap:9px}
`;

const PERIODS = ["This Week","This Month","Last Quarter","Last 6 Months"];
const SITES   = ["All Sites","Leoni Mateur","Leoni Sousse","Leoni Bir Mcherga"];

const KPI_DATA = {
  "This Week":    {score:72,sessions:47,  avgCO2:920, feedback:3.8,anomalies:6  },
  "This Month":   {score:78,sessions:186, avgCO2:870, feedback:4.0,anomalies:21 },
  "Last Quarter": {score:74,sessions:540, avgCO2:910, feedback:3.9,anomalies:58 },
  "Last 6 Months":{score:71,sessions:1080,avgCO2:940, feedback:3.7,anomalies:134},
};

const ROOMS_DATA = [
  {id:1,name:"Boardroom A",   floor:"Floor 2",dept:"Management", site:"Leoni Mateur",     health:62,grade:"FAIR",     metrics:{co2:{v:1180,max:1600,warn:1000,l:"CO₂"},temp:{v:25.8,max:30,warn:24,l:"Temp"},hvac:{v:62,max:100,warn:75,l:"HVAC"},fb:{v:3.8,max:5,warn:3.5,l:"Rating"}},sessions:14,overruns:4,util:78},
  {id:2,name:"Meeting Rm 3",  floor:"Floor 1",dept:"Engineering",site:"Leoni Sousse",      health:91,grade:"EXCELLENT",metrics:{co2:{v:760, max:1600,warn:1000,l:"CO₂"},temp:{v:22.4,max:30,warn:24,l:"Temp"},hvac:{v:71,max:100,warn:75,l:"HVAC"},fb:{v:4.5,max:5,warn:3.5,l:"Rating"}},sessions:22,overruns:2,util:65},
  {id:3,name:"Executive Suite",floor:"Floor 3",dept:"Executive", site:"Leoni Bir Mcherga",health:54,grade:"POOR",     metrics:{co2:{v:940, max:1600,warn:1000,l:"CO₂"},temp:{v:23.1,max:30,warn:24,l:"Temp"},hvac:{v:58,max:100,warn:75,l:"HVAC"},fb:{v:3.2,max:5,warn:3.5,l:"Rating"}},sessions:9, overruns:3,util:52},
  {id:4,name:"Innovation Lab", floor:"Ground", dept:"R&D",       site:"Leoni Mateur",     health:85,grade:"GOOD",     metrics:{co2:{v:580, max:1600,warn:1000,l:"CO₂"},temp:{v:21.3,max:30,warn:24,l:"Temp"},hvac:{v:82,max:100,warn:75,l:"HVAC"},fb:{v:4.1,max:5,warn:3.5,l:"Rating"}},sessions:11,overruns:1,util:43},
  {id:5,name:"Training Rm B",  floor:"Floor 1",dept:"HR",        site:"Leoni Sousse",      health:69,grade:"FAIR",     metrics:{co2:{v:850, max:1600,warn:1000,l:"CO₂"},temp:{v:24.9,max:30,warn:24,l:"Temp"},hvac:{v:72,max:100,warn:75,l:"HVAC"},fb:{v:3.6,max:5,warn:3.5,l:"Rating"}},sessions:18,overruns:5,util:89},
  {id:6,name:"Focus Pod 2",    floor:"Floor 2",dept:"Quality",   site:"Leoni Bir Mcherga",health:77,grade:"GOOD",     metrics:{co2:{v:680, max:1600,warn:1000,l:"CO₂"},temp:{v:22.8,max:30,warn:24,l:"Temp"},hvac:{v:68,max:100,warn:75,l:"HVAC"},fb:{v:3.9,max:5,warn:3.5,l:"Rating"}},sessions:8, overruns:0,util:31},
];

const FINDINGS = [
  {type:"critical",title:"Chronic CO₂ Overexposure — Boardroom A",         body:"Boardroom A exceeded the <strong>1,000 ppm threshold in 11 of 14 sessions</strong>. Peak: 1,420 ppm during a 12-person session. HVAC is running at 34% capacity during peak — insufficient.",tags:[{l:"Boardroom A",c:"#4338ca",bg:"#eef2ff"},{l:"CO₂",c:"#ea580c",bg:"#fff7ed"}],confidence:96,source:"22 sensor readings",action:"Review HVAC"},
  {type:"critical",title:"Equipment Failure Pattern — Executive Suite",      body:"AV system generated <strong>3 fault reports and 2 IT escalations</strong>. Equipment scores: 2.5/5. Projector (2019) is 14 months past service interval. Failure risk: <strong>73%</strong>.",tags:[{l:"Executive Suite",c:"#4338ca",bg:"#eef2ff"},{l:"Equipment",c:"#dc2626",bg:"#fef2f2"}],confidence:89,source:"Feedback + logs",action:"Schedule maintenance"},
  {type:"warning", title:"High Overrun Rate — Training Room B",              body:"<strong>27.8% overrun rate</strong> (5 of 18 sessions). Avg overrun: 18 min, causing 3 booking conflicts — highest across all rooms.",tags:[{l:"Training Rm B",c:"#4338ca",bg:"#eef2ff"},{l:"Scheduling",c:"#ea580c",bg:"#fff7ed"}],confidence:94,source:"14 sessions",action:"Adjust policy"},
  {type:"warning", title:"Temperature Drift During Extended Sessions",       body:"Consistent <strong>+1.8°C rise per 45 min</strong> in sessions over 60 min across 3 rooms. HVAC doesn't compensate for thermal load. Correlates with <strong>-0.6★ satisfaction</strong> past 75 min.",tags:[{l:"Multi-Room",c:"#4338ca",bg:"#eef2ff"},{l:"Temperature",c:"#ea580c",bg:"#fff7ed"}],confidence:87,source:"38 long sessions",action:"Update HVAC rules"},
  {type:"positive",title:"Meeting Room 3 Consistently Exceeds Standards",   body:"<strong>CO₂ below 800 ppm in 100% of sessions</strong>, temp within 20–24°C band in 95%. Satisfaction: <strong>4.5/5</strong>. Config is a best-practice <strong>template</strong> for underperforming rooms.",tags:[{l:"Meeting Rm 3",c:"#16a34a",bg:"#f0fdf4"},{l:"Best Practice",c:"#0369a1",bg:"#f0f9ff"}],confidence:99,source:"22 sessions",action:"Use as template"},
  {type:"positive",title:"Zero Overruns — Focus Pod 2 & Innovation Lab",    body:"<strong>Zero overruns</strong> across 19 combined sessions. Shorter slots (30–45 min) align with actual needs. Department-level guidance could reduce site-wide overruns.",tags:[{l:"Focus Pod 2",c:"#16a34a",bg:"#f0fdf4"},{l:"Innovation Lab",c:"#16a34a",bg:"#f0fdf4"}],confidence:100,source:"19 sessions",action:"Share practice"},
];

const TRENDS = [
  {title:"Avg CO₂",     sub:"ppm · 7-day",     val:"870 ppm", delta:"-8.4%",dir:"down",good:true, color:"#0369a1",bars:[920,980,1020,940,890,850,870]},
  {title:"Satisfaction",sub:"avg rating",       val:"3.94/5",  delta:"+0.14",dir:"up",  good:true, color:"#f59e0b",bars:[3.6,3.7,3.8,3.9,3.9,4.0,3.94]},
  {title:"Overrun Rate",sub:"% sessions",       val:"17.0%",   delta:"-2.1pp",dir:"down",good:true,color:"#dc2626",bars:[22,20,19,18,17,16,17]},
  {title:"HVAC Eff.",   sub:"% optimal",        val:"68%",     delta:"+3pp", dir:"up",  good:true, color:"#16a34a",bars:[60,62,65,64,68,70,68]},
];
const TR_LABELS = ["M","T","W","T","F","S","S"];

const RECS = [
  {p:"CRITICAL",c:"#dc2626",bg:"#fef2f2",icon:<FiZap size={15} color="#dc2626"/>,     title:"Upgrade HVAC — Boardroom A",                   body:"Unit (2017) undersized for peak occupancy. Replace with 15+ occupant rating. Est. 4,200–5,800 TND.",effort:"High",  impact:"Critical",eta:"30 days"},
  {p:"HIGH",    c:"#ea580c",bg:"#fff7ed",icon:<FiSettings size={15} color="#ea580c"/>,title:"Replace AV — Executive Suite",                  body:"Projector and screen controller past service life. Assign backup unit for critical sessions.",          effort:"Medium",impact:"High",   eta:"2 weeks"},
  {p:"HIGH",    c:"#ea580c",bg:"#fff7ed",icon:<FiClock size={15} color="#ea580c"/>,   title:"Booking buffers — Training Room B",             body:"Add 15-min buffer after HR/Training sessions. Require approval for bookings over 90 min.",              effort:"Low",   impact:"High",   eta:"Immediate"},
  {p:"MEDIUM",  c:"#ca8a04",bg:"#fefce8",icon:<FiActivity size={15} color="#ca8a04"/>,title:"Adaptive HVAC for long sessions",               body:"Increase airflow by 15% every 30 min for sessions over 60 min. Projected +0.5★ satisfaction lift.",      effort:"Low",   impact:"Medium", eta:"1 week"},
  {p:"MEDIUM",  c:"#ca8a04",bg:"#fefce8",icon:<FiTarget size={15} color="#ca8a04"/>,  title:"Replicate Meeting Room 3 HVAC config",         body:"Apply best-performer HVAC schedule as baseline to Boardroom A and Executive Suite.",                      effort:"Low",   impact:"Medium", eta:"3 days"},
  {p:"LOW",     c:"#0369a1",bg:"#f0f9ff",icon:<FiUsers size={15} color="#0369a1"/>,   title:"Publish booking best-practice guide",           body:"Compile zero-overrun room insights into a 1-page guide for department coordinators. ~12% overrun reduction.",effort:"Low",impact:"Medium",eta:"1 week"},
];

const PREDS = [
  {c:"#dc2626",title:"Boardroom A HVAC likely to fail in 60 days",         body:"Vibration anomaly pattern over 18 days. Inspect before Feb 28.",                     when:"~60 days"},
  {c:"#ea580c",title:"Executive Suite CO₂ projected to worsen",            body:"Occupancy +15% next month. Current ventilation insufficient without action.",         when:"~30 days"},
  {c:"#ca8a04",title:"Training Room B on track for 35% overrun rate",      body:"Session frequency rising. Without policy changes, conflict rate will double.",        when:"~3 weeks"},
  {c:"#0369a1",title:"Innovation Lab lighting sensor drift detected",       body:"Lux readings dropping 0.3%/day. Calibrate before readings become unreliable.",       when:"~45 days"},
  {c:"#16a34a",title:"Meeting Room 3 on track for quarterly excellence",   body:"Top-tier performance maintained across all dimensions. No action required.",          when:"Sustained"},
];

// helpers
const hColor = h => h>=85?"#16a34a":h>=70?"#0369a1":h>=55?"#ea580c":"#dc2626";
const mColor = (v,w) => v>w?"#dc2626":v>w*.85?"#ea580c":"#16a34a";
const tColor = t => t==="critical"?"#dc2626":t==="warning"?"#ea580c":"#16a34a";
const tBg    = t => t==="critical"?"#fef2f2":t==="warning"?"#fff7ed":"#f0fdf4";
const aBd    = t => t==="critical"?"#fecaca":t==="warning"?"#fed7aa":"#bbf7d0";
const typeLabel = t => t==="critical"?"Critical Issue":t==="warning"?"Warning":"Positive Finding";
const typeIcon  = t => t==="critical"?<FiAlertTriangle size={16}/>:t==="warning"?<FiAlertCircle size={16}/>:<FiCheckCircle size={16}/>;

// atoms
const MBar = memo(({l,v,max,warn})=>{
  const col = mColor(v,warn);
  const unit = l==="CO₂"?" ppm":l==="Temp"?"°C":l==="Rating"?"/5":"%";
  return(
    <div className="mr">
      <span className="mr-l">{l}</span>
      <div className="mr-t"><div className="mr-f" style={{width:`${(v/max)*100}%`,background:col}}/></div>
      <span className="mr-v" style={{color:col}}>{v}{unit}</span>
    </div>
  );
});

const RoomCard = memo(({r})=>{
  const hc = hColor(r.health);
  return(
    <div className="rc">
      <div className="rc-top">
        <div>
          <div className="rc-nm">{r.name}</div>
          <div className="rc-chips">
            <span className="chip" style={{background:"#f8fafc",color:"#475569",border:"1px solid #e2e8f0"}}><FiTag size={9}/>{r.floor}</span>
            <span className="chip" style={{background:"#f0f9ff",color:"#0369a1",border:"1px solid #bae6fd"}}><FiMapPin size={9}/>{r.site}</span>
          </div>
        </div>
        <div><div className="hs" style={{color:hc}}>{r.health}</div><div className="hg" style={{color:hc}}>{r.grade}</div></div>
      </div>
      {Object.entries(r.metrics).map(([k,m])=><MBar key={k} l={m.l} v={m.v} max={m.max} warn={m.warn}/>)}
      <div className="rc-ft">
        <span style={{display:"flex",alignItems:"center",gap:4}}><FiCalendar size={10}/>{r.sessions} sessions</span>
        <span style={{display:"flex",alignItems:"center",gap:4,color:r.overruns>3?"#ea580c":"#94a3b8"}}><FiClock size={10}/>{r.overruns} overruns</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><FiActivity size={10}/>{r.util}% util</span>
      </div>
    </div>
  );
});

const Finding = memo(({f,i})=>{
  const tc=tColor(f.type),bg=tBg(f.type),bd=aBd(f.type);
  return(
    <div className="fd" style={{animationDelay:`${i*.07}s`,borderLeft:`3px solid ${tc}`}}>
      <div className="fd-ic" style={{background:bg,color:tc}}>{typeIcon(f.type)}</div>
      <div>
        <div className="fd-ty" style={{color:tc}}>{typeLabel(f.type)}</div>
        <div className="fd-tt">{f.title}</div>
        <div className="fd-bd" dangerouslySetInnerHTML={{__html:f.body}}/>
        <div className="fd-tgs">
          {f.tags.map(t=><span key={t.l} className="fd-tag" style={{color:t.c,background:t.bg,border:`1px solid ${t.c}22`}}>{t.l}</span>)}
          <span className="fd-tag" style={{color:"#64748b",background:"#f1f5f9",border:"1px solid #e2e8f0"}}><FiEye size={9}/>&nbsp;{f.source}</span>
        </div>
      </div>
      <div className="fd-rt">
        <div className="conf"><div className="conf-v" style={{color:tc}}>{f.confidence}%</div><div className="conf-l">confidence</div></div>
        <button className="abt" style={{color:tc,background:bg,borderColor:bd}}><FiChevronRight size={9}/>{f.action}</button>
      </div>
    </div>
  );
});

const TrendCard = memo(({t})=>{
  const maxB=Math.max(...t.bars),minB=Math.min(...t.bars),range=maxB-minB||1;
  const dc=t.good?"#16a34a":"#dc2626";
  const Di=t.dir==="up"?FiArrowUp:FiArrowDown;
  return(
    <div className="tr">
      <div className="tr-hd">
        <div><div className="tr-tt">{t.title}</div><div className="tr-sb">{t.sub}</div></div>
        <div><div className="tr-v" style={{color:t.color}}>{t.val}</div><div className="tr-d" style={{color:dc}}><Di size={10}/>{t.delta}</div></div>
      </div>
      <div className="bars">
        {t.bars.map((v,i)=>{
          const h=Math.max(((v-minB)/range)*46+7,3),last=i===t.bars.length-1;
          return(
            <div key={i} className="bw">
              <div className="b" style={{height:`${h}px`,background:last?t.color:`${t.color}55`}}/>
              <span className="bl">{TR_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const RecCard = memo(({r,i})=>(
  <div className="rec" style={{animationDelay:`${i*.06}s`}}>
    <div className="rec-ic" style={{background:r.bg}}>{r.icon}</div>
    <div>
      <div className="rec-pr" style={{color:r.c}}>{r.p}</div>
      <div className="rec-tt">{r.title}</div>
      <div className="rec-bd">{r.body}</div>
      <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
        {[[`ETA: ${r.eta}`,"#475569","#f1f5f9","#e2e8f0"],[`Impact: ${r.impact}`,r.c,r.bg,r.c+"33"]].map(([txt,c,bg,bd],j)=>(
          <span key={j} style={{fontSize:10,fontFamily:"var(--mono)",fontWeight:700,color:c,background:bg,border:`1px solid ${bd}`,borderRadius:5,padding:"2px 8px"}}>{txt}</span>
        ))}
      </div>
    </div>
    <div className="rec-rt">
      <div className="eff"><div className="eff-v" style={{color:r.effort==="Low"?"#16a34a":r.effort==="High"?"#dc2626":"#ea580c"}}>{r.effort}</div><div className="eff-l">effort</div></div>
      <button className="abt" style={{color:r.c,background:r.bg,borderColor:r.c+"44",fontSize:11}}>Assign <FiChevronRight size={9}/></button>
    </div>
  </div>
));

// shared SH component
const SH = ({dot,label,meta,action,onAction}) => (
  <div className="sh">
    <div className="sh-l"><span className="sh-dot" style={{background:dot}}/>{label}</div>
    {meta && <span className="sh-m">{meta}</span>}
    {action && <button className="sh-a" onClick={onAction}>{action}<FiChevronRight size={10}/></button>}
  </div>
);

const FIND_TABS = [["all","All"],["critical","Critical"],["warning","Warnings"],["positive","Positives"]];
const FT_STYLE = {critical:{on:"#fef2f2",c:"#dc2626",b:"#fecaca"},warning:{on:"#fff7ed",c:"#ea580c",b:"#fed7aa"},positive:{on:"#f0fdf4",c:"#16a34a",b:"#bbf7d0"},all:{on:"#002857",c:"#fff",b:"#002857"}};

const NAV_TABS = [{id:"overview",l:"Overview"},{id:"rooms",l:"Room Health"},{id:"findings",l:"AI Findings"},{id:"trends",l:"Trends"},{id:"recs",l:"Recommendations"},{id:"predictions",l:"Predictions"}];

export default function FM_Reports() {
  const [period,  setPeriod]  = useState("This Month");
  const [site,    setSite]    = useState("All Sites");
  const [tab,     setTab]     = useState("overview");
  const [findTab, setFindTab] = useState("all");

  const kpi = KPI_DATA[period] ?? KPI_DATA["This Month"];

  const rooms = useMemo(()=>ROOMS_DATA.filter(r=>site==="All Sites"||r.site===site),[site]);
  const finds = useMemo(()=>findTab==="all"?FINDINGS:FINDINGS.filter(f=>f.type===findTab),[findTab]);

  const KPIS = useMemo(()=>[
    {ic:<FiBarChart2 size={13} color="#0064c8"/>,ibg:"#eff6ff",v:kpi.score,   l:"Health Score",  u:"",   c:"#002857",d:"+4",  g:true},
    {ic:<FiCalendar  size={13} color="#0369a1"/>,ibg:"#f0f9ff",v:kpi.sessions,l:"Sessions",      u:"",   c:"#0f172a",d:"+12%",g:true},
    {ic:<FiWind      size={13} color="#ea580c"/>,ibg:"#fff7ed",v:kpi.avgCO2,  l:"Avg CO₂ (ppm)", u:"",   c:"#ea580c",d:"-8%", g:true},
    {ic:<FiStar      size={13} color="#f59e0b"/>,ibg:"#fefce8",v:kpi.feedback,l:"Satisfaction",  u:"/5", c:"#ca8a04",d:"+0.1",g:true},
    {ic:<FiAlertCircle size={13} color="#dc2626"/>,ibg:"#fef2f2",v:kpi.anomalies,l:"Anomalies",  u:"",   c:"#dc2626",d:"-3",  g:true},
  ],[kpi]);

  return (
    <>
      <style>{CSS}</style>
      <div className="rp">
        <div className="rp-top">
          <div className="rp-top-row">
            <div>
              <div className="rp-eyebrow">Leoni Tunisia · Smart Room AI Engine</div>
              <div className="rp-h1"><span className="rp-h1-icon"><FiCpu size={17}/></span>AI-Generated Reports</div>
              <div style={{display:"flex",alignItems:"center",gap:11,marginTop:5}}>
                <span className="rp-pill"><span className="rp-dot"/>Last generated: Today at 08:00</span>
                <span className="rp-sub">sensor data · feedback · usage patterns</span>
              </div>
            </div>
            <div className="rp-ctrl">
              <select className="rp-sel" value={period} onChange={e=>setPeriod(e.target.value)}>{PERIODS.map(p=><option key={p}>{p}</option>)}</select>
              <select className="rp-sel" value={site}   onChange={e=>setSite(e.target.value)}>{SITES.map(s=><option key={s}>{s}</option>)}</select>
              <button className="rp-btn rp-ghost"><FiRefreshCw size={11}/>Regenerate</button>
              <button className="rp-btn rp-accent"><FiDownload size={11}/>Export PDF</button>
            </div>
          </div>
          <div className="rp-tabs">
            {NAV_TABS.map(t=><button key={t.id} className={`rp-tab${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>)}
          </div>
        </div>

        <div className="rp-body">
          {/* KPIs — always visible */}
          <div className="kpis">
            {KPIS.map((k,i)=>(
              <div key={k.l} className="kpi" style={{animationDelay:`${i*.07}s`}}>
                <div className="kpi-ic" style={{background:k.ibg}}>{k.ic}</div>
                <div className="kpi-v" style={{color:k.c}}>{k.v}{k.u}</div>
                <div className="kpi-l">{k.l}</div>
                <div className="kpi-d" style={{color:k.g?"#16a34a":"#dc2626"}}>
                  {k.g?<FiArrowUp size={9}/>:<FiArrowDown size={9}/>}{k.d} vs prior
                </div>
              </div>
            ))}
          </div>

          {tab==="overview" && (
            <>
              <SH dot="#0064c8" label="Executive Summary" meta={`AI-synthesized · ${period}`}/>
              <div className="exec">
                <div className="exec-g">
                  <div>
                    <div className="exec-hd">Facility performance is improving but 2 rooms require urgent intervention</div>
                    <div className="exec-bd">
                      Across <strong>{rooms.length} monitored rooms</strong>, the AI analyzed {kpi.sessions} sessions, {kpi.anomalies} anomalies, and {Math.round(kpi.sessions*2.3)} feedback data points during {period.toLowerCase()}. Health score: <strong>{kpi.score}/100</strong> — up 4 points.<br/><br/>
                      <strong>Two rooms need immediate action:</strong> Boardroom A has chronic CO₂ overexposure (peak 1,420 ppm) from an undersized HVAC, and the Executive Suite's AV is in failure-risk zone. Training Room B has the highest overrun rate at 27.8%.<br/><br/>
                      <strong>Meeting Room 3 is the top performer</strong> across all six dimensions. The AI generated <strong>6 prioritized actions</strong> and <strong>4 predictive risks</strong> for the next 30–60 days.
                    </div>
                  </div>
                  <div className="exec-sc">
                    <div className="exec-sc-v">{kpi.score}</div>
                    <div className="exec-sc-l">Health Score</div>
                    <div className="exec-sc-s">out of 100</div>
                  </div>
                </div>
              </div>
              <SH dot="#dc2626" label="Top Findings" action="View all" onAction={()=>setTab("findings")}/>
              <div className="findings">{FINDINGS.slice(0,3).map((f,i)=><Finding key={i} f={f} i={i}/>)}</div>
              <SH dot="#ea580c" label="Priority Recommendations" action="View all" onAction={()=>setTab("recs")}/>
              <div className="recs">{RECS.slice(0,3).map((r,i)=><RecCard key={i} r={r} i={i}/>)}</div>
            </>
          )}

          {tab==="rooms" && (
            <>
              <SH dot="#0064c8" label="Room Health Scores" meta={`${rooms.length} rooms · composite 0–100`}/>
              <div className="rooms">{rooms.map(r=><RoomCard key={r.id} r={r}/>)}</div>
              <div className="legend">
                <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:9,display:"flex",alignItems:"center",gap:7}}><FiInfo size={13} color="#0369a1"/>Score Methodology</div>
                <div style={{fontSize:12,color:"#475569",lineHeight:1.65}}>Weighted: <strong>CO₂ 25%</strong> · <strong>Temp 20%</strong> · <strong>HVAC 20%</strong> · <strong>Satisfaction 20%</strong> · <strong>Overruns 10%</strong> · <strong>Anomalies 5%</strong>. Updated post-session.</div>
                <div style={{display:"flex",gap:9,marginTop:11,flexWrap:"wrap"}}>
                  {[["85–100","EXCELLENT","#16a34a","#f0fdf4"],["70–84","GOOD","#0369a1","#f0f9ff"],["55–69","FAIR","#ea580c","#fff7ed"],["0–54","POOR","#dc2626","#fef2f2"]].map(([r,l,c,bg])=>(
                    <span key={l} style={{fontSize:10,fontWeight:700,color:c,background:bg,border:`1px solid ${c}33`,borderRadius:5,padding:"3px 10px",fontFamily:"var(--mono)"}}>{r} · {l}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab==="findings" && (
            <>
              <div className="sh">
                <div className="sh-l"><span className="sh-dot" style={{background:"#dc2626"}}/>AI Findings</div>
                <div style={{display:"flex",gap:5}}>
                  {FIND_TABS.map(([k,l])=>{
                    const on=findTab===k,fc=FT_STYLE[k];
                    return <button key={k} onClick={()=>setFindTab(k)} style={{padding:"5px 11px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid",fontFamily:"var(--mono)",transition:".13s",background:on?fc.on:"#fff",color:on?fc.c:"#94a3b8",borderColor:on?fc.b:"#e2e8f0"}}>{l}</button>;
                  })}
                </div>
              </div>
              <div className="findings">{finds.map((f,i)=><Finding key={i} f={f} i={i}/>)}</div>
            </>
          )}

          {tab==="trends" && (
            <>
              <SH dot="#0369a1" label="Performance Trends" meta={`7-day rolling · ${period}`}/>
              <div className="trs">{TRENDS.map((t,i)=><TrendCard key={i} t={t}/>)}</div>
              <div className="callout">
                <div style={{fontSize:13,fontWeight:700,color:"#0369a1",marginBottom:6,display:"flex",alignItems:"center",gap:7}}><FiCpu size={13}/>AI Trend Insight</div>
                <div style={{fontSize:13,color:"#0c4a6e",lineHeight:1.65}}>
                  The key pattern is a <strong>concurrent improvement in CO₂ and satisfaction</strong> — consistent with better HVAC compliance. The overrun rate remains above the 15% target. AI projects target is reachable within 3 weeks <em>only if</em> Training Room B booking policy is revised. Without action, overruns stabilize at ~18–19%.
                </div>
              </div>
            </>
          )}

          {tab==="recs" && (
            <>
              <SH dot="#ea580c" label="AI Recommendations" meta={`${RECS.length} actions · by impact`}/>
              <div className="recs">{RECS.map((r,i)=><RecCard key={i} r={r} i={i}/>)}</div>
            </>
          )}

          {tab==="predictions" && (
            <>
              <SH dot="#7c3aed" label="Predictive Alerts" meta="AI-forecasted · next 60 days"/>
              <div className="pred-info">
                <FiCpu size={14} color="#7c3aed" style={{flexShrink:0,marginTop:1}}/>
                <div style={{fontSize:12,color:"#4c1d95",lineHeight:1.6}}>Alerts generated from <strong>sensor trend vectors, maintenance logs, usage projections, and anomaly frequencies</strong>. Recalculated post-session. Sub-60% confidence alerts are suppressed.</div>
              </div>
              <div className="alerts">
                {PREDS.map((a,i)=>(
                  <div key={i} className="al" style={{animationDelay:`${i*.07}s`,borderLeft:`3px solid ${a.c}`}}>
                    <div className="al-d" style={{background:a.c}}/>
                    <div><div className="al-tt">{a.title}</div><div className="al-bd">{a.body}</div></div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                      <span className="al-wn" style={{color:a.c}}>{a.when}</span>
                      <button className="abt" style={{color:a.c,background:`${a.c}12`,borderColor:`${a.c}30`,fontSize:10}}>Track <FiChevronRight size={9}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}