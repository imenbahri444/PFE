import { useState, useEffect, useCallback } from "react";
import {
  FaSearch, FaEdit, FaTrash, FaIdCard, FaEnvelope,
  FaPhone, FaCalendarAlt, FaCheckCircle, FaTimesCircle,
  FaArrowLeft, FaUserPlus, FaSortAmountDown, FaSortAmountUp,
  FaChevronDown, FaMapMarkerAlt
} from "react-icons/fa";
import { MdAccessTime, MdBadge } from "react-icons/md";
import AddUserModal from "../components/AddUserModal";

// ─── Constants (module-level, no re-declaration risk) ───────────────────────
const STORAGE_KEY = "fm_users_v2";

const INITIAL_USERS = [
  {
    id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com",
    username: "sarah.j", matricule: "EMP001", phone: "+33 6 12 34 56 78",
    role: "Moderator", department: "Marketing", position: "Marketing Director", site: "Leoni Sousse (LSS)",
    accessCard: { cardId: "CARD001", cardUID: "A1:B2:C3:D4:E5:F6", issueDate: "2026-01-15", status: "active" },
    createdAt: "2026-01-15", lastActive: "2026-02-22", bookingsCount: 24, status: "active"
  },
  {
    id: 2, name: "Michael Chen", email: "michael.chen@company.com",
    username: "michael.c", matricule: "EMP002", phone: "+33 6 23 45 67 89",
    role: "Developer", department: "Engineering", position: "Lead Developer", site: "Leoni Tunis (LTN)",
    accessCard: { cardId: "CARD002", cardUID: "B2:C3:D4:E5:F6:G7", issueDate: "2026-01-16", status: "active" },
    createdAt: "2026-01-16", lastActive: "2026-02-23", bookingsCount: 18, status: "active"
  },
  {
    id: 3, name: "Emma Davis", email: "emma.davis@company.com",
    username: "emma.d", matricule: "EMP003", phone: "+33 6 34 56 78 90",
    role: "Designer", department: "Design", position: "Senior UX Designer", site: "Leoni Ain Zaghouan 1 (LAZ1)",
    accessCard: { cardId: "CARD003", cardUID: "C3:D4:E5:F6:G7:H8", issueDate: "2026-01-17", status: "active" },
    createdAt: "2026-01-17", lastActive: "2026-02-21", bookingsCount: 15, status: "active"
  },
  {
    id: 4, name: "James Wilson", email: "james.wilson@company.com",
    username: "james.w", matricule: "EMP004", phone: "+33 6 45 67 89 01",
    role: "Product Manager", department: "Product", position: "Senior Product Manager", site: "Leoni Nabeul (LNB)",
    accessCard: { cardId: "CARD004", cardUID: "D4:E5:F6:G7:H8:I9", issueDate: "2026-01-18", status: "active" },
    createdAt: "2026-01-18", lastActive: "2026-02-22", bookingsCount: 12, status: "active"
  },
  {
    id: 5, name: "Lisa Anderson", email: "lisa.anderson@company.com",
    username: "lisa.a", matricule: "EMP005", phone: "+33 6 56 78 90 12",
    role: "QA Engineer", department: "Quality Assurance", position: "Lead QA Engineer", site: "Leoni Bizerte (LBZ)",
    accessCard: { cardId: "CARD005", cardUID: "E5:F6:G7:H8:I9:J0", issueDate: "2026-01-19", status: "active" },
    createdAt: "2026-01-19", lastActive: "2026-02-20", bookingsCount: 10, status: "active"
  }
];

const ROLES = ["All", "Moderator", "Developer", "Designer", "Product Manager", "QA Engineer", "Trainer", "Trainee"];
const DEPARTMENTS = ["All", "Marketing", "Engineering", "Design", "Product", "Quality Assurance", "HR & Training", "Executive"];

const AVATAR_PALETTES = [
  ["#0ea5e9", "#0369a1"], ["#8b5cf6", "#6d28d9"], ["#10b981", "#065f46"],
  ["#f59e0b", "#92400e"], ["#ef4444", "#991b1b"], ["#ec4899", "#9d174d"],
];

// ─── Pure helpers ────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

