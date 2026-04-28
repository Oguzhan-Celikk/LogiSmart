import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatCard, StatRow, Table, Badge, PageHeader, Tabs } from '../UI';

const emptyForm = {
    origin: '', destination: '', cargoWeightTons: '', cargoDescription: '',
    plannedDepartureDate: '', estimatedDistanceKm: '',
    vehicleId: '', driverId: '', customerId: '',
};

const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};

const labelStyle = {
    fontSize: 11, color: 'var(--text-secondary)',
    fontWeight: 600, letterSpacing: 0.5,
    fontFamily: 'var(--font-sans)',
};

export default function OpsManagerDashboard() {
    const { user }                  = useAuth();
    const [trips, setTrips]         = useState([]);
    const [vehicles, setVehicles]   = useState([]);
    const [drivers, setDrivers]     = useState([]);
    const [customers, setCustomers] = useState([]);
    const [tab, setTab]             = useState('trips');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm]           = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState('');

    const fetchAll = () => {
        api.get('/trip').then(r => setTrips(r.data)).catch(() => {});
        api.get('/vehicle/available').then(r => setVehicles(r.data)).catch(() => {});
        api.get('/user/role/Driver').then(r => setDrivers(r.data)).catch(() => {});
        api.get('/user/role/Customer').then(r => setCustomers(r.data)).catch(() => {});
    };

    useEffect(() => { fetchAll(); }, []);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        setError('');
        if (!form.origin || !form.destination || !form.vehicleId || !form.driverId || !form.customerId) {
            setError('Please fill in the required (*) fields.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/trip', {
                origin: form.origin, destination: form.destination,
                cargoWeightTons: parseFloat(form.cargoWeightTons),
                cargoDescription: form.cargoDescription,
                plannedDepartureDate: new Date(form.plannedDepartureDate).toISOString(),
                estimatedDistanceKm: parseFloat(form.estimatedDistanceKm),
                vehicleId: parseInt(form.vehicleId),
                driverId: parseInt(form.driverId),
                customerId: parseInt(form.customerId),
                operationsManagerId: user.userId,
            });
            setShowModal(false); setForm(emptyForm); fetchAll();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create trip.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => { setShowModal(false); setError(''); setForm(emptyForm); };

    const createBtn = (
        <button
            onClick={() => setShowModal(true)}
            style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none', color: '#000',
                padding: '9px 20px', borderRadius: 'var(--radius-md)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            + New Trip
        </button>
    );

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader
                title="Operations Manager"
                sub="Trip planning and fleet coordination"
                breadcrumb="Operations"
                action={createBtn}
            />

            <StatRow>
                <StatCard label="Active Trips"  value={trips.filter(t => t.status === 'InTransit').length} color="var(--blue)"   icon="🚛" />
                <StatCard label="Planned Trips" value={trips.filter(t => t.status === 'Planned').length}   color="var(--purple)" icon="📋" />
                <StatCard label="Available Vehicles"  value={vehicles.length}                                     color="var(--green)"  icon="🚘" />
                <StatCard label="Completed"   value={trips.filter(t => t.status === 'Delivered').length}  color="var(--accent)" icon="✅" />
            </StatRow>

            <Tabs
                tabs={['trips', 'vehicles']}
                labels={['All Trips', 'Available Vehicles']}
                active={tab}
                onChange={setTab}
            />

            {tab === 'trips' && (
                <Table
                    headers={['Code', 'Route', 'Driver', 'Vehicle', 'Date', 'Status']}
                    rows={trips.map(t => [
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{t.tripCode}</span>,
                        `${t.origin} → ${t.destination}`,
                        t.driverName, t.vehiclePlate,
                        new Date(t.plannedDepartureDate).toLocaleDateString('tr-TR'),
                        <Badge status={t.status} />,
                    ])}
                />
            )}
            {tab === 'vehicles' && (
                <Table
                    headers={['Plate', 'Brand', 'Model', 'Max Load', 'Mileage']}
                    rows={vehicles.map(v => [
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{v.plateNumber}</span>,
                        v.brand, v.model, `${v.maxLoadCapacityTons}t`,
                        v.mileage?.toLocaleString('tr-TR'),
                    ])}
                />
            )}

            {/* ── Modal ───────────────────────────────────── */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 32, width: 560,
                        maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'fadeInUp 0.25s ease forwards',
                    }}>
                        {/* Modal header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Create New Trip</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Required fields are marked with (*)</div>
                            </div>
                            <button onClick={closeModal} style={{
                                background: 'transparent', border: '1px solid var(--border)',
                                color: 'var(--text-muted)', width: 32, height: 32,
                                borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 16,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>✕</button>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#DC2626', padding: '10px 14px', borderRadius: 8,
                                fontSize: 13, marginBottom: 16,
                            }}>⚠ {error}</div>
                        )}

                        {/* Text inputs grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { name: 'origin',              label: 'Origin *',    type: 'text',           placeholder: 'Istanbul (Tuzla)' },
                                { name: 'destination',         label: 'Destination *',     type: 'text',           placeholder: 'Ankara (OSTIM)' },
                                { name: 'cargoWeightTons',     label: 'Cargo Weight (tons)', type: 'number',         placeholder: '18.5' },
                                { name: 'estimatedDistanceKm', label: 'Distance (km)',         type: 'number',         placeholder: '450' },
                                { name: 'plannedDepartureDate',label: 'Planned Departure *',    type: 'datetime-local', placeholder: '' },
                                { name: 'cargoDescription',    label: 'Cargo Description',   type: 'text',           placeholder: 'Steel Rolls' },
                            ].map(f => (
                                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label style={labelStyle}>{f.label}</label>
                                    <input
                                        name={f.name} type={f.type} value={form[f.name]}
                                        onChange={handleChange} placeholder={f.placeholder}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                        onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Selects */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                            {[
                                { name: 'vehicleId',  label: 'Vehicle *',    options: vehicles.map(v => ({ value: v.id, label: `${v.plateNumber} (${v.maxLoadCapacityTons}t)` })) },
                                { name: 'driverId',   label: 'Driver *',  options: drivers.map(d => ({ value: d.id, label: d.fullName })) },
                                { name: 'customerId', label: 'Customer *', options: customers.map(c => ({ value: c.id, label: c.fullName })) },
                            ].map(sel => (
                                <div key={sel.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label style={labelStyle}>{sel.label}</label>
                                    <select
                                        name={sel.name} value={form[sel.name]} onChange={handleChange}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; e.target.style.background = 'var(--surface)'; }}
                                        onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)'; }}
                                    >
                                        <option value="">Select...</option>
                                        {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)', padding: '10px 22px',
                                borderRadius: 8, cursor: 'pointer',
                                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                            >Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} style={{
                                background: submitting ? 'var(--surface-3)' : 'var(--accent)',
                                border: 'none', color: '#FFFFFF',
                                padding: '10px 24px', borderRadius: 8, cursor: 'pointer',
                                fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: 13,
                                opacity: submitting ? 0.7 : 1,
                                transition: 'filter 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.boxShadow = '0 4px 14px var(--accent-dim)'; }}}
                            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {submitting ? 'Creating...' : 'Create Trip ✓'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}