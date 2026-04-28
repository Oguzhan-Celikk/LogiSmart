import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import OpsManagerDashboard from '../components/dashboards/OpsManagerDashboard';
import DriverDashboard from '../components/dashboards/DriverDashboard';
import CustomerDashboard from '../components/dashboards/CustomerDashboard';
import TechnicianDashboard from '../components/dashboards/TechnicianDashboard';
import FinanceDashboard from '../components/dashboards/FinanceDashboard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ROLE_COLOR = {
    Admin:                '#ef4444',
    OperationsManager:    '#6366f1',
    Driver:               '#3b82f6',
    Customer:             '#10b981',
    MaintenanceTechnician:'#f59e0b',
    FinanceSpecialist:    '#8b5cf6',
};

const ROLE_LABEL = {
    Admin:                'SYSTEM ADMINISTRATOR',
    OperationsManager:    'OPERATIONS MANAGER',
    Driver:               'DRIVER',
    Customer:             'CUSTOMER',
    MaintenanceTechnician:'TECHNICIAN',
    FinanceSpecialist:    'FINANCE SPECIALIST',
};

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { isDark, toggle } = useTheme();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        if (!user) navigate('/');
    }, [user]);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };
    const accentColor = ROLE_COLOR[user?.role] || '#f59e0b';

    const renderDashboard = () => {
        switch (user?.role) {
            case 'Admin':                  return <AdminDashboard />;
            case 'OperationsManager':      return <OpsManagerDashboard />;
            case 'Driver':                 return <DriverDashboard />;
            case 'Customer':               return <CustomerDashboard />;
            case 'MaintenanceTechnician':  return <TechnicianDashboard />;
            case 'FinanceSpecialist':      return <FinanceDashboard />;
            default: return <div style={{color:'var(--text-secondary)',padding:40}}>Unknown role.</div>;
        }
    };

    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div style={s.layout}>
            {/* ── Sidebar ─────────────────────────────── */}
            <aside style={s.sidebar}>
                {/* Brand */}
                <div style={s.brand}>
                    <div style={s.brandLogo}>L</div>
                    <div>
                        <div style={s.brandName}>LogiSmart</div>
                        <div style={s.brandTag}>FLEET ERP</div>
                    </div>
                </div>

                {/* User card */}
                <div style={s.userCard}>
                    <div style={{ ...s.avatar, background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}99 100%)` }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={s.userName}>{user?.fullName}</div>
                        <div style={{ ...s.userRole, color: accentColor }}>{ROLE_LABEL[user?.role] || user?.role}</div>
                    </div>
                    <div style={{ ...s.statusDot, background: '#10b981' }} title="Online" />
                </div>



                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Clock widget */}
                <div style={s.clockWidget}>
                    <div style={s.clockTime}>
                        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </div>
                    <div style={s.clockDate}>
                        {time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>

                {/* Logout */}
                <button
                    id="logout-btn"
                    onClick={handleLogout}
                    style={s.logoutBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <span>↩</span> Log Out
                </button>
            </aside>

            {/* ── Main Content + Theme Toggle ───────── */}
            <main style={s.main} className="animate-fade-in">
                {/* Theme toggle — top right */}
                <div style={s.topBar}>
                    <button
                        id="theme-toggle"
                        onClick={toggle}
                        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                        style={s.themeBtn}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--surface-2)';
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.transform = 'rotate(20deg) scale(1.1)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--surface)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                        }}
                    >
                        <span style={{ fontSize: 18, lineHeight: 1, transition: 'transform 0.3s ease' }}>
                            {isDark ? '☀️' : '🌙'}
                        </span>
                    </button>
                </div>
                {renderDashboard()}
            </main>
        </div>
    );
}

const s = {
    layout: {
        display: 'flex',
        height: '100vh',
        background: 'var(--bg)',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
    },
    sidebar: {
        width: 240,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    brand: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '20px 20px',
        borderBottom: '1px solid var(--border)',
    },
    brandLogo: {
        width: 36, height: 36,
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, color: '#000',
        boxShadow: '0 0 12px rgba(245,158,11,0.3)',
        flexShrink: 0,
    },
    brandName: {
        fontSize: 15, fontWeight: 800, color: 'var(--text-primary)',
        letterSpacing: '-0.3px',
    },
    brandTag: {
        fontSize: 9, color: 'var(--text-muted)',
        letterSpacing: 2, fontFamily: 'var(--font-mono)',
    },
    userCard: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px',
        margin: '12px',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
    },
    avatar: {
        width: 36, height: 36, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: '#fff',
        flexShrink: 0,
    },
    userName: {
        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    userRole: {
        fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
        fontFamily: 'var(--font-mono)',
        marginTop: 2,
    },
    statusDot: {
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        boxShadow: '0 0 6px #10b981',
    },
    clockWidget: {
        margin: '0 12px 12px',
        padding: '12px 14px',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        textAlign: 'center',
    },
    clockTime: {
        fontSize: 18, fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-primary)',
        letterSpacing: 1,
    },
    clockDate: {
        fontSize: 10, color: 'var(--text-muted)',
        marginTop: 3, textTransform: 'capitalize',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        margin: '0 12px 16px',
        padding: '9px',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-muted)',
        fontSize: 13, fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'var(--transition)',
    },
    main: {
        flex: 1,
        overflow: 'auto',
        background: 'var(--bg)',
        position: 'relative',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px 20px 0',
        pointerEvents: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    },
    themeBtn: {
        width: 38, height: 38,
        borderRadius: '50%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, transform 0.3s',
        boxShadow: 'var(--shadow-sm)',
        pointerEvents: 'all',
        flexShrink: 0,
    },
};