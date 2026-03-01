import { useState, useEffect, useCallback } from "react";
import {
  FiThermometer, FiWind, FiDroplet, FiSun, FiSave, FiRotateCcw,
  FiToggleLeft, FiToggleRight, FiSliders, FiTrendingUp, FiCpu,
  FiZap, FiUsers, FiInfo, FiChevronDown, FiChevronRight,
  FiCheck, FiX, FiAlertTriangle, FiActivity,
} from "react-icons/fi";

/* ── TOKENS ─────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --navy:#002857; --blue:#0064c8; --sky:#00b2ff;
  --bg:#f0f4f8; --card:#fff; --subtle:#f8fafc;
  --border:#e2e8f0; --border2:#f1f5f9;
  --tx:#0f172a; --tx2:#475569; --muted:#94a3b8;
  --green:#16a34a; --red:#dc2626; --orange:#ea580c; --yellow:#ca8a04;
  --indigo:#4f46e5; --purple:#7c3aed;
  --mono:'JetBrains Mono',monospace; --sans:'Plus Jakarta Sans',sans-serif;
  --r:12px; --r-sm:8px;
  --sh:0 1px 4px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04);
  --sh-lg:0 8px 32px rgba(0,40,87,.12);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.pg{min-height:100vh;background:var(--bg);padding:28px 24px;font-family:var(--sans);color:var(--tx);}

/* ── Page header ── */
.ph{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;margin-bottom:24px;}
.ph-l .ey{font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;font-family:var(--mono);margin-bottom:5px;}
.ph-l h1{font-size:22px;font-weight:800;color:var(--tx);letter-spacing:-.5px;display:flex;align-items:center;gap:10px;}
.ph-ico{width:36px;height:36px;background:linear-gradient(135deg,var(--navy),var(--blue));border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.ph-sub{font-size:12px;color:var(--muted);margin-top:5px;}
.ph-r{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--r-sm);font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--card);color:var(--tx2);transition:all .15s;font-family:var(--sans);}
.btn:hover{background:var(--subtle);border-color:#cbd5e1;color:var(--tx);}
.btn-primary{background:linear-gradient(135deg,var(--navy),var(--blue));color:#fff;border-color:transparent;box-shadow:0 2px 8px rgba(0,40,87,.2);}
.btn-primary:hover{box-shadow:0 4px 16px rgba(0,40,87,.3);filter:brightness(1.05);}
.btn-primary:disabled{background:#cbd5e1;box-shadow:none;cursor:not-allowed;filter:none;}
.btn-danger{border-color:transparent;background:#fef2f2;color:var(--red);}
.btn-danger:hover{background:#fee2e2;}

/* ── AI Toggle ── */
.ai-pill{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 14px;font-size:12px;font-weight:600;color:var(--tx2);box-shadow:var(--sh);}
.ai-pill.on{border-color:#bae6fd;background:#f0f9ff;color:#0369a1;}
.tog{width:40px;height:22px;background:#cbd5e1;border-radius:99px;position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0;}
.tog.on{background:linear-gradient(135deg,var(--navy),var(--blue));}
.tog::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.tog.on::after{transform:translateX(18px);}

/* ── Panel ── */
.panel{background:var(--card);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:16px;overflow:hidden;}
.panel-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border2);background:var(--subtle);}
.panel-hdr h2{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--tx);letter-spacing:-.2px;}
.panel-ico{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.panel-body{padding:18px;}

/* ── Param grid ── */
.params-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.param-card{background:var(--subtle);border:1px solid var(--border);border-radius:var(--r-sm);padding:14px;}
.param-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.param-hdr h3{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--tx);}
.w-ctrl{display:flex;align-items:center;gap:5px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--muted);font-family:var(--mono);}
.w-inp{width:36px;background:transparent;border:none;outline:none;font-size:11px;font-family:var(--mono);color:var(--tx);font-weight:600;text-align:center;}
.fields-grid{display:grid;gap:8px;}
.fields-grid.cols3{grid-template-columns:repeat(3,1fr);}
.fields-grid.cols2{grid-template-columns:repeat(2,1fr);}
.field{display:flex;flex-direction:column;gap:3px;}
.field label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;font-family:var(--mono);}
.field input{padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:var(--mono);background:var(--card);color:var(--tx);outline:none;transition:border-color .15s;}
.field input:focus{border-color:var(--sky);box-shadow:0 0 0 3px rgba(0,178,255,.1);}

/* ── Weight bar ── */
.weight-bar{height:4px;border-radius:99px;background:var(--border);margin-top:10px;overflow:hidden;}
.weight-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--navy),var(--blue));transition:width .4s ease;}

