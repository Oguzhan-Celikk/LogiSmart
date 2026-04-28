import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, StatRow, Badge, PageHeader } from '../UI';

export default function TechnicianDashboard() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = () => api.get('/maintenance').then(r => setLogs(r.data)).catch(() => {});
    useEffect(() => { fetchLogs(); }, []);

    const resolve = async (id) => {
        try {
            await api.patch(`/maintenance/${id}/resolve`, JSON.stringify('Sorun çözüldü, araç servise hazır.'), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchLogs();
        } catch { alert('İşlem başarısız.'); }
    };

    const open     = logs.filter(l => !l.isResolved);
    const resolved = logs.filter(l => l.isResolved);

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader title="Teknik Servis" sub="Araç bakım ve arıza yönetimi" breadcrumb="Teknik Servis" />

            <StatRow>
                <StatCard label="Açık Arıza"   value={open.length}     color="var(--red)"   icon="⚡" />
                <StatCard label="Çözülen"       value={resolved.length} color="var(--green)" icon="✅" />
                <StatCard label="Toplam Kayıt"  value={logs.length}     color="var(--blue)"  icon="📋" />
            </StatRow>

            <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {logs.length === 0 && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🛠️</div>
                        Henüz bakım kaydı yok.
                    </div>
                )}
                {logs.map(m => (
                    <div
                        key={m.id}
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderLeft: `3px solid ${m.isResolved ? 'var(--green)' : 'var(--red)'}`,
                            borderRadius: 'var(--radius-lg)',
                            padding: '18px 20px',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
                                    {m.issueDescription}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
                                    <span>Araç #{m.vehicleId}</span>
                                    <span>Teknisyen #{m.technicianId}</span>
                                    <span>{new Date(m.reportedDate).toLocaleDateString('tr-TR')}</span>
                                    {m.repairCost > 0 && (
                                        <span>Maliyet: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₺{m.repairCost.toLocaleString('tr-TR')}</span></span>
                                    )}
                                </div>
                                {m.resolutionNotes && (
                                    <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 8, fontStyle: 'italic' }}>
                                        ✓ {m.resolutionNotes}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                <Badge status={m.isResolved ? 'Resolved' : 'Open'} />
                                {!m.isResolved && (
                                    <button
                                        onClick={() => resolve(m.id)}
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            border: 'none', color: '#fff',
                                            padding: '6px 14px', borderRadius: 'var(--radius-md)',
                                            fontSize: 12, cursor: 'pointer', fontWeight: 700,
                                            fontFamily: 'var(--font-sans)',
                                            transition: 'transform 0.15s, box-shadow 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        Çöz ✓
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}