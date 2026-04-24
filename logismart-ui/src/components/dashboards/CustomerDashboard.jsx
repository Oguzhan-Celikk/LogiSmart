import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Badge } from '../UI';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        api.get(`/trip/my-trips/customer/${user.userId}`)
            .then(r => setTrips(r.data))
            .catch(() => {});
    }, []);

    return (
        <div style={p}>
            <Header title="Kargo Takip" sub={`${user?.fullName} — Yük Durumu`} />

            <div style={{ display: 'flex', gap: 16, padding: '0 28px 20px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Toplam Gönderi', value: trips.length, color: '#3b82f6' },
                    { label: 'Yolda', value: trips.filter(t => t.status === 'InTransit').length, color: '#f59e0b' },
                    { label: 'Teslim Edildi', value: trips.filter(t => t.status === 'Delivered').length, color: '#10b981' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#111827', border: `1px solid #1e2d40`, borderLeft: `3px solid ${s.color}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
                        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ margin: '0 28px', background: '#111827', border: '1px solid #1e2d40', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2d40', fontSize: 13, fontWeight: 700 }}>Gönderilerim</div>
                {trips.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Henüz gönderi kaydı bulunamadı.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#0d1526' }}>
                            {['Takip Kodu','Çıkış','Varış','Kargo','Durum'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {trips.map((t, i) => (
                            <tr key={t.id} style={{ borderTop: '1px solid #1e2d40', background: i % 2 === 0 ? 'transparent' : '#0d1526' }}>
                                <td style={{ padding: '12px 16px', fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>{t.tripCode}</td>
                                <td style={{ padding: '12px 16px', fontSize: 12 }}>{t.origin}</td>
                                <td style={{ padding: '12px 16px', fontSize: 12 }}>{t.destination}</td>
                                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{t.cargoWeightTons}t</td>
                                <td style={{ padding: '12px 16px' }}><Badge status={t.status} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

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