/* ── Presence ── */
.presence{background:linear-gradient(135deg,#eff6ff,#f0f9ff);border:1px solid #bae6fd;border-radius:var(--r-sm);padding:14px;margin-top:12px;}
.pres-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.pres-hdr h3{font-size:12px;font-weight:700;color:#0369a1;display:flex;align-items:center;gap:6px;}
.pres-opts{display:flex;gap:16px;flex-wrap:wrap;}
.cb{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2);cursor:pointer;}
.cb input{accent-color:var(--blue);width:14px;height:14px;}

/* ── Score ── */
.score-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.formula-box{background:var(--subtle);border:1px solid var(--border);border-radius:var(--r-sm);padding:14px;font-family:var(--mono);font-size:11px;color:var(--tx2);margin-bottom:10px;}
.formula-line{padding-left:12px;margin-top:3px;color:var(--tx);}
.w-warn{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--orange);font-family:var(--mono);}
.w-ok{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--green);font-family:var(--mono);}
.live-box{background:var(--subtle);border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden;}
.live-hdr{padding:10px 12px;background:var(--border2);font-size:10px;font-weight:700;letter-spacing:1px;color:var(--muted);text-transform:uppercase;font-family:var(--mono);display:flex;justify-content:space-between;align-items:center;}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.sc-rows{padding:10px 12px;}
.sc-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border2);font-size:12px;}
.sc-row:last-child{border-bottom:none;}
.sc-bar{width:60px;height:4px;border-radius:99px;background:var(--border);overflow:hidden;}
.sc-fill{height:100%;border-radius:99px;transition:width .6s;}
.sc-total{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-top:1px solid var(--border);background:var(--card);}
.sc-total span:first-child{font-size:12px;font-weight:700;color:var(--tx);}
.score-num{font-size:20px;font-weight:800;font-family:var(--mono);}
.sg{color:var(--green);} .sa{color:var(--yellow);} .sr{color:var(--red);}

