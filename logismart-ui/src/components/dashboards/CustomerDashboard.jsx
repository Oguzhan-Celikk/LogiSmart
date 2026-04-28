import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { StatCard, StatRow, Badge, PageHeader } from '../UI';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        if (!user?.userId) return;
        api.get(`/trip/my-trips/customer/${user.userId}`).then(r => {
            setTrips(r.data || []);
        }).catch(() => {});
    }, [user?.userId]);

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader
                title="Kargo Takip"
                sub={`${user?.fullName} — Gönderi durumunuz`}
                breadcrumb="Kargolarım"
            />

            <StatRow>
                <StatCard label="Toplam Gönderi"  value={trips.length}                                       color="var(--blue)"   icon="📦" />
                <StatCard label="Planlanan"       value={trips.filter(t => t.status === 'Planned').length}   color="var(--purple)" icon="📅" />
                <StatCard label="Yolda"           value={trips.filter(t => t.status === 'InTransit').length} color="var(--accent)" icon="🚛" />
                <StatCard label="Teslim Edildi"   value={trips.filter(t => t.status === 'Delivered').length} color="var(--green)"  icon="✅" />
            </StatRow>

            <div style={{ margin: '0 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Gönderilerim
                </div>
                {trips.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                        Henüz gönderi kaydı bulunamadı.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-2)' }}>
                                {['Takip Kodu', 'Çıkış', 'Varış', 'Kargo', 'Tahmini Kalkış', 'Durum'].map(h => (
                                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((t, i) => {
                                const baseBg = i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)';
                                return (
                                    <tr
                                        key={t.id}
                                        style={{ borderTop: '1px solid var(--border)', background: baseBg, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                                        onMouseLeave={e => e.currentTarget.style.background = baseBg}
                                    >
                                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{t.tripCode}</td>
                                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>{t.origin}</td>
                                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>{t.destination}</td>
                                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{t.cargoWeightTons}t</td>
                                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(t.plannedDepartureDate).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td style={{ padding: '12px 16px' }}><Badge status={t.status} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}