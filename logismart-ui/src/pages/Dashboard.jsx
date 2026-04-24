import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import OpsManagerDashboard from '../components/dashboards/OpsManagerDashboard';
import DriverDashboard from '../components/dashboards/DriverDashboard';
import CustomerDashboard from '../components/dashboards/CustomerDashboard';
import TechnicianDashboard from '../components/dashboards/TechnicianDashboard';
import FinanceDashboard from '../components/dashboards/FinanceDashboard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/');
    }, [user]);

    const handleLogout = () => { logout(); navigate('/'); };

    const renderDashboard = () => {
        switch (user?.role) {
            case 'Admin':                  return <AdminDashboard />;
            case 'OperationsManager':      return <OpsManagerDashboard />;
            case 'Driver':                 return <DriverDashboard />;
            case 'Customer':               return <CustomerDashboard />;
            case 'MaintenanceTechnician':  return <TechnicianDashboard />;
            case 'FinanceSpecialist':      return <FinanceDashboard />;
            default: return <div style={{color:'#fff',padding:40}}>Bilinmeyen rol.</div>;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#0a0f1e', color: '#e2e8f0', fontFamily: 'monospace' }}>
            {/* Sidebar */}
            <div style={{ width: 220, background: '#111827', borderRight: '1px solid #1e2d40', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 20px', borderBottom: '1px solid #1e2d40' }}>
                    <div style={{ width: 36, height: 36, background: '#f59e0b', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#000' }}>L</div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>LogiSmart</div>
                        <div style={{ fontSize: 9, color: '#64748b', letterSpacing: 2 }}>FLEET ERP</div>
                    </div>
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2d40' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.fullName}</div>
                    <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>{user?.role}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>JWT Auth ✓</div>
                </div>

                <div style={{ padding: '12px', flex: 1 }}>
                    <div style={{ fontSize: 9, color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 8px 4px' }}>Aktif Modül</div>
                    <div style={{ background: '#1e2d40', borderLeft: '2px solid #f59e0b', color: '#f59e0b', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                        {roleLabel(user?.role)}
                    </div>
                </div>

                <button onClick={handleLogout} style={{ margin: 16, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' }}>
                    Çıkış Yap
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {renderDashboard()}
            </div>
        </div>
    );
}

function roleLabel(role) {
    const map = {
        Admin: '⬡ Sistem Yönetimi',
        OperationsManager: '📋 Operasyon',
        Driver: '🚛 Sürücü Paneli',
        Customer: '📦 Kargo Takip',
        MaintenanceTechnician: '🛠️ Teknik Servis',
        FinanceSpecialist: '💳 Muhasebe',
    };
    return map[role] || role;
}