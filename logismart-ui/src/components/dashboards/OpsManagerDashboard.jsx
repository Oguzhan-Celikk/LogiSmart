import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, Table, Badge } from '../UI';

const p = { padding: '28px 0', height: '100%', overflowY: 'auto' };
const row = { display: 'flex', gap: 16, padding: '0 28px 20px', flexWrap: 'wrap' };

function Header({ title, sub }) {
    return (
        <div style={{ padding: '14px 28px 20px', borderBottom: '1px solid #1e2d40', marginBottom: 20, background: '#111827' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</div>
        </div>
    );
}

function Tabs({ tabs, labels, active, onChange }) {
    return (
        <div style={{ display: 'flex', gap: 8, padding: '0 28px 16px' }}>
            {tabs.map((tab, i) => (
                <button key={tab} onClick={() => onChange(tab)} style={{
                    background: active === tab ? '#1e2d40' : 'transparent',
                    border: `1px solid ${active === tab ? '#f59e0b' : '#1e2d40'}`,
                    color: active === tab ? '#f59e0b' : '#64748b',
                    padding: '6px 16px', borderRadius: 20, fontSize: 12,
                    cursor: 'pointer', fontFamily: 'monospace', fontWeight: active === tab ? 700 : 400,
                }}>{labels[i]}</button>
            ))}
        </div>
    );
}

const emptyForm = {
    origin: '', destination: '', cargoWeightTons: '', cargoDescription: '',
    plannedDepartureDate: '', estimatedDistanceKm: '',
    vehicleId: '', driverId: '', customerId: '',
};

export default function OpsManagerDashboard() {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [tab, setTab] = useState('trips');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

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
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/trip', {
                origin: form.origin,
                destination: form.destination,
                cargoWeightTons: parseFloat(form.cargoWeightTons),
                cargoDescription: form.cargoDescription,
                plannedDepartureDate: new Date(form.plannedDepartureDate).toISOString(),
                estimatedDistanceKm: parseFloat(form.estimatedDistanceKm),
                vehicleId: parseInt(form.vehicleId),
                driverId: parseInt(form.driverId),
                customerId: parseInt(form.customerId),
            });
            setShowModal(false);
            setForm(emptyForm);
            fetchAll();
        } catch (e) {
            setError(e.response?.data?.message || 'Sefer oluşturulamadı.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={p}>
            <Header title="Operasyon Yöneticisi" sub="Sefer planlama ve filo koordinasyonu" />

            <div style={row}>
                <StatCard label="Aktif Sefer"   value={trips.filter(t => t.status === 'InTransit').length} color="#3b82f6" />
                <StatCard label="Planlı Sefer"  value={trips.filter(t => t.status === 'Planned').length}   color="#8b5cf6" />
                <StatCard label="Müsait Araç"   value={vehicles.length}                                     color="#10b981" />
                <StatCard label="Tamamlanan"    value={trips.filter(t => t.status === 'Delivered').length}  color="#f59e0b" />
            </div>

            {/* Tab bar + buton */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['trips', 'vehicles'].map((t, i) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            background: tab === t ? '#1e2d40' : 'transparent',
                            border: `1px solid ${tab === t ? '#f59e0b' : '#1e2d40'}`,
                            color: tab === t ? '#f59e0b' : '#64748b',
                            padding: '6px 16px', borderRadius: 20, fontSize: 12,
                            cursor: 'pointer', fontFamily: 'monospace', fontWeight: tab === t ? 700 : 400,
                        }}>{['Tüm Seferler', 'Müsait Araçlar'][i]}</button>
                    ))}
                </div>
                <button onClick={() => setShowModal(true)} style={{
                    background: '#f59e0b', border: 'none', color: '#000',
                    padding: '8px 20px', borderRadius: 20, fontSize: 12,
                    cursor: 'pointer', fontWeight: 700, fontFamily: 'monospace',
                }}>+ Yeni Sefer Oluştur</button>
            </div>

            {tab === 'trips' && (
                <Table
                    headers={['Kod', 'Güzergah', 'Sürücü', 'Araç', 'Tarih', 'Durum']}
                    rows={trips.map(t => [
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{t.tripCode}</span>,
                        `${t.origin} → ${t.destination}`,
                        t.driverName,
                        t.vehiclePlate,
                        new Date(t.plannedDepartureDate).toLocaleDateString('tr-TR'),
                        <Badge status={t.status} />,
                    ])}
                />
            )}
            {tab === 'vehicles' && (
                <Table
                    headers={['Plaka', 'Marka', 'Model', 'Max Yük', 'Km']}
                    rows={vehicles.map(v => [
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{v.plateNumber}</span>,
                        v.brand, v.model, `${v.maxLoadCapacityTons}t`,
                        v.mileage?.toLocaleString(),
                    ])}
                />
            )}

            {/* MODAL */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }}>
                    <div style={{
                        background: '#111827', border: '1px solid #1e2d40', borderRadius: 16,
                        padding: 32, width: 540, maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>Yeni Sefer Oluştur</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Tüm alanları eksiksiz doldurun</div>
                            </div>
                            <button onClick={() => { setShowModal(false); setError(''); setForm(emptyForm); }} style={{
                                background: 'transparent', border: '1px solid #1e2d40', color: '#64748b',
                                width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16,
                            }}>✕</button>
                        </div>

                        {error && (
                            <div style={{ background: '#3f0f0f', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { name: 'origin',             label: 'Çıkış Noktası *',    type: 'text',           placeholder: 'İstanbul (Tuzla OSB)' },
                                { name: 'destination',         label: 'Varış Noktası *',    type: 'text',           placeholder: 'Ankara (OSTİM)' },
                                { name: 'cargoWeightTons',     label: 'Yük Ağırlığı (ton)', type: 'number',         placeholder: '18.5' },
                                { name: 'estimatedDistanceKm', label: 'Mesafe (km)',        type: 'number',         placeholder: '450' },
                                { name: 'plannedDepartureDate',label: 'Planlı Kalkış *',   type: 'datetime-local', placeholder: '' },
                                { name: 'cargoDescription',    label: 'Kargo Açıklaması',   type: 'text',           placeholder: 'Çelik Rulo' },
                            ].map(f => (
                                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                                    <input
                                        name={f.name} type={f.type} value={form[f.name]}
                                        onChange={handleChange} placeholder={f.placeholder}
                                        style={{ background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'monospace' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Select'ler */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Araç *</label>
                                <select name="vehicleId" value={form.vehicleId} onChange={handleChange}
                                        style={{ background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}>
                                    <option value="">Seç...</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.plateNumber} ({v.maxLoadCapacityTons}t)</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sürücü *</label>
                                <select name="driverId" value={form.driverId} onChange={handleChange}
                                        style={{ background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}>
                                    <option value="">Seç...</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Müşteri *</label>
                                <select name="customerId" value={form.customerId} onChange={handleChange}
                                        style={{ background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}>
                                    <option value="">Seç...</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setShowModal(false); setError(''); setForm(emptyForm); }} style={{
                                background: 'transparent', border: '1px solid #1e2d40', color: '#64748b',
                                padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: 'monospace', fontSize: 13,
                            }}>İptal</button>
                            <button onClick={handleSubmit} disabled={submitting} style={{
                                background: submitting ? '#78350f' : '#f59e0b', border: 'none', color: '#000',
                                padding: '10px 24px', borderRadius: 8, cursor: 'pointer',
                                fontWeight: 700, fontFamily: 'monospace', fontSize: 13,
                            }}>{submitting ? 'Oluşturuluyor...' : 'Sefer Oluştur ✓'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}