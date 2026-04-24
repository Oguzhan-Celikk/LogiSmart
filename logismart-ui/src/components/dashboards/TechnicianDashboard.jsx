import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Badge } from '../UI';

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

    const open = logs.filter(l => !l.isResolved);
    const resolved = logs.filter(l => l.isResolved);

    return (
        <div style={p}>
            <Header title="Teknik Servis" sub="Araç bakım ve arıza yönetimi" />

            <div style={{ display: 'flex', gap: 16, padding: '0 28px 20px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Açık Arıza', value: open.length, color: '#ef4444' },
                    { label: 'Çözülen', value: resolved.length, color: '#10b981' },
                    { label: 'Toplam Kayıt', value: logs.length, color: '#3b82f6' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#111827', border: `1px solid #1e2d40`, borderLeft: `3px solid ${s.color}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
                        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ margin: '0 28px' }}>
                {logs.map(m => (
                    <div key={m.id} style={{ background: '#111827', border: `1px solid #1e2d40`, borderLeft: `3px solid ${m.isResolved ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{m.issueDescription}</div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>
                                    Araç #{m.vehicleId} &nbsp;|&nbsp; Teknisyen #{m.technicianId} &nbsp;|&nbsp;
                                    {new Date(m.reportedDate).toLocaleDateString('tr-TR')}
                                    {m.repairCost > 0 && <> &nbsp;|&nbsp; Maliyet: <span style={{color:'#f59e0b'}}>₺{m.repairCost.toLocaleString()}</span></>}
                                </div>
                                {m.resolutionNotes && <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>✓ {m.resolutionNotes}</div>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                <Badge status={m.isResolved ? 'Resolved' : 'Open'} />
                                {!m.isResolved && (
                                    <button onClick={() => resolve(m.id)} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '5px 14px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: 'monospace' }}>
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