import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaQrcode, FaKey, FaEye, FaEyeSlash, FaCopy, FaCheck, FaExclamationTriangle, FaIdCard, FaUserCircle } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";

const ROLES = ["Moderator", "Developer", "Designer", "Product Manager", "QA Engineer", "Trainer", "Trainee"];
const DEPARTMENTS = ["Marketing", "Engineering", "Design", "Product", "Quality Assurance", "HR & Training", "Executive"];
const LEONI_SITES = [
  "Leoni Ain Zaghouan 1 (LAZ1)", "Leoni Ain Zaghouan 2 (LAZ2)", "Leoni Ain Zaghouan 3 (LAZ3)",
  "Leoni Ain Zaghouan 4 (LAZ4)", "Leoni Béja 1 (LBJ1)", "Leoni Béja 2 (LBJ2)",
  "Leoni Bizerte (LBZ)", "Leoni El Jadida (LEJ)", "Leoni Ghar El Melh (LGEM)",
  "Leoni Grombalia (LGB)", "Leoni Jendouba (LJD)", "Leoni Mateur (LMT)",
  "Leoni Menzel Bourguiba (LMB)", "Leoni Medjez El Bab (LMEB)", "Leoni Nabeul (LNB)",
  "Leoni Rades (LRD)", "Leoni Sidi Thabet (LST)", "Leoni Sousse (LSS)",
  "Leoni Tebourba (LTB)", "Leoni Tunis (LTN)",
];

const EMPTY_CARD = { cardId: '', cardUID: '', issueDate: new Date().toISOString().split('T')[0], status: 'active' };
const genPassword = (name) => `${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`;
const genCardUID = () => Array(6).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(':');

const S = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 },
  modal: { background:'white', borderRadius:24, width:'90%', maxWidth:700, maxHeight:'90vh', overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', display:'flex', flexDirection:'column' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px', borderBottom:'1px solid #e2e8f0', background:'#f8fafc' },
  title: { fontSize:'1.3rem', fontWeight:600, color:'#1e293b', margin:0, display:'flex', alignItems:'center', gap:8 },
  closeBtn: { width:36, height:36, borderRadius:10, border:'1px solid #e2e8f0', background:'white', color:'#64748b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  body: { padding:24, flex:1, overflowY:'auto', minHeight:0 },
  section: { marginBottom:24, padding:20, background:'#f8fafc', borderRadius:16, border:'1px solid #e2e8f0' },
  sectionTitle: { display:'flex', alignItems:'center', gap:8, fontSize:'1rem', fontWeight:600, color:'#1e293b', margin:'0 0 16px', paddingBottom:8, borderBottom:'1px solid #e2e8f0' },
  grid: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 },
  fg: { display:'flex', flexDirection:'column', gap:4 },
  label: { color:'#1e293b', fontSize:'0.85rem', fontWeight:500 },
  req: { color:'#ef4444', marginLeft:2 },
  input: { padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:'0.9rem', outline:'none' },
  inputErr: { borderColor:'#ef4444' },
  err: { color:'#ef4444', fontSize:'0.7rem', marginTop:2 },
  pwSection: { background:'#1e293b', borderRadius:10, padding:16, color:'white', marginTop:16 },
  pwField: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  pwLabel: { fontSize:'0.85rem', color:'#94a3b8' },
  pwValue: { display:'flex', alignItems:'center', gap:8, fontSize:'1.1rem', fontFamily:'monospace', background:'#0f172a', padding:'8px 12px', borderRadius:6 },
  iconBtn: { background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'1rem', padding:'0 4px' },
  pwHint: { color:'#94a3b8', fontSize:'0.75rem' },
  cardInfo: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:16, borderRadius:10, border:'1px solid #e2e8f0' },
  cardDetails: { display:'flex', flexDirection:'column', gap:8 },
  cardItem: { display:'flex', alignItems:'center', gap:8 },
  detailLabel: { color:'#64748b', fontSize:'0.8rem', minWidth:70 },
  detailValue: { color:'#1e293b', fontSize:'0.9rem', fontWeight:500 },
  removeBtn: { display:'flex', alignItems:'center', gap:4, padding:'8px 12px', background:'#fee2e2', border:'1px solid #fecaca', borderRadius:8, color:'#ef4444', fontSize:'0.8rem', cursor:'pointer' },
  scanArea: { textAlign:'center', padding:24, background:'#f8fafc', borderRadius:10, border:'2px dashed #cbd5e1' },
  scanIcon: { fontSize:'3rem', color:'#2563eb', opacity:0.5, marginBottom:12 },
  cardErrBox: { display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:8, background:'#fee2e2', color:'#ef4444', borderRadius:6, fontSize:'0.8rem', marginBottom:12 },
  cardActions: { display:'flex', gap:12, justifyContent:'center' },
  scanBtn: { display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:'#2563eb', border:'none', borderRadius:8, color:'white', fontSize:'0.85rem', cursor:'pointer' },
  manualBtn: { display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:'white', border:'1px solid #e2e8f0', borderRadius:8, color:'#1e293b', fontSize:'0.85rem', cursor:'pointer' },
  footer: { display:'flex', justifyContent:'flex-end', gap:12, padding:'20px 24px', borderTop:'1px solid #e2e8f0', background:'#f8fafc', flexShrink:0 },
  cancelBtn: { padding:'10px 20px', background:'white', border:'1px solid #e2e8f0', borderRadius:10, color:'#1e293b', fontSize:'0.9rem', fontWeight:500, cursor:'pointer' },
  submitBtn: { display:'flex', alignItems:'center', gap:8, padding:'10px 24px', background:'#2563eb', border:'none', borderRadius:10, color:'white', fontSize:'0.9rem', fontWeight:500, cursor:'pointer' },
  spinner: { display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderRadius:'50%', borderTopColor:'white', animation:'spin 1s ease-in-out infinite' },
  blue: { color:'#2563eb' },
};

