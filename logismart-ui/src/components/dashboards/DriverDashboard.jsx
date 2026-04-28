import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { StatCard, StatRow, Badge, PageHeader } from '../UI';

export default function DriverDashboard() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);

    const loadTrips = () =>
        api.get(`/trip/my-trips/${user.userId}`).then(r => setTrips(r.data)).catch(() => {});

    useEffect(() => { loadTrips(); }, []);

    const active    = trips.find(t => t.status === 'InTransit');
    const planned   = trips.filter(t => t.status === 'Planned');
    const completed = trips.filter(t => t.status === 'Delivered');

    const updateStatus = async (tripId, status) => {
        try {
            await api.patch(`/trip/${tripId}/status`, { status });
            await loadTrips();
        } catch { alert('Status update failed.'); }
    };

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader
                title="Driver Dashboard"
                sub={`Welcome, ${user?.fullName}`}
                breadcrumb="Driver"
            />

            {/* Active trip card */}
            <div style={{ padding: '0 28px 24px' }}>
                {active ? (
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderLeft: '4px solid var(--accent)',
                        borderRadius: 12,
                        padding: 24,
                        position: 'relative', overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        {/* Glow */}
                        <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
                        <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                            🚛 Active Trip
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
                            {active.origin} → {active.destination}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 18, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <span>Code: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{active.tripCode}</span></span>
                            <span>Vehicle: <span style={{ color: 'var(--text-secondary)' }}>{active.vehiclePlate}</span></span>
                            <span>Cargo: <span style={{ color: 'var(--text-secondary)' }}>{active.cargoWeightTons}t</span></span>
                        </div>
                        <button
                            onClick={() => updateStatus(active.id, 'Delivered')}
                            style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none', color: '#fff',
                                padding: '10px 24px', borderRadius: 'var(--radius-md)',
                                cursor: 'pointer', fontWeight: 700, fontSize: 13,
                                fontFamily: 'var(--font-sans)', transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            ✓ Mark as Delivered
                        </button>
                    </div>
                ) : (
                    <div style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: 24,
                        color: 'var(--text-muted)', textAlign: 'center', fontSize: 14,
                    }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>🟢</div>
                        You have no active trips at the moment.
                    </div>
                )}
            </div>

            <StatRow>
                <StatCard label="Total Trips" value={trips.length}   color="var(--blue)"   icon="📦" />
                <StatCard label="Planned"        value={planned.length} color="var(--purple)" icon="📅" />
                <StatCard label="Completed"    value={completed.length} color="var(--green)" icon="✅" />
            </StatRow>

            {/* All trips table */}
            <div style={{ margin: '0 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    All My Trips
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--surface-2)' }}>
                            {['Code', 'Route', 'Cargo', 'Date', 'Status', 'Action'].map(h => (
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
                                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>{t.origin} → {t.destination}</td>
                                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{t.cargoWeightTons}t</td>
                                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(t.plannedDepartureDate).toLocaleDateString('en-US')}</td>
                                <td style={{ padding: '12px 16px' }}><Badge status={t.status} /></td>
                                <td style={{ padding: '12px 16px' }}>
                                    {t.status === 'Planned' && (
                                        <button
                                            onClick={() => updateStatus(t.id, 'InTransit')}
                                            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.4)', color: 'var(--blue)', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, transition: 'var(--transition)' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                                        >
                                            Depart →
                                        </button>
                                    )}
                                </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}