const getAvatarColors = (id) => AVATAR_PALETTES[0]; // Always blue

const fmtDate = (d) =>
  d && d !== "Never" ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const loadPersistedUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If stored users lack site field, reset to fresh INITIAL_USERS
      if (parsed.length > 0 && parsed[0].site === undefined) {
        localStorage.removeItem(STORAGE_KEY);
        return INITIAL_USERS;
      }
      return parsed;
    }
    return INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

// ─── Inject styles once ───────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .fmu-root { --accent: #2563eb; --accent-light: #dbeafe; --accent-dark: #1d4ed8;
    --surface: #ffffff; --surface-2: #f8fafc; --surface-3: #f1f5f9;
    --border: #e2e8f0; --border-2: #cbd5e1;
    --text-1: #0f172a; --text-2: #475569; --text-3: #94a3b8;
    --green: #10b981; --red: #ef4444; --amber: #f59e0b;
    --radius: 14px; --radius-sm: 8px;
    font-family: 'DM Sans', sans-serif;
    background: #f0f4f8;
    min-height: 100vh;
    padding: 28px 32px;
    color: var(--text-1);
    box-sizing: border-box;
  }

  .fmu-root *, .fmu-root *::before, .fmu-root *::after { box-sizing: border-box; }

  /* ── Header ── */
  .fmu-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .fmu-title  { font-size: 1.75rem; font-weight: 700; color: var(--text-1); margin: 0 0 4px; letter-spacing: -0.03em; }
  .fmu-sub    { font-size: 0.875rem; color: var(--text-3); margin: 0; font-weight: 400; }

  /* ── Add Button ── */
  .fmu-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: var(--accent); color: white;
    border: none; border-radius: var(--radius-sm); font-family: inherit;
    font-size: 0.875rem; font-weight: 600; cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 2px 8px rgba(37,99,235,0.35);
  }
  .fmu-add-btn:hover { background: var(--accent-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
  .fmu-add-btn:active { transform: translateY(0); }

  /* ── Toolbar ── */
  .fmu-toolbar { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; align-items: center; }
  .fmu-search-wrap { position: relative; flex: 1; min-width: 220px; }
  .fmu-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 0.8rem; pointer-events: none; }
  .fmu-search {
    width: 100%; padding: 10px 12px 10px 34px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-family: inherit; font-size: 0.875rem; background: var(--surface);
    color: var(--text-1); outline: none; transition: border-color 0.15s;
  }
  .fmu-search:focus { border-color: var(--accent); }
  .fmu-search::placeholder { color: var(--text-3); }

  .fmu-select-wrap { position: relative; }
  .fmu-select-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 0.7rem; pointer-events: none; }
  .fmu-select {
    appearance: none; padding: 10px 30px 10px 12px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: var(--surface); font-family: inherit; font-size: 0.85rem;
    color: var(--text-2); cursor: pointer; outline: none; transition: border-color 0.15s;
  }
  .fmu-select:focus { border-color: var(--accent); color: var(--text-1); }

  .fmu-sort-group { display: flex; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; background: var(--surface); }
  .fmu-sort-select { appearance: none; padding: 10px 28px 10px 12px; border: none; font-family: inherit; font-size: 0.85rem; color: var(--text-2); background: transparent; cursor: pointer; outline: none; }
  .fmu-sort-dir { padding: 0 12px; border: none; border-left: 1.5px solid var(--border); background: transparent; cursor: pointer; color: var(--text-2); display: flex; align-items: center; transition: background 0.15s; }
  .fmu-sort-dir:hover { background: var(--surface-3); }

  /* ── Stats bar ── */
  .fmu-statsbar { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
  .fmu-count { font-size: 0.85rem; color: var(--text-3); }
  .fmu-stat-chip { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .fmu-stat-chip.active { background: #dcfce7; color: #166534; }
  .fmu-stat-chip.inactive { background: #fee2e2; color: #991b1b; }

  /* ── Grid ── */
  .fmu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 18px; }

  /* ── User Card ── */
  .fmu-card {
    background: var(--surface); border-radius: var(--radius);
    border: 1.5px solid var(--border); padding: 20px;
    cursor: pointer; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    position: relative; overflow: hidden;
  }
  .fmu-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--c1, #2563eb), var(--c2, #1d4ed8));
    opacity: 0; transition: opacity 0.18s;
  }
  .fmu-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: var(--border-2); }
  .fmu-card:hover::before { opacity: 1; }

  .fmu-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .fmu-avatar {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 700; color: white; flex-shrink: 0;
    letter-spacing: -0.02em;
  }
  .fmu-card-actions { display: flex; gap: 6px; }
  .fmu-icon-btn {
    width: 44px; height: 44px; border-radius: 7px; border: none;
    background: #e0e7ff; color: #3b5bdb; display: flex; align-items: center;
    justify-content: center; cursor: pointer; font-size: 1rem; transition: all 0.15s;
  }
  .fmu-icon-btn:hover { background: #c7d2fe; color: #1e3a8a; }
  .fmu-icon-btn.danger { background: #fee2e2; color: #dc2626; }
  .fmu-icon-btn.danger:hover { background: #fecaca; color: #991b1b; }

  .fmu-name  { font-size: 1rem; font-weight: 700; color: var(--text-1); margin: 0 0 2px; letter-spacing: -0.02em; }
  .fmu-pos   { font-size: 0.78rem; color: var(--text-3); margin: 0 0 12px; }

  .fmu-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .fmu-badge { padding: 3px 9px; border-radius: 20px; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.02em; }
  .fmu-badge.role { background: var(--accent-light); color: var(--accent); }
  .fmu-badge.dept { background: #dcfce7; color: #166534; }

  .fmu-meta { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
  .fmu-meta-row { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-2); }
  .fmu-meta-icon { color: var(--text-3); width: 14px; flex-shrink: 0; }

  .fmu-card-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); }
  .fmu-foot-stats { display: flex; gap: 14px; }
  .fmu-foot-stat { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--text-3); }
  .fmu-foot-stat strong { color: var(--text-2); font-weight: 600; }
  .fmu-indicators { display: flex; align-items: center; gap: 6px; }

  .fmu-dot { width: 8px; height: 8px; border-radius: 50%; }
  .fmu-dot.active { background: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
  .fmu-dot.inactive { background: var(--red); box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }

  /* ── Empty state ── */
  .fmu-empty { grid-column: 1/-1; padding: 60px 20px; text-align: center; color: var(--text-3); }
  .fmu-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .fmu-empty p { margin: 0; font-size: 0.9rem; }

  /* ── Detail view ── */
  .fmu-back-btn { display: inline-flex; align-items: center; gap: 7px; background: none; border: none; color: var(--text-3); font-family: inherit; font-size: 0.85rem; cursor: pointer; padding: 0; margin-bottom: 22px; transition: color 0.15s; }
  .fmu-back-btn:hover { color: var(--text-1); }

  .fmu-detail-panel { background: var(--surface); border-radius: 20px; border: 1.5px solid var(--border); overflow: hidden; }

  .fmu-detail-hero {
    padding: 28px 32px; display: flex; gap: 22px; align-items: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    position: relative; overflow: hidden;
  }
  .fmu-detail-hero::after {
    content: ''; position: absolute; right: -60px; top: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(37,99,235,0.15); pointer-events: none;
  }
  .fmu-detail-avatar {
    width: 76px; height: 76px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 700; color: white; flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .fmu-detail-hero-info { flex: 1; }
  .fmu-detail-name { font-size: 1.5rem; font-weight: 700; color: white; margin: 0 0 4px; letter-spacing: -0.03em; }
  .fmu-detail-role { font-size: 0.875rem; color: #94a3b8; margin: 0 0 8px; }
  .fmu-detail-badges { display: flex; gap: 8px; }
  .fmu-detail-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
  .fmu-detail-badge.role { background: rgba(37,99,235,0.3); color: #93c5fd; }
  .fmu-detail-badge.dept { background: rgba(139,92,246,0.3); color: #c4b5fd; }
  .fmu-detail-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .fmu-detail-btn {
    display: flex; align-items: center; gap: 7px; padding: 9px 16px;
    border-radius: var(--radius-sm); font-family: inherit; font-size: 0.82rem;
    font-weight: 600; cursor: pointer; border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8);
    transition: all 0.15s;
  }
  .fmu-detail-btn:hover { background: rgba(255,255,255,0.15); color: white; border-color: rgba(255,255,255,0.3); }
  .fmu-detail-btn.danger:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.4); color: #fca5a5; }

  .fmu-detail-body { padding: 28px 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .fmu-info-card { background: var(--surface-2); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .fmu-info-card.full { grid-column: span 2; }
  .fmu-info-card-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); margin: 0 0 16px; }

  .fmu-info-rows { display: flex; flex-direction: column; gap: 14px; }
  .fmu-info-row { display: flex; align-items: center; gap: 12px; }
  .fmu-info-row-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
  .fmu-info-label { font-size: 0.7rem; color: var(--text-3); display: block; margin-bottom: 1px; text-transform: uppercase; letter-spacing: 0.04em; }
  .fmu-info-value { font-size: 0.9rem; color: var(--text-1); font-weight: 500; }

  /* Access card */
  .fmu-access-card {
    display: flex; align-items: center; gap: 18px; padding: 18px 22px;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    border-radius: var(--radius-sm); color: white;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .fmu-access-card-icon { font-size: 2rem; color: #60a5fa; flex-shrink: 0; }
  .fmu-access-card-id { font-size: 1.1rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px; }
  .fmu-access-card-uid { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #64748b; }
  .fmu-access-card-status { margin-left: auto; padding: 4px 12px; background: rgba(16,185,129,0.2); color: #34d399; border-radius: 20px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

  /* Stats row in detail */
  .fmu-stats-row { display: flex; gap: 14px; margin-top: 2px; }
  .fmu-stat-box { flex: 1; background: var(--surface-2); border: 1.5px solid var(--border); border-radius: 10px; padding: 14px 16px; }
  .fmu-stat-box-val { font-size: 1.6rem; font-weight: 700; color: var(--text-1); letter-spacing: -0.03em; }
  .fmu-stat-box-label { font-size: 0.72rem; color: var(--text-3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }

  @media (max-width: 640px) {
    .fmu-root { padding: 16px; }
    .fmu-detail-body { grid-template-columns: 1fr; }
    .fmu-info-card.full { grid-column: span 1; }
    .fmu-detail-hero { flex-wrap: wrap; }
    .fmu-grid { grid-template-columns: 1fr; }
  }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected) return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function UserCard({ user, onView, onEdit, onDelete }) {
  const [c1, c2] = getAvatarColors(user.id);

  return (
    <div
      className="fmu-card"
      style={{ "--c1": c1, "--c2": c2 }}
      onClick={() => onView(user)}
    >
      <div className="fmu-card-top">
        <div className="fmu-avatar" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
          {getInitials(user.name)}
        </div>
        <div className="fmu-card-actions">
          <button className="fmu-icon-btn" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(user); }}>
            <FaEdit size={28} />
          </button>
          <button className="fmu-icon-btn danger" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}>
            <FaTrash size={28} />
          </button>
        </div>
      </div>

      <p className="fmu-name">{user.name}</p>
      <p className="fmu-pos">{user.position}</p>

      <div className="fmu-badges">
        <span className="fmu-badge role">{user.role}</span>
        <span className="fmu-badge dept">{user.department}</span>
      </div>

      <div className="fmu-meta">
        <div className="fmu-meta-row"><MdBadge className="fmu-meta-icon" />{user.matricule}</div>
        <div className="fmu-meta-row"><FaEnvelope className="fmu-meta-icon" />{user.email}</div>
        <div className="fmu-meta-row"><FaPhone className="fmu-meta-icon" />{user.phone}</div>
        {user.site && <div className="fmu-meta-row"><FaMapMarkerAlt className="fmu-meta-icon" />{user.site}</div>}
      </div>

      <div className="fmu-card-foot">
        <div className="fmu-foot-stats">
          <span className="fmu-foot-stat"><FaCalendarAlt /><strong>{user.bookingsCount}</strong> bookings</span>
          <span className="fmu-foot-stat"><MdAccessTime />{fmtDate(user.lastActive)}</span>
        </div>
        <div className="fmu-indicators">
          {user.accessCard && <FaIdCard color="#93c5fd" title="Has access card" />}
          <span className={`fmu-dot ${user.status}`} title={user.status} />
        </div>
      </div>
    </div>
  );
}

function DetailView({ user, onBack, onEdit, onDelete }) {
  const [c1, c2] = getAvatarColors(user.id);

  return (
    <>
      <button className="fmu-back-btn" onClick={onBack}>
        <FaArrowLeft /> Back to users
      </button>

      <div className="fmu-detail-panel">
        {/* Hero */}
        <div className="fmu-detail-hero">
          <div className="fmu-detail-avatar" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
            {getInitials(user.name)}
          </div>
          <div className="fmu-detail-hero-info">
            <h2 className="fmu-detail-name">{user.name}</h2>
            <p className="fmu-detail-role">{user.position} · {user.matricule}</p>
            <div className="fmu-detail-badges">
              <span className="fmu-detail-badge role">{user.role}</span>
              <span className="fmu-detail-badge dept" style={{background: "rgba(16,185,129,0.25)", color: "#34d399"}}>{user.department}</span>
              <span className={`fmu-detail-badge ${user.status === 'active' ? 'role' : 'danger'}`}
                style={user.status === 'active' ? { background: 'rgba(16,185,129,0.25)', color: '#34d399' } : { background: 'rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                {user.status}
              </span>
            </div>
          </div>
          <div className="fmu-detail-actions">
            <button className="fmu-detail-btn" onClick={onEdit}><FaEdit /> Edit</button>
            <button className="fmu-detail-btn danger" onClick={() => onDelete(user.id)}><FaTrash /> Delete</button>
          </div>
        </div>

        {/* Body */}
        <div className="fmu-detail-body">
          {/* Stats */}
          <div className="fmu-info-card full">
            <p className="fmu-info-card-title">Activity Overview</p>
            <div className="fmu-stats-row">
              <div className="fmu-stat-box"><div className="fmu-stat-box-val">{user.bookingsCount}</div><div className="fmu-stat-box-label">Total Bookings</div></div>
              <div className="fmu-stat-box"><div className="fmu-stat-box-val">{fmtDate(user.lastActive)}</div><div className="fmu-stat-box-label">Last Active</div></div>
              <div className="fmu-stat-box"><div className="fmu-stat-box-val">{fmtDate(user.createdAt)}</div><div className="fmu-stat-box-label">Member Since</div></div>
            </div>
          </div>

          {/* Contact */}
          <div className="fmu-info-card">
            <p className="fmu-info-card-title">Contact</p>
            <div className="fmu-info-rows">
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><FaEnvelope /></div>
                <div><span className="fmu-info-label">Email</span><span className="fmu-info-value">{user.email}</span></div>
              </div>
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><FaPhone /></div>
                <div><span className="fmu-info-label">Phone</span><span className="fmu-info-value">{user.phone}</span></div>
              </div>
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><MdBadge /></div>
                <div><span className="fmu-info-label">Username</span><span className="fmu-info-value">@{user.username}</span></div>
              </div>
            </div>
          </div>

          {/* Employment */}
          <div className="fmu-info-card">
            <p className="fmu-info-card-title">Employment</p>
            <div className="fmu-info-rows">
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><MdBadge /></div>
                <div><span className="fmu-info-label">Matricule</span><span className="fmu-info-value">{user.matricule}</span></div>
              </div>
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><FaCalendarAlt /></div>
                <div><span className="fmu-info-label">Department</span><span className="fmu-info-value">{user.department}</span></div>
              </div>
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><FaCalendarAlt /></div>
                <div><span className="fmu-info-label">Position</span><span className="fmu-info-value">{user.position}</span></div>
              </div>
              {user.site && (
              <div className="fmu-info-row">
                <div className="fmu-info-row-icon"><FaMapMarkerAlt /></div>
                <div><span className="fmu-info-label">Site</span><span className="fmu-info-value">{user.site}</span></div>
              </div>
              )}
            </div>
          </div>

          {/* Access Card */}
          {user.accessCard && (
            <div className="fmu-info-card full">
              <p className="fmu-info-card-title">Access Card</p>
              <div className="fmu-access-card">
                <FaIdCard className="fmu-access-card-icon" />
                <div>
                  <div className="fmu-access-card-id">{user.accessCard.cardId}</div>
                  <div className="fmu-access-card-uid">UID: {user.accessCard.cardUID}</div>
                </div>
                <span className="fmu-access-card-status">{user.accessCard.status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FM_Users() {
  injectStyles();

  const [users, setUsers] = useState(loadPersistedUsers);
  const [view, setView] = useState("list"); // "list" | "detail"
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [sortDir, setSortDir] = useState("desc");

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Derived filtered list
  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.matricule.toLowerCase().includes(q)) &&
        (roleFilter === "All" || u.role === roleFilter) &&
        (deptFilter === "All" || u.department === deptFilter) &&
        (statusFilter === "All" || u.status === statusFilter)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "newest") cmp = new Date(a.createdAt) - new Date(b.createdAt);
      else if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "bookings") cmp = a.bookingsCount - b.bookingsCount;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const activeCount = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.length - activeCount;

  // Handlers
  const handleAdd = useCallback((newUser) => { setUsers((p) => [...p, newUser]); setShowAddModal(false); }, []);
  const handleEdit = useCallback((updated) => {
    setUsers((p) => p.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(updated);
    setShowEditModal(false);
  }, []);
  const handleDelete = useCallback((id) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((p) => p.filter((u) => u.id !== id));
    if (selectedUser?.id === id) { setSelectedUser(null); setView("list"); }
  }, [selectedUser]);

  const openDetail = (user) => { setSelectedUser(user); setView("detail"); };
  const openEdit = (user) => { setSelectedUser(user); setShowEditModal(true); };

  return (
    <div className="fmu-root">
      {/* Header */}
      <div className="fmu-header">
        <div>
          <h1 className="fmu-title">User Management</h1>
          <p className="fmu-sub">Manage employees, roles & access cards</p>
        </div>
        {view === "list" && (
          <button className="fmu-add-btn" onClick={() => setShowAddModal(true)}>
            <FaUserPlus /> Add User
          </button>
        )}
      </div>

      {view === "list" ? (
        <>
          {/* Toolbar */}
          <div className="fmu-toolbar">
            <div className="fmu-search-wrap">
              <FaSearch className="fmu-search-icon" />
              <input
                className="fmu-search"
                placeholder="Search by name, email or matricule…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="fmu-select-wrap">
              <select className="fmu-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <FaChevronDown className="fmu-select-icon" />
            </div>

            <div className="fmu-select-wrap">
              <select className="fmu-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <FaChevronDown className="fmu-select-icon" />
            </div>

            <div className="fmu-select-wrap">
              <select className="fmu-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FaChevronDown className="fmu-select-icon" />
            </div>

            <div className="fmu-sort-group">
              <select className="fmu-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="bookings">Bookings</option>
              </select>
              <button className="fmu-sort-dir" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
                {sortDir === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="fmu-statsbar">
            <span className="fmu-count">{filtered.length} of {users.length} users</span>
            <span className="fmu-stat-chip active"><FaCheckCircle /> {activeCount} Active</span>
            {inactiveCount > 0 && <span className="fmu-stat-chip inactive"><FaTimesCircle /> {inactiveCount} Inactive</span>}
          </div>

          {/* Grid */}
          <div className="fmu-grid">
            {filtered.length === 0 ? (
              <div className="fmu-empty">
                <div className="fmu-empty-icon">🔍</div>
                <p>No users match your filters.</p>
              </div>
            ) : (
              filtered.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onView={openDetail}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </>
      ) : (
        selectedUser && (
          <DetailView
            user={selectedUser}
            onBack={() => setView("list")}
            onEdit={() => openEdit(selectedUser)}
            onDelete={handleDelete}
          />
        )
      )}

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAdd} users={users} />

      {selectedUser && (
        <AddUserModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); }}
          onSave={handleEdit}
          users={users}
          editUser={selectedUser}
        />
      )}
    </div>
  );
}