import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, StatRow, Badge, PageHeader } from '../UI';
import { useAuth } from '../../context/AuthContext';

export default function TechnicianDashboard() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [showAdd, setShowAdd] = useState(false);
    const [newLog, setNewLog] = useState({ vehicleId: '', issueDescription: '' });

    const [resolvingId, setResolvingId] = useState(null);
    const [resolutionData, setResolutionData] = useState({ resolutionNotes: '', repairCost: '' });

    const fetchLogs = () => api.get('/maintenance').then(r => setLogs(r.data)).catch(() => {});
    const fetchVehicles = () => api.get('/vehicle/available').then(r => setVehicles(r.data)).catch(() => {});

    useEffect(() => { 
        fetchLogs(); 
        fetchVehicles();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance', {
                vehicleId: parseInt(newLog.vehicleId),
                issueDescription: newLog.issueDescription,
                technicianId: user.id
            });
            setShowAdd(false);
            setNewLog({ vehicleId: '', issueDescription: '' });
            fetchLogs();
            fetchVehicles();
        } catch {
            alert('Failed to add breakdown.');
        }
    };

    const handleResolveSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/maintenance/${resolvingId}/resolve`, {
                resolutionNotes: resolutionData.resolutionNotes,
                repairCost: parseFloat(resolutionData.repairCost) || 0
            });
            setResolvingId(null);
            setResolutionData({ resolutionNotes: '', repairCost: '' });
            fetchLogs();
            fetchVehicles();
        } catch { 
            alert('Operation failed.'); 
        }
    };

    const open     = logs.filter(l => !l.isResolved);
    const resolved = logs.filter(l => l.isResolved);

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto', position: 'relative' }}>
            <PageHeader 
                title="Technical Service" 
                sub="Vehicle maintenance and breakdown management" 
                breadcrumb="Technical Service" 
                action={
                    <button 
                        onClick={() => setShowAdd(true)}
                        style={{
                            background: 'var(--accent)', border: 'none', color: '#fff',
                            padding: '8px 16px', borderRadius: 'var(--radius-md)',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        + Add Breakdown
                    </button>
                }
            />

            <StatRow>
                <StatCard label="Open Breakdown"   value={open.length}     color="var(--red)"   icon="⚡" />
                <StatCard label="Resolved"       value={resolved.length} color="var(--green)" icon="✅" />
                <StatCard label="Total Records"  value={logs.length}     color="var(--blue)"  icon="📋" />
            </StatRow>

            <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {logs.length === 0 && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🛠️</div>
                        No maintenance records yet.
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
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                                    <span>{m.vehiclePlate || `Vehicle #${m.vehicleId}`}</span>
                                    <span>{m.technicianName || `Technician #${m.technicianId}`}</span>
                                    <span>{new Date(m.reportedDate).toLocaleDateString('en-US')}</span>
                                    {m.repairCost > 0 && (
                                        <span>Cost: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${m.repairCost.toLocaleString('en-US')}</span></span>
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
                                        onClick={() => setResolvingId(m.id)}
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
                                        Resolve ✓
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showAdd && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>New Breakdown Record</h3>
                        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Select Vehicle</label>
                                <select 
                                    style={inputStyle} 
                                    value={newLog.vehicleId} 
                                    onChange={e => setNewLog({ ...newLog, vehicleId: e.target.value })} 
                                    required
                                >
                                    <option value="">Select a vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.plateNumber} - {v.brand} {v.model}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Breakdown Description</label>
                                <input 
                                    style={inputStyle}
                                    value={newLog.issueDescription} 
                                    onChange={e => setNewLog({ ...newLog, issueDescription: e.target.value })} 
                                    placeholder="Enter breakdown details..." 
                                    required 
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowAdd(false)} style={btnSecondaryStyle}>Cancel</button>
                                <button type="submit" style={btnPrimaryStyle}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {resolvingId && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Resolve Breakdown</h3>
                        <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Actions Taken / Notes</label>
                                <input 
                                    style={inputStyle}
                                    value={resolutionData.resolutionNotes} 
                                    onChange={e => setResolutionData({ ...resolutionData, resolutionNotes: e.target.value })} 
                                    placeholder="Replaced parts, repair details, etc." 
                                    required 
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Repair Cost ($)</label>
                                <input 
                                    style={inputStyle}
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    value={resolutionData.repairCost} 
                                    onChange={e => setResolutionData({ ...resolutionData, repairCost: e.target.value })} 
                                    placeholder="0.00" 
                                    required 
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                                <button type="button" onClick={() => setResolvingId(null)} style={btnSecondaryStyle}>Cancel</button>
                                <button type="submit" style={{...btnPrimaryStyle, background: 'var(--green)'}}>Mark as Resolved</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalContentStyle = {
    background: 'var(--surface)', padding: 24, borderRadius: 'var(--radius-lg)',
    width: '100%', maxWidth: 400, border: '1px solid var(--border)',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};
const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: 'var(--text-secondary)', marginBottom: 6
};
const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box'
};
const btnPrimaryStyle = {
    background: 'var(--accent)', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: 'var(--radius-md)',
    fontSize: 13, fontWeight: 700, cursor: 'pointer'
};
const btnSecondaryStyle = {
    background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)',
    padding: '8px 16px', borderRadius: 'var(--radius-md)',
    fontSize: 13, fontWeight: 700, cursor: 'pointer'
};