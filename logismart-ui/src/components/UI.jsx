export function StatCard({ label, value, color }) {
    return (
        <div style={{ background: '#111827', border: '1px solid #1e2d40', borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
        </div>
    );
}

export function Badge({ status }) {
    const map = {
        Planned:          { bg: '#1e1b4b', color: '#8b5cf6' },
        InTransit:        { bg: '#1e3a5f', color: '#3b82f6' },
        Delivered:        { bg: '#064e3b', color: '#10b981' },
        Cancelled:        { bg: '#3f0f0f', color: '#ef4444' },
        UnderMaintenance: { bg: '#451a03', color: '#f59e0b' },
        Available:        { bg: '#064e3b', color: '#10b981' },
        OnTrip:           { bg: '#1e3a5f', color: '#3b82f6' },
        Resolved:         { bg: '#064e3b', color: '#10b981' },
        Open:             { bg: '#3f0f0f', color: '#ef4444' },
        Paid:             { bg: '#064e3b', color: '#10b981' },
        Unpaid:           { bg: '#1f1f1f', color: '#6b7280' },
    };
    const s = map[status] || { bg: '#1f2937', color: '#9ca3af' };
    return (
        <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${s.color}33` }}>
      {status}
    </span>
    );
}

export function Table({ headers, rows }) {
    return (
        <div style={{ margin: '0 28px', background: '#111827', border: '1px solid #1e2d40', borderRadius: 12, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#0d1526' }}>
                    {headers.map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #1e2d40', background: i % 2 === 0 ? 'transparent' : '#0d1526' }}>
                        {row.map((cell, j) => (
                            <td key={j} style={{ padding: '12px 16px', fontSize: 12, color: '#e2e8f0' }}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}