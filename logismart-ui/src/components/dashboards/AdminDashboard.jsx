import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, StatRow, Table, Badge, PageHeader, Tabs } from '../UI';

const emptyUserForm = {
    firstName: '', lastName: '', email: '', password: '',
    role: '', department: '', phoneNumber: '',
};

const inputStyle = {
    background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
    fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};

const labelStyle = {
    fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600,
    letterSpacing: 0.5, fontFamily: 'var(--font-sans)',
};

export default function AdminDashboard() {
    const [trips, setTrips]           = useState([]);
    const [vehicles, setVehicles]     = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [invoices, setInvoices]     = useState([]);
    const [tab, setTab]               = useState('trips');

    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm]           = useState(emptyUserForm);
    const [submittingUser, setSubmittingUser] = useState(false);
    const [userError, setUserError]         = useState('');
    const [userSuccess, setUserSuccess]     = useState('');

    useEffect(() => {
        api.get('/trip').then(r => setTrips(r.data)).catch(() => {});
        api.get('/vehicle/available').then(r => setVehicles(r.data)).catch(() => {});
        api.get('/maintenance').then(r => setMaintenance(r.data)).catch(() => {});
        api.get('/invoice').then(r => setInvoices(r.data)).catch(() => {});
    }, []);

    const handleUserChange = e => setUserForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmitUser = async () => {
        setUserError(''); setUserSuccess('');
        if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.password || !userForm.role) {
            setUserError('Lütfen zorunlu (*) alanları doldurun.');
            return;
        }
        setSubmittingUser(true);
        try {
            await api.post('/auth/register', userForm);
            setUserSuccess('Kullanıcı başarıyla oluşturuldu.');
            setTimeout(() => {
                setShowUserModal(false);
                setUserForm(emptyUserForm);
                setUserSuccess('');
            }, 1500);
        } catch (e) {
            setUserError(e.response?.data?.message || 'Kullanıcı oluşturulamadı.');
        } finally {
            setSubmittingUser(false);
        }
    };

    const closeUserModal = () => { setShowUserModal(false); setUserError(''); setUserSuccess(''); setUserForm(emptyUserForm); };

    const createUserBtn = (
        <button
            onClick={() => setShowUserModal(true)}
            style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: '#fff',
                padding: '9px 20px', borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            + Yeni Kullanıcı
        </button>
    );

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader
                title="Admin Paneli"
                sub="Tüm sistem verilerine genel bakış"
                breadcrumb="Sistem Yönetimi"
                action={createUserBtn}
            />

            <StatRow>
                <StatCard label="Toplam Sefer"     value={trips.length}                            color="var(--blue)"   icon="🚛" />
                <StatCard label="Müsait Araç"      value={vehicles.length}                         color="var(--green)"  icon="🚘" />
                <StatCard label="Açık Bakım"       value={maintenance.filter(m => !m.isResolved).length} color="var(--orange)" icon="🛠" />
                <StatCard label="Ödenmemiş Fatura" value={invoices.filter(i => !i.isPaid).length}  color="var(--red)"    icon="💳" />
            </StatRow>

            <Tabs
                tabs={['trips', 'vehicles', 'maintenance', 'invoices']}
                labels={['Seferler', 'Araçlar', 'Bakım', 'Faturalar']}
                active={tab}
                onChange={setTab}
            />

            {tab === 'trips' && (
                <Table
                    headers={['Kod', 'Güzergah', 'Sürücü', 'Araç', 'Durum']}
                    rows={trips.map(t => [
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{t.tripCode}</span>,
                        `${t.origin} → ${t.destination}`,
                        t.driverName,
                        t.vehiclePlate,
                        <Badge status={t.status} />,
                    ])}
                />
            )}
            {tab === 'vehicles' && (
                <Table
                    headers={['Plaka', 'Marka', 'Model', 'Kapasite', 'Durum']}
                    rows={vehicles.map(v => [
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{v.plateNumber}</span>,
                        v.brand, v.model, `${v.maxLoadCapacityTons}t`,
                        <Badge status={v.status} />,
                    ])}
                />
            )}
            {tab === 'maintenance' && (
                <Table
                    headers={['Sorun', 'Araç', 'Teknisyen', 'Durum']}
                    rows={maintenance.map(m => [
                        m.issueDescription,
                        `Araç #${m.vehicleId}`,
                        `Teknisyen #${m.technicianId}`,
                        <Badge status={m.isResolved ? 'Resolved' : 'Open'} />,
                    ])}
                />
            )}
            {tab === 'invoices' && (
                <Table
                    headers={['Fatura No', 'Sefer', 'Toplam', 'Durum']}
                    rows={invoices.map(i => [
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{i.invoiceNumber}</span>,
                        `Sefer #${i.tripId}`,
                        `₺${i.totalAmount?.toLocaleString('tr-TR')}`,
                        <Badge status={i.isPaid ? 'Paid' : 'Unpaid'} />,
                    ])}
                />
            )}

            {/* ── Add User Modal ───────────────────────────────────── */}
            {showUserModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }} onClick={e => { if (e.target === e.currentTarget && !submittingUser) closeUserModal(); }}>
                    <div style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 16, padding: 32, width: 480,
                        maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'fadeInUp 0.25s ease forwards',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Yeni Kullanıcı Ekle</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Zorunlu alanlar (*) ile işaretlidir</div>
                            </div>
                            <button onClick={closeUserModal} disabled={submittingUser} style={{
                                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
                                width: 32, height: 32, borderRadius: 8, cursor: submittingUser ? 'not-allowed' : 'pointer', fontSize: 16,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>✕</button>
                        </div>

                        {userError && (
                            <div style={{
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#DC2626', padding: '10px 14px', borderRadius: 8,
                                fontSize: 13, marginBottom: 16,
                            }}>⚠ {userError}</div>
                        )}
                        {userSuccess && (
                            <div style={{
                                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                                color: '#059669', padding: '10px 14px', borderRadius: 8,
                                fontSize: 13, marginBottom: 16,
                            }}>✓ {userSuccess}</div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { name: 'firstName', label: 'Ad *', type: 'text', placeholder: 'Ahmet' },
                                { name: 'lastName',  label: 'Soyad *', type: 'text', placeholder: 'Yılmaz' },
                            ].map(f => (
                                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label style={labelStyle}>{f.label}</label>
                                    <input
                                        name={f.name} type={f.type} value={userForm[f.name]} onChange={handleUserChange} placeholder={f.placeholder} style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                        onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
                            <label style={labelStyle}>E-posta *</label>
                            <input
                                name="email" type="email" value={userForm.email} onChange={handleUserChange} placeholder="kullanici@logismart.com" style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
                            <label style={labelStyle}>Geçici Şifre *</label>
                            <input
                                name="password" type="password" value={userForm.password} onChange={handleUserChange} placeholder="••••••••" style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
                            <label style={labelStyle}>Rol *</label>
                            <select
                                name="role" value={userForm.role} onChange={handleUserChange} style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                            >
                                <option value="">Rol Seçin...</option>
                                <option value="Admin">Admin</option>
                                <option value="OperationsManager">Operations Manager</option>
                                <option value="Driver">Driver</option>
                                <option value="Customer">Customer</option>
                                <option value="MaintenanceTechnician">Maintenance Technician</option>
                                <option value="FinanceSpecialist">Finance Specialist</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                            {[
                                { name: 'department', label: 'Departman (Opsiyonel)', type: 'text', placeholder: 'Örn: Lojistik' },
                                { name: 'phoneNumber', label: 'Telefon (Opsiyonel)', type: 'text', placeholder: '555 123 4567' },
                            ].map(f => (
                                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label style={labelStyle}>{f.label}</label>
                                    <input
                                        name={f.name} type={f.type} value={userForm[f.name]} onChange={handleUserChange} placeholder={f.placeholder} style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                        onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button onClick={closeUserModal} disabled={submittingUser} style={{
                                background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                                padding: '10px 22px', borderRadius: 8, cursor: submittingUser ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, transition: 'background 0.15s',
                            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}>
                                İptal
                            </button>
                            <button onClick={handleSubmitUser} disabled={submittingUser || !!userSuccess} style={{
                                background: submittingUser || !!userSuccess ? 'var(--surface-3)' : 'var(--green)',
                                border: 'none', color: '#FFFFFF', padding: '10px 24px', borderRadius: 8,
                                cursor: submittingUser || !!userSuccess ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: 13,
                                opacity: submittingUser ? 0.7 : 1, transition: 'filter 0.15s, box-shadow 0.15s',
                            }} onMouseEnter={e => { if (!submittingUser && !userSuccess) { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.3)'; }}} onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                {submittingUser ? 'Oluşturuluyor...' : userSuccess ? '✓ Oluşturuldu' : '+ Kullanıcıyı Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}