/* ── AI Suggestions ── */
.sugg-list{display:flex;flex-direction:column;gap:10px;}
.sugg-card{border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden;transition:box-shadow .2s;}
.sugg-card:hover{box-shadow:var(--sh-lg);}
.sugg-card.accepted{opacity:.6;pointer-events:none;}
.sugg-inner{padding:14px;}
.sugg-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;}
.sugg-top h4{font-size:13px;font-weight:700;color:var(--tx);margin-bottom:3px;}
.sugg-reason{font-size:11px;color:var(--muted);}
.conf-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;font-family:var(--mono);white-space:nowrap;}
.sugg-vals{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;background:var(--subtle);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;margin-bottom:10px;}
.val-block{display:flex;flex-direction:column;gap:2px;}
.val-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;font-family:var(--mono);}
.val-cur{font-size:13px;font-weight:600;color:var(--tx2);font-family:var(--mono);}
.val-sug{font-size:13px;font-weight:700;color:var(--green);font-family:var(--mono);}
.val-arr{color:var(--muted);}
.sugg-ft{display:flex;justify-content:space-between;align-items:center;}
.impact{font-size:11px;color:var(--tx2);display:flex;align-items:center;gap:5px;}
.sugg-acts{display:flex;gap:6px;}
.acc-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;background:var(--green);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;transition:background .15s;}
.acc-btn:hover{background:#15803d;}
.ign-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;background:var(--subtle);color:var(--tx2);border:1px solid var(--border);border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;}
.ign-btn:hover{background:#fee2e2;color:var(--red);border-color:#fecaca;}
.accepted-banner{display:flex;align-items:center;gap:6px;padding:8px 14px;background:#f0fdf4;border-top:1px solid #bbf7d0;font-size:11px;font-weight:600;color:var(--green);font-family:var(--mono);}

/* ── Impact ── */
.imp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
.imp-card{border-radius:var(--r-sm);padding:14px;text-align:center;border:1px solid transparent;}
.imp-card.comp{background:#f0fdf4;border-color:#bbf7d0;}
.imp-card.mod{background:#fefce8;border-color:#fde68a;}
.imp-card.crit{background:#fef2f2;border-color:#fecaca;}
.imp-n{font-size:26px;font-weight:800;font-family:var(--mono);line-height:1.1;}
.imp-card.comp .imp-n{color:var(--green);} .imp-card.mod .imp-n{color:var(--yellow);} .imp-card.crit .imp-n{color:var(--red);}
.imp-l{font-size:10px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.4px;font-family:var(--mono);}
.shift-bar{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f0f9ff,#eff6ff);border:1px solid #bae6fd;border-radius:var(--r-sm);padding:12px 16px;font-size:12px;}
.shift-l{color:var(--tx2);}
.shift-r{display:flex;align-items:center;gap:8px;font-family:var(--mono);}
.shift-old{color:var(--muted);font-size:13px;}
.shift-arr{color:var(--muted);}
.shift-new{font-size:18px;font-weight:800;color:var(--green);}

/* ── Advanced ── */
.adv-tog{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:none;border:none;cursor:pointer;font-family:var(--sans);}
.adv-tog:hover{background:var(--subtle);}
.adv-tog h2{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--tx);}
.adv-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:0 18px 18px;}
.adv-sec h3{font-size:11px;font-weight:700;letter-spacing:1px;color:var(--muted);text-transform:uppercase;font-family:var(--mono);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border2);}
.sl-grp{margin-bottom:16px;}
.sl-grp label{display:block;font-size:12px;color:var(--tx2);margin-bottom:8px;}
.sl-grp input[type="range"]{width:100%;height:4px;background:var(--border);border-radius:99px;appearance:none;outline:none;}
.sl-grp input[type="range"]::-webkit-slider-thumb{appearance:none;width:16px;height:16px;background:linear-gradient(135deg,var(--navy),var(--blue));border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,40,87,.25);}
.sl-lbls{display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:var(--muted);font-family:var(--mono);}
.sl-lbls span:nth-child(2){font-weight:700;color:var(--tx);}
.num-field{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.num-field label{font-size:12px;color:var(--tx2);}
.num-field input{padding:7px 10px;border:1px solid var(--border);border-radius:var(--r-sm);font-size:12px;font-family:var(--mono);background:var(--card);color:var(--tx);outline:none;}
.num-field input:focus{border-color:var(--sky);box-shadow:0 0 0 3px rgba(0,178,255,.1);}

@media(max-width:900px){.params-grid,.score-grid,.adv-grid{grid-template-columns:1fr;}}
@media(max-width:600px){.pg{padding:16px;}.ph{flex-direction:column;}.imp-grid{grid-template-columns:1fr;}.sugg-vals{grid-template-columns:1fr;}.sugg-ft{flex-direction:column;gap:8px;align-items:flex-start;}}
`;

/* ── DATA ───────────────────────────────────────────────────── */
const SENSOR = { temperature: 23.1, co2: 620, humidity: 42, light: 250 };
const DEFAULT_MODEL = {
  temperature:   { min: 21, max: 24, ideal: 22.5, weight: 30 },
  co2:           { optimal: 450, warning: 800, critical: 1000, weight: 30 },
  humidity:      { min: 40, max: 60, ideal: 50, weight: 20 },
  lighting:      { min: 300, ideal: 400, weight: 20 },
  presenceLogic: { enabled: true, relaxLighting: true, expandTemp: true },
  advanced:      { smoothing: 5, averaging: 15, aiAggression: 50, energyBalance: 50 },
};
const AI_SUGGESTIONS = [
  { id: 1, param: "CO₂ Threshold",     cur: "1000 ppm", sug: "800 ppm",  conf: 85, confColor: "#16a34a", impact: "Improve air quality across 5 rooms",  reason: "Threshold too permissive during peak occupancy" },
  { id: 2, param: "Lighting Minimum",  cur: "200 lux",  sug: "350 lux",  conf: 72, confColor: "#ca8a04", impact: "Increase comfort in meeting rooms",     reason: "70% of sessions operate below optimal light" },
  { id: 3, param: "Temperature Range", cur: "19–26 °C", sug: "21–24 °C", conf: 91, confColor: "#0369a1", impact: "Reduce comfort complaints by ~45%",      reason: "Most complaints occur outside this range" },
];
const IMPACT = { compliant: 12, moderate: 3, critical: 2, avg: 8.2, newAvg: 8.7 };
const PARAMS = [
  { key: "temperature", label: "Temperature", icon: <FiThermometer/>, color: "#f97316", cols: 3, fields: [["min","Min °C",.5],["ideal","Ideal °C",.5],["max","Max °C",.5]], float: true },
  { key: "co2",         label: "CO₂",         icon: <FiWind/>,        color: "#7c3aed", cols: 3, fields: [["optimal","Optimal ppm",50],["warning","Warning ppm",50],["critical","Critical ppm",50]] },
  { key: "humidity",    label: "Humidity",     icon: <FiDroplet/>,     color: "#0369a1", cols: 3, fields: [["min","Min %",1],["ideal","Ideal %",1],["max","Max %",1]] },
  { key: "lighting",    label: "Lighting",     icon: <FiSun/>,         color: "#ca8a04", cols: 2, fields: [["min","Min lux",50],["ideal","Ideal lux",50]] },
];

/* ── HELPERS ───────────────────────────────────────────────── */
const load = () => { try { return JSON.parse(localStorage.getItem("cr_model")) || DEFAULT_MODEL; } catch { return DEFAULT_MODEL; } };
const scColor = s => s >= 8 ? "var(--green)" : s >= 6 ? "var(--yellow)" : "var(--red)";
const scClass = s => s >= 8 ? "sg" : s >= 6 ? "sa" : "sr";

export default function FM_ComfortRules() {
  const [model,   setModel]   = useState(load);
  const [dirty,   setDirty]   = useState(false);
  const [aiOn,    setAiOn]    = useState(true);
  const [advOpen, setAdvOpen] = useState(false);
  const [accepted, setAccepted] = useState(new Set());
  const [ignored,  setIgnored]  = useState(new Set());

  useEffect(() => { localStorage.setItem("cr_model", JSON.stringify(model)); }, [model]);

  const set = useCallback((sec, key, val) => {
    setModel(m => ({ ...m, [sec]: { ...m[sec], [key]: val } }));
    setDirty(true);
  }, []);

  const setWeight = (sec, raw) => {
    const n = Math.max(0, Math.min(100, parseInt(raw) || 0));
    const others = PARAMS.filter(p => p.key !== sec).reduce((s, p) => s + (model[p.key].weight || 0), 0);
    if (n + others > 100) return;
    set(sec, "weight", n);
  };

  const calcScore = () => {
    const d = SENSOR, m = model;
    const t = Math.min(10, Math.max(0, 10 * (1 - Math.abs(d.temperature - m.temperature.ideal) / 5)));
    const c = d.co2 <= m.co2.optimal ? 10 : d.co2 <= m.co2.warning ? 7 : d.co2 <= m.co2.critical ? 4 : 1;
    const h = d.humidity >= m.humidity.min && d.humidity <= m.humidity.max ? Math.max(0, 10 - Math.abs(d.humidity - m.humidity.ideal) * 0.5) : 4;
    const l = d.light >= m.lighting.min ? Math.min(10, d.light / m.lighting.ideal * 10) : 3;
    const f = ((t * m.temperature.weight + c * m.co2.weight + h * m.humidity.weight + l * m.lighting.weight) / 100).toFixed(1);
    return [{ label: "Temperature: 23.1°C", v: t }, { label: "CO₂: 620 ppm", v: c }, { label: "Humidity: 42%", v: h }, { label: "Lighting: 250 lux", v: l }].map(x => ({ ...x, v: parseFloat(x.v.toFixed(1)) })).concat([{ label: "__total", v: parseFloat(f) }]);
  };

  const scores = calcScore();
  const total  = scores.at(-1).v;
  const rows   = scores.slice(0, -1);
  const totalW = PARAMS.reduce((s, p) => s + (model[p.key].weight || 0), 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="pg">

        {/* ── Header ── */}
        <div className="ph">
          <div className="ph-l">
            <div className="ey">Leoni Tunisia · Smart Room AI</div>
            <h1><span className="ph-ico"><FiSliders size={17}/></span>Comfort Rules & AI Model</h1>
            <div className="ph-sub">Define environmental baselines used by the AI Comfort Engine</div>
          </div>
          <div className="ph-r">
            <div className={`ai-pill${aiOn ? " on" : ""}`}>
              <FiCpu size={13}/>
              <span>AI Optimization</span>
              <button className={`tog${aiOn ? " on" : ""}`} onClick={() => setAiOn(v => !v)} aria-label="toggle AI"/>
            </div>
            <button className="btn btn-danger" onClick={() => { if (window.confirm("Reset to defaults?")) { setModel(DEFAULT_MODEL); setDirty(false); } }}>
              <FiRotateCcw size={13}/>Reset
            </button>
            <button className={`btn btn-primary`} disabled={!dirty} onClick={() => { setDirty(false); }}>
              <FiSave size={13}/>Save Changes
            </button>
          </div>
        </div>

        {/* ── Baseline Parameters ── */}
        <div className="panel">
          <div className="panel-hdr">
            <h2>
              <span className="panel-ico" style={{ background:"#eff6ff" }}><FiSliders size={13} color="var(--blue)"/></span>
              Global Comfort Baseline
            </h2>
            <span style={{ fontSize:11, color:totalW === 100 ? "var(--green)" : "var(--orange)", fontFamily:"var(--mono)", fontWeight:700 }}>
              {totalW === 100 ? <span style={{display:"flex",gap:4,alignItems:"center"}}><FiCheck size={11}/>Weights balanced</span> : <span style={{display:"flex",gap:4,alignItems:"center"}}><FiAlertTriangle size={11}/>Weights: {totalW}%</span>}
            </span>
          </div>
          <div className="panel-body">
            <div className="params-grid">
              {PARAMS.map(({ key, label, icon, color, cols, fields, float }) => (
                <div className="param-card" key={key}>
                  <div className="param-hdr">
                    <h3 style={{ color }}>{icon} {label}</h3>
                    <div className="w-ctrl">
                      <span>Weight</span>
                      <input className="w-inp" type="number" value={model[key].weight} min="0" max="100"
                        onChange={e => setWeight(key, e.target.value)}/>
                      <span>%</span>
                    </div>
                  </div>
                  <div className={`fields-grid cols${cols}`}>
                    {fields.map(([field, lbl, step]) => (
                      <div className="field" key={field}>
                        <label>{lbl}</label>
                        <input type="number" value={model[key][field]} step={step}
                          onChange={e => set(key, field, float ? parseFloat(e.target.value) : parseInt(e.target.value))}/>
                      </div>
                    ))}
                  </div>
                  <div className="weight-bar"><div className="weight-fill" style={{ width: `${model[key].weight}%` }}/></div>
                </div>
              ))}
            </div>

            {/* Presence Logic */}
            <div className="presence">
              <div className="pres-hdr">
                <h3><FiUsers size={12}/>Presence Logic</h3>
                <button className={`tog${model.presenceLogic.enabled ? " on" : ""}`}
                  onClick={() => set("presenceLogic","enabled",!model.presenceLogic.enabled)} aria-label="toggle presence"/>
              </div>
              {model.presenceLogic.enabled && (
                <div className="pres-opts">
                  {[["relaxLighting","Reduce lighting when unoccupied"],["expandTemp","Expand temperature tolerance when unoccupied"]].map(([k,l]) => (
                    <label className="cb" key={k}>
                      <input type="checkbox" checked={model.presenceLogic[k]} onChange={e => set("presenceLogic",k,e.target.checked)}/>
                      {l}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Score Model ── */}
        <div className="panel">
          <div className="panel-hdr">
            <h2><span className="panel-ico" style={{ background:"#f0fdf4" }}><FiTrendingUp size={13} color="var(--green)"/></span>Comfort Score Model</h2>
          </div>
          <div className="panel-body">
            <div className="score-grid">
              <div>
                <div className="formula-box">
                  <div style={{ color:"var(--muted)", marginBottom:6 }}>Score =</div>
                  {PARAMS.map(({ key, label }) => (
                    <div className="formula-line" key={key}>( {label} × {model[key].weight}% )</div>
                  ))}
                </div>
                {totalW !== 100
                  ? <div className="w-warn"><FiAlertTriangle size={11}/>Weights sum to {totalW}% — must equal 100%</div>
                  : <div className="w-ok"><FiCheck size={11}/>Weights are correctly balanced</div>}
              </div>
              <div>
                <div className="live-box">
                  <div className="live-hdr"><span>Live · Meeting Room 2</span><span className="live-dot"/></div>
                  <div className="sc-rows">
                    {rows.map(({ label, v }) => (
                      <div className="sc-row" key={label}>
                        <span style={{ fontSize:12, color:"var(--tx2)" }}>{label}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div className="sc-bar"><div className="sc-fill" style={{ width:`${v*10}%`, background:scColor(v) }}/></div>
                          <span style={{ fontSize:12, fontFamily:"var(--mono)", fontWeight:700, color:scColor(v), minWidth:28 }}>{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sc-total">
                    <span>Comfort Score</span>
                    <span className={`score-num ${scClass(total)}`}>{total}<span style={{ fontSize:13, fontWeight:500, color:"var(--muted)" }}>/10</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Suggestions ── */}
        {aiOn && (
          <div className="panel">
            <div className="panel-hdr">
              <h2><span className="panel-ico" style={{ background:"#f5f3ff" }}><FiActivity size={13} color="var(--purple)"/></span>AI Optimization Suggestions</h2>
              <span style={{ fontSize:11, color:"var(--muted)", fontFamily:"var(--mono)" }}>{AI_SUGGESTIONS.filter(s=>!accepted.has(s.id)&&!ignored.has(s.id)).length} pending</span>
            </div>
            <div className="panel-body">
              <div className="sugg-list">
                {AI_SUGGESTIONS.map(s => {
                  const isAcc = accepted.has(s.id), isIgn = ignored.has(s.id);
                  return (
                    <div key={s.id} className={`sugg-card${isAcc||isIgn?" accepted":""}`}>
                      <div className="sugg-inner">
                        <div className="sugg-top">
                          <div>
                            <h4>{s.param}</h4>
                            <div className="sugg-reason">{s.reason}</div>
                          </div>
                          <span className="conf-pill" style={{ background:`${s.confColor}18`, color:s.confColor, border:`1px solid ${s.confColor}40` }}>
                            {s.conf}% confidence
                          </span>
                        </div>
                        <div className="sugg-vals">
                          <div className="val-block"><span className="val-lbl">Current</span><span className="val-cur">{s.cur}</span></div>
                          <FiChevronRight size={14} className="val-arr"/>
                          <div className="val-block"><span className="val-lbl">Suggested</span><span className="val-sug">{s.sug}</span></div>
                        </div>
                        <div className="sugg-ft">
                          <div className="impact"><FiZap size={11} color="var(--yellow)"/>{s.impact}</div>
                          <div className="sugg-acts">
                            <button className="acc-btn" onClick={() => setAccepted(p => new Set([...p, s.id]))}><FiCheck size={11}/>Accept</button>
                            <button className="ign-btn" onClick={() => setIgnored(p => new Set([...p, s.id]))}><FiX size={11}/>Ignore</button>
                          </div>
                        </div>
                      </div>
                      {isAcc && <div className="accepted-banner"><FiCheck size={11}/>Accepted — will apply on next save</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Impact Preview ── */}
        <div className="panel">
          <div className="panel-hdr">
            <h2><span className="panel-ico" style={{ background:"#fef9c3" }}><FiTrendingUp size={13} color="var(--yellow)"/></span>Impact Preview</h2>
          </div>
          <div className="panel-body">
            <div className="imp-grid">
              {[["comp","Compliant",IMPACT.compliant],["mod","Moderate",IMPACT.moderate],["crit","Critical",IMPACT.critical]].map(([cls,lbl,v]) => (
                <div key={cls} className={`imp-card ${cls}`}>
                  <div className="imp-n">{v}</div>
                  <div className="imp-l">Rooms {lbl}</div>
                </div>
              ))}
            </div>
            <div className="shift-bar">
              <span className="shift-l">Average Comfort Score after applying suggestions</span>
              <span className="shift-r">
                <span className="shift-old">{IMPACT.avg}</span>
                <FiChevronRight size={14} className="shift-arr"/>
                <span className="shift-new">{IMPACT.newAvg}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Advanced ── */}
        <div className="panel">
          <button className="adv-tog" onClick={() => setAdvOpen(v => !v)}>
            <h2><span className="panel-ico" style={{ background:"var(--subtle)" }}><FiSliders size={13} color="var(--muted)"/></span>Advanced Settings</h2>
            {advOpen ? <FiChevronDown size={16} color="var(--muted)"/> : <FiChevronRight size={16} color="var(--muted)"/>}
          </button>
          {advOpen && (
            <div className="adv-grid">
              <div className="adv-sec">
                <h3>Sensor & Data Processing</h3>
                {[["smoothing","Sensor Smoothing Interval (min)"],["averaging","Data Averaging Window (min)"]].map(([k,l]) => (
                  <div className="num-field" key={k}>
                    <label>{l}</label>
                    <input type="number" value={model.advanced[k]} onChange={e => set("advanced",k,parseInt(e.target.value))}/>
                  </div>
                ))}
              </div>
              <div className="adv-sec">
                <h3>AI Behavior</h3>
                {[["aiAggression","AI Aggressiveness","Conservative","Aggressive"],["energyBalance","Energy vs Comfort","Energy Saving","Max Comfort"]].map(([k,l,lo,hi]) => (
                  <div className="sl-grp" key={k}>
                    <label>{l}</label>
                    <input type="range" min="0" max="100" value={model.advanced[k]} onChange={e => set("advanced",k,parseInt(e.target.value))}/>
                    <div className="sl-lbls"><span>{lo}</span><span>{model.advanced[k]}%</span><span>{hi}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}