const Field = ({ label, required, error, children }) => (
  <div style={S.fg}>
    <label style={S.label}>{label}{required && <span style={S.req}>*</span>}</label>
    {children}
    {error && <span style={S.err}>{error}</span>}
  </div>
);

export default function AddUserModal({ isOpen, onClose, onSave, users, editUser = null }) {
  const [form, setForm] = useState({
    id: editUser?.id || null,
    name: editUser?.name || '', email: editUser?.email || '',
    username: editUser?.username || '', referenceNumber: editUser?.referenceNumber || '',
    site: editUser?.site || '', phone: editUser?.phone || '',
    role: editUser?.role || 'Moderator', department: editUser?.department || 'Marketing',
    position: editUser?.position || '', accessCard: editUser?.accessCard || { ...EMPTY_CARD }
  });
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwCopied, setPwCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cardErr, setCardErr] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    if (!editUser && form.name) setPassword(genPassword(form.name));
  }, [form.name]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.referenceNumber.trim()) e.referenceNumber = "Reference Number is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.position.trim()) e.position = "Position is required";
    if (!form.site) e.site = "Site is required";
    if (users.some(u => u.email === form.email && u.id !== form.id)) e.email = "Email already exists";
    return e;
  };

  const isCardTaken = (uid, id) => users.some(u => u.accessCard?.cardUID === uid || u.accessCard?.cardId === id);

  const handleScan = () => {
    setScanning(true); setCardErr('');
    setTimeout(() => {
      const uid = genCardUID();
      const id = `CARD${String(users.length + 1).padStart(3, '0')}`;
      if (isCardTaken(uid, id)) { setCardErr("Card already assigned to another user"); }
      else { set('accessCard', { ...form.accessCard, cardId: id, cardUID: uid, issueDate: new Date().toISOString().split('T')[0] }); }
      setScanning(false);
    }, 2000);
  };

  const handleManual = () => {
    const id = prompt("Enter Card ID (e.g., CARD008):");
    const uid = prompt("Enter Card UID (e.g., A1:B2:C3:D4:E5:F6):");
    if (id && uid) {
      if (isCardTaken(uid, id)) setCardErr("Card already assigned to another user");
      else set('accessCard', { ...form.accessCard, cardId: id, cardUID: uid, issueDate: new Date().toISOString().split('T')[0] });
    }
  };

  const handleCopyPw = () => {
    navigator.clipboard.writeText(password);
    setPwCopied(true);
    setTimeout(() => setPwCopied(false), 2000);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({ ...form, id: editUser?.id || Date.now(), createdAt: editUser?.createdAt || new Date().toISOString().split('T')[0], lastActive: editUser?.lastActive || 'Never', bookingsCount: editUser?.bookingsCount || 0, status: 'active', ...(editUser ? {} : { generatedPassword: password }) });
    setSubmitting(false);
  };

  if (!isOpen) return null;

  const inp = (key, type = 'text', placeholder = '') => ({
    type, style: { ...S.input, ...(errors[key] ? S.inputErr : {}) },
    value: form[key], placeholder,
    onChange: e => set(key, e.target.value)
  });

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <h2 style={S.title}><FaUserCircle style={S.blue} />{editUser ? 'Edit User' : 'Add New User'}</h2>
          <button style={S.closeBtn} onClick={onClose}><FaTimes /></button>
        </div>

        <div style={S.body}>
          {/* Personal Info */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}><FaUserCircle style={S.blue} />Personal Information</h3>
            <div style={S.grid}>
              <Field label="Full Name" required error={errors.name}><input {...inp('name', 'text', 'John Doe')} /></Field>
              <Field label="Email" required error={errors.email}><input {...inp('email', 'email', 'john.doe@company.com')} /></Field>
              <Field label="Username" required error={errors.username}><input {...inp('username', 'text', 'john.d')} /></Field>
              <Field label="Reference Number" required error={errors.referenceNumber}><input {...inp('referenceNumber', 'text', 'EMP001')} /></Field>
              <Field label="Phone" required error={errors.phone}><input {...inp('phone', 'tel', '+216 XX XXX XXX')} /></Field>
              <Field label="Position" required error={errors.position}><input {...inp('position', 'text', 'Senior Developer')} /></Field>
            </div>
          </div>

          {/* Role & Dept */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}><RiUserSettingsLine style={S.blue} />Role & Department</h3>
            <div style={S.grid}>
              <Field label="Role">
                <select style={S.input} value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Department">
                <select style={S.input} value={form.department} onChange={e => set('department', e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Site" required error={errors.site}>
                <select style={{ ...S.input, ...(errors.site ? S.inputErr : {}) }} value={form.site} onChange={e => set('site', e.target.value)}>
                  <option value="">Select a site...</option>
                  {LEONI_SITES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Password */}
          {!editUser && (
            <div style={S.pwSection}>
              <h3 style={{ ...S.sectionTitle, color:'white', borderBottomColor:'#334155' }}><FaKey /> Generated Credentials</h3>
              <div style={S.pwField}>
                <span style={S.pwLabel}>Temporary Password:</span>
                <div style={S.pwValue}>
                  {showPw ? password : '••••••••'}
                  <button style={S.iconBtn} onClick={() => setShowPw(v => !v)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
                  <button style={S.iconBtn} onClick={handleCopyPw}>{pwCopied ? <FaCheck /> : <FaCopy />}</button>
                </div>
              </div>
              <small style={S.pwHint}>User will change password on first login</small>
            </div>
          )}

          {/* Access Card */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}><FaIdCard style={S.blue} />Access Card</h3>
            {form.accessCard.cardId ? (
              <div style={S.cardInfo}>
                <div style={S.cardDetails}>
                  <div style={S.cardItem}><span style={S.detailLabel}>Card ID:</span><span style={S.detailValue}>{form.accessCard.cardId}</span></div>
                  <div style={S.cardItem}><span style={S.detailLabel}>Card UID:</span><span style={{ ...S.detailValue, fontFamily:'monospace' }}>{form.accessCard.cardUID}</span></div>
                </div>
                <button style={S.removeBtn} onClick={() => set('accessCard', { ...EMPTY_CARD })}><FaTimes /> Remove</button>
              </div>
            ) : (
              <div style={S.scanArea}>
                <FaIdCard style={S.scanIcon} />
                <p style={{ color:'#1e293b', fontSize:'0.9rem', marginBottom:12 }}>Scan or enter access card to link with user</p>
                {cardErr && <div style={S.cardErrBox}><FaExclamationTriangle /> {cardErr}</div>}
                <div style={S.cardActions}>
                  <button style={S.scanBtn} onClick={handleScan} disabled={scanning}>
                    {scanning ? <>Scanning... <span style={S.spinner} /></> : <><FaQrcode /> Scan Card</>}
                  </button>
                  <button style={S.manualBtn} onClick={handleManual}><FaIdCard /> Enter Manually</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={S.footer}>
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? <>Processing... <span style={S.spinner} /></> : <><FaSave /> {editUser ? 'Save Changes' : 'Create User'}</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input:focus,select:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); } button:hover { transform:translateY(-2px); }`}</style>
    </div>
  );
}