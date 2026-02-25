import { useState, useEffect } from "react";
import { 
  FaTimes, FaSave, FaQrcode, FaKey,
  FaEye, FaEyeSlash, FaCopy, FaCheck,
  FaExclamationTriangle, FaIdCard, FaUserCircle
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";

// Available roles and departments
const roles = ["Moderator", "Developer", "Designer", "Product Manager", "QA Engineer", "Trainer", "Trainee"];
const departments = ["Marketing", "Engineering", "Design", "Product", "Quality Assurance", "HR & Training", "Executive"];

// Leoni Tunisia sites
const leoniSites = [
  "Leoni Ain Zaghouan 1 (LAZ1)",
  "Leoni Ain Zaghouan 2 (LAZ2)",
  "Leoni Ain Zaghouan 3 (LAZ3)",
  "Leoni Ain Zaghouan 4 (LAZ4)",
  "Leoni Béja 1 (LBJ1)",
  "Leoni Béja 2 (LBJ2)",
  "Leoni Bizerte (LBZ)",
  "Leoni El Jadida (LEJ)",
  "Leoni Ghar El Melh (LGEM)",
  "Leoni Grombalia (LGB)",
  "Leoni Jendouba (LJD)",
  "Leoni Mateur (LMT)",
  "Leoni Menzel Bourguiba (LMB)",
  "Leoni Medjez El Bab (LMEB)",
  "Leoni Nabeul (LNB)",
  "Leoni Rades (LRD)",
  "Leoni Sidi Thabet (LST)",
  "Leoni Sousse (LSS)",
  "Leoni Tebourba (LTB)",
  "Leoni Tunis (LTN)",
];

// Generate random password
const generatePassword = (name) => {
  const base = name.split(' ')[0].toLowerCase();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${base}${randomNum}`;
};

export default function AddUserModal({ isOpen, onClose, onSave, users, editUser = null }) {
  const [formData, setFormData] = useState({
    id: editUser?.id || null,
    name: editUser?.name || '',
    email: editUser?.email || '',
    username: editUser?.username || '',
    referenceNumber: editUser?.referenceNumber || '',
    site: editUser?.site || '',
    phone: editUser?.phone || '',
    role: editUser?.role || 'Moderator',
    department: editUser?.department || 'Marketing',
    position: editUser?.position || '',
    accessCard: editUser?.accessCard || {
      cardId: '',
      cardUID: '',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [scanningCard, setScanningCard] = useState(false);
  const [cardError, setCardError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate password for new user
  useEffect(() => {
    if (!editUser && formData.name) {
      const password = generatePassword(formData.name);
      setGeneratedPassword(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.referenceNumber.trim()) errors.referenceNumber = "Reference Number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.site) errors.site = "Site is required";
    
    // Check unique email (except when editing same user)
    const emailExists = users.some(u => 
      u.email === formData.email && u.id !== formData.id
    );
    if (emailExists) errors.email = "Email already exists";
    
    return errors;
  };

  const handleScanCard = () => {
    setScanningCard(true);
    setCardError('');
    
    // Simulate card scanning
    setTimeout(() => {
      const cardUID = Array(6).fill(0).map(() => 
        Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
      ).join(':');
      
      const cardId = `CARD${String(users.length + 1).padStart(3, '0')}`;
      
      // Check if card already exists
      const existingCard = users.find(u => 
        u.accessCard?.cardUID === cardUID || u.accessCard?.cardId === cardId
      );
      
      if (existingCard) {
        setCardError("This card is already assigned to another user");
        setScanningCard(false);
      } else {
        setFormData({
          ...formData,
          accessCard: {
            ...formData.accessCard,
            cardId: cardId,
            cardUID: cardUID,
            issueDate: new Date().toISOString().split('T')[0]
          }
        });
        setScanningCard(false);
      }
    }, 2000);
  };

  const handleManualCardEntry = () => {
    const cardId = prompt("Enter Card ID (e.g., CARD008):");
    const cardUID = prompt("Enter Card UID (e.g., A1:B2:C3:D4:E5:F6):");
    
    if (cardId && cardUID) {
      const existingCard = users.find(u => 
        u.accessCard?.cardUID === cardUID || u.accessCard?.cardId === cardId
      );
      
      if (existingCard) {
        setCardError("This card is already assigned to another user");
      } else {
        setFormData({
          ...formData,
          accessCard: {
            ...formData.accessCard,
            cardId: cardId,
            cardUID: cardUID,
            issueDate: new Date().toISOString().split('T')[0]
          }
        });
      }
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userData = {
      ...formData,
      id: editUser?.id || Date.now(),
      createdAt: editUser?.createdAt || new Date().toISOString().split('T')[0],
      lastActive: editUser?.lastActive || 'Never',
      bookingsCount: editUser?.bookingsCount || 0,
      status: 'active',
      generatedPassword: !editUser ? generatedPassword : undefined
    };
    
    onSave(userData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      background: 'white',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #e2e8f0',
      background: '#f8fafc'
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      background: 'white',
      color: '#64748b',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    body: {
      padding: '24px',
      flex: 1,
      overflowY: 'auto',
      minHeight: 0,
    },
    section: {
      marginBottom: '24px',
      padding: '20px',
      background: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1e293b',
      margin: '0 0 16px 0',
      paddingBottom: '8px',
      borderBottom: '1px solid #e2e8f0'
    },
    icon: {
      color: '#2563eb'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    label: {
      color: '#1e293b',
      fontSize: '0.85rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    required: {
      color: '#ef4444',
      marginLeft: '2px'
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '0.7rem',
      marginTop: '2px'
    },
    fieldHint: {
      color: '#64748b',
      fontSize: '0.65rem',
      marginTop: '2px'
    },
    passwordSection: {
      background: '#1e293b',
      borderRadius: '10px',
      padding: '16px',
      color: 'white',
      marginTop: '16px'
    },
    passwordField: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    passwordLabel: {
      fontSize: '0.85rem',
      color: '#94a3b8'
    },
    passwordValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '1.1rem',
      fontFamily: 'monospace',
      background: '#0f172a',
      padding: '8px 12px',
      borderRadius: '6px'
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '0 4px'
    },
    passwordHint: {
      color: '#94a3b8',
      fontSize: '0.75rem'
    },
    cardInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'white',
      padding: '16px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0'
    },
    cardDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    cardDetailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    detailLabel: {
      color: '#64748b',
      fontSize: '0.8rem',
      minWidth: '70px'
    },
    detailValue: {
      color: '#1e293b',
      fontSize: '0.9rem',
      fontWeight: 500
    },
    removeCardBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#ef4444',
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    scanArea: {
      textAlign: 'center',
      padding: '24px',
      background: '#f8fafc',
      borderRadius: '10px',
      border: '2px dashed #cbd5e1'
    },
    scanIcon: {
      fontSize: '3rem',
      color: '#2563eb',
      opacity: 0.5,
      marginBottom: '12px'
    },
    scanInstruction: {
      color: '#1e293b',
      fontSize: '0.9rem',
      marginBottom: '12px'
    },
    cardError: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '8px',
      background: '#fee2e2',
      color: '#ef4444',
      borderRadius: '6px',
      fontSize: '0.8rem',
      marginBottom: '12px'
    },
    cardActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    scanBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      background: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    manualBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      color: '#1e293b',
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px 24px',
      borderTop: '1px solid #e2e8f0',
      background: '#f8fafc',
      flexShrink: 0,
    },
    cancelBtn: {
      padding: '10px 20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      color: '#1e293b',
      fontSize: '0.9rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 24px',
      background: '#2563eb',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    spinner: {
      display: 'inline-block',
      width: '14px',
      height: '14px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTopColor: 'white',
      animation: 'spin 1s ease-in-out infinite'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <FaUserCircle style={styles.icon} />
            {editUser ? 'Edit User' : 'Add New User'}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={styles.body}>
          {/* Personal Information */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FaUserCircle style={styles.icon} />
              Personal Information
            </h3>
            
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
                <input 
                  type="text"
                  style={{...styles.input, ...(formErrors.name ? styles.inputError : {})}}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
                {formErrors.name && <span style={styles.errorMessage}>{formErrors.name}</span>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email <span style={styles.required}>*</span></label>
                <input 
                  type="email"
                  style={{...styles.input, ...(formErrors.email ? styles.inputError : {})}}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john.doe@company.com"
                />
                {formErrors.email && <span style={styles.errorMessage}>{formErrors.email}</span>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Username <span style={styles.required}>*</span></label>
                <input 
                  type="text"
                  style={{...styles.input, ...(formErrors.username ? styles.inputError : {})}}
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="john.d"
                />
                {formErrors.username && <span style={styles.errorMessage}>{formErrors.username}</span>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Reference Number <span style={styles.required}>*</span></label>
                <input 
                  type="text"
                  style={{...styles.input, ...(formErrors.referenceNumber ? styles.inputError : {})}}
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                  placeholder="EMP001"
                />
                {formErrors.referenceNumber && <span style={styles.errorMessage}>{formErrors.referenceNumber}</span>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone <span style={styles.required}>*</span></label>
                <input 
                  type="tel"
                  style={{...styles.input, ...(formErrors.phone ? styles.inputError : {})}}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+33 6 12 34 56 78"
                />
                {formErrors.phone && <span style={styles.errorMessage}>{formErrors.phone}</span>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Position <span style={styles.required}>*</span></label>
                <input 
                  type="text"
                  style={{...styles.input, ...(formErrors.position ? styles.inputError : {})}}
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="Senior Developer"
                />
                {formErrors.position && <span style={styles.errorMessage}>{formErrors.position}</span>}
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <RiUserSettingsLine style={styles.icon} />
              Role & Department
            </h3>
            
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select 
                  style={styles.input}
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <select 
                  style={styles.input}
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Site <span style={styles.required}>*</span></label>
                <select
                  style={{...styles.input, ...(formErrors.site ? styles.inputError : {})}}
                  value={formData.site}
                  onChange={(e) => setFormData({...formData, site: e.target.value})}
                >
                  <option value="">Select a site...</option>
                  {leoniSites.map(site => <option key={site} value={site}>{site}</option>)}
                </select>
                {formErrors.site && <span style={styles.errorMessage}>{formErrors.site}</span>}
              </div>
            </div>
          </div>

          {/* Generated Password - Only for new users */}
          {!editUser && (
            <div style={styles.passwordSection}>
              <h3 style={{...styles.sectionTitle, color: 'white', borderBottomColor: '#334155'}}>
                <FaKey /> Generated Credentials
              </h3>
              <div style={styles.passwordField}>
                <span style={styles.passwordLabel}>Temporary Password:</span>
                <div style={styles.passwordValue}>
                  {showPassword ? generatedPassword : '••••••••'}
                  <button 
                    style={styles.iconBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button 
                    style={styles.iconBtn}
                    onClick={handleCopyPassword}
                  >
                    {passwordCopied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              <small style={styles.passwordHint}>
                User will change password on first login
              </small>
            </div>
          )}

          {/* Access Card */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FaIdCard style={styles.icon} />
              Access Card
            </h3>
            
            {formData.accessCard.cardId ? (
              <div style={styles.cardInfo}>
                <div style={styles.cardDetails}>
                  <div style={styles.cardDetailItem}>
                    <span style={styles.detailLabel}>Card ID:</span>
                    <span style={styles.detailValue}>{formData.accessCard.cardId}</span>
                  </div>
                  <div style={styles.cardDetailItem}>
                    <span style={styles.detailLabel}>Card UID:</span>
                    <span style={{...styles.detailValue, fontFamily: 'monospace'}}>
                      {formData.accessCard.cardUID}
                    </span>
                  </div>
                </div>
                <button 
                  style={styles.removeCardBtn}
                  onClick={() => setFormData({
                    ...formData,
                    accessCard: { cardId: '', cardUID: '', issueDate: new Date().toISOString().split('T')[0], status: 'active' }
                  })}
                >
                  <FaTimes /> Remove
                </button>
              </div>
            ) : (
              <div style={styles.scanArea}>
                <FaIdCard style={styles.scanIcon} />
                <p style={styles.scanInstruction}>
                  Scan or enter access card to link with user
                </p>
                
                {cardError && (
                  <div style={styles.cardError}>
                    <FaExclamationTriangle /> {cardError}
                  </div>
                )}
                
                <div style={styles.cardActions}>
                  <button 
                    style={styles.scanBtn}
                    onClick={handleScanCard}
                    disabled={scanningCard}
                  >
                    {scanningCard ? (
                      <>Scanning... <span style={styles.spinner}></span></>
                    ) : (
                      <><FaQrcode /> Scan Card</>
                    )}
                  </button>
                  <button 
                    style={styles.manualBtn}
                    onClick={handleManualCardEntry}
                  >
                    <FaIdCard /> Enter Manually
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button 
            style={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing... <span style={styles.spinner}></span></>
            ) : (
              <><FaSave /> {editUser ? 'Save Changes' : 'Create User'}</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        button:hover {
          transform: translateY(-2px);
        }
        .remove-card-btn:hover {
          background: #fecaca;
        }
      `}</style>
    </div>
  );
}