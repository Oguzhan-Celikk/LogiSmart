import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── StatCard ─────────────────────────────────────────────── */
export function StatCard({ label, value, color, icon }) {
    const ref = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof value !== 'number') return;
        const duration = 800;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * value);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [value]);

    return (
        <div
            className="stat-card animate-fade-in-up"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '20px 22px',
                flex: 1, minWidth: 130,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15), 0 0 0 1px ${color}33`;
                e.currentTarget.style.borderColor = `${color}55`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border)';
            }}
        >
            {/* Gradient top strip */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}55)`,
            }} />

            {/* Subtle background glow */}
            <div style={{
                position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                    fontSize: 10, fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    fontFamily: 'var(--font-mono)',
                }}>
                    {label}
                </div>
                {icon && (
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: `${color}1A`, /* %10 opacity */
                        color: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                    }}>
                        {icon}
                    </div>
                )}
            </div>

            <div ref={ref} style={{
                fontSize: 32, fontWeight: 800,
                color: isDark ? color : 'var(--text-primary)',
                letterSpacing: '-1px', lineHeight: 1,
                fontFamily: 'var(--font-sans)',
            }}>
                {value}
            </div>
        </div>
    );
}

/* ── Badge ─────────────────────────────────────────────────── */
// Dark mode — saydam pastel, açık renkli metin
const DARK_BADGE = {
    Planned:          { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', dot: false },
    InTransit:        { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', dot: true  },
    Delivered:        { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', dot: false },
    Cancelled:        { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', dot: false },
    UnderMaintenance: { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', dot: true  },
    Available:        { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', dot: false },
    OnTrip:           { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', dot: true  },
    Resolved:         { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', dot: false },
    Open:             { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', dot: true  },
    Paid:             { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', dot: false },
    Unpaid:           { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', dot: false },
};

// Light mode — pastel zemin, koyu okunabilir metin (WCAG AA)
const LIGHT_BADGE = {
    Planned:          { bg: '#EDE9FE', color: '#5B21B6', dot: false },
    InTransit:        { bg: '#DBEAFE', color: '#1E40AF', dot: true  },
    Delivered:        { bg: '#D1FAE5', color: '#065F46', dot: false },
    Cancelled:        { bg: '#FEE2E2', color: '#991B1B', dot: false },
    UnderMaintenance: { bg: '#FEF3C7', color: '#92400E', dot: true  },
    Available:        { bg: '#D1FAE5', color: '#065F46', dot: false },
    OnTrip:           { bg: '#DBEAFE', color: '#1E40AF', dot: true  },
    Resolved:         { bg: '#D1FAE5', color: '#065F46', dot: false },
    Open:             { bg: '#FEE2E2', color: '#991B1B', dot: true  },
    Paid:             { bg: '#D1FAE5', color: '#065F46', dot: false },
    Unpaid:           { bg: '#F3F4F6', color: '#374151', dot: false },
};

export function Badge({ status }) {
    const { isDark } = useTheme();
    const map = isDark ? DARK_BADGE : LIGHT_BADGE;
    const cfg = map[status] || (isDark
        ? { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', dot: false }
        : { bg: '#F3F4F6',                color: '#374151', dot: false });

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: cfg.bg,
            color: cfg.color,
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 11, fontWeight: 700,
            border: `1px solid ${cfg.color}28`,
            fontFamily: 'var(--font-mono)',
            letterSpacing: 0.3,
            whiteSpace: 'nowrap',
        }}>
            {cfg.dot && (
                <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: cfg.color,
                    display: 'inline-block',
                    animation: 'pulse-dot 1.5s ease-in-out infinite',
                    boxShadow: `0 0 5px ${cfg.color}88`,
                }} />
            )}
            {status}
        </span>
    );
}

/* ── Table ─────────────────────────────────────────────────── */
export function Table({ headers, rows }) {
    return (
        <div style={{
            margin: '0 28px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    {/* Header: var(--surface-2) — her iki modda da arka plana uyumlu */}
                    <tr style={{ background: 'var(--surface-2)' }}>
                        {headers.map(h => (
                            <th key={h} style={{
                                padding: '11px 16px',
                                textAlign: 'left',
                                fontSize: 11,
                                color: 'var(--text-secondary)',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 0.8,
                                fontFamily: 'var(--font-mono)',
                                borderBottom: '1px solid var(--border)',
                                whiteSpace: 'nowrap',
                            }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} style={{
                                padding: '48px', textAlign: 'center',
                                color: 'var(--text-muted)', fontSize: 13,
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                                No data to display.
                            </td>
                        </tr>
                    ) : rows.map((row, i) => (
                        <TableRow key={i} cells={row} isEven={i % 2 === 0} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableRow({ cells, isEven }) {
    const base = isEven ? 'var(--surface)' : 'var(--surface-2)';
    return (
        <tr
            style={{
                borderTop: '1px solid var(--border)',
                background: base,
                transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = base; }}
        >
            {cells.map((cell, j) => (
                <td key={j} style={{
                    padding: '11px 16px',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                }}>
                    {cell}
                </td>
            ))}
        </tr>
    );
}

/* ── PageHeader ───────────────────────────────────────────── */
export function PageHeader({ title, sub, breadcrumb, action }) {
    return (
        <div style={{
            padding: '20px 28px 18px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 24,
            background: 'var(--surface)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
            <div>
                {breadcrumb && (
                    <div style={{
                        fontSize: 11, color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 4, letterSpacing: 0.5,
                    }}>
                        LogiSmart › {breadcrumb}
                    </div>
                )}
                <h2 style={{
                    fontSize: 20, fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.3px',
                }}>
                    {title}
                </h2>
                {sub && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                        {sub}
                    </div>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

/* ── Tabs ─────────────────────────────────────────────────── */
export function Tabs({ tabs, labels, active, onChange }) {
    return (
        <div style={{
            display: 'flex', gap: 0,
            padding: '0 28px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: 20,
        }}>
            {tabs.map((tab, i) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    style={{
                        padding: '10px 18px',
                        border: 'none',
                        borderBottom: active === tab
                            ? '2px solid var(--accent)'
                            : '2px solid transparent',
                        background: 'transparent',
                        color: active === tab ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 13,
                        fontWeight: active === tab ? 700 : 400,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'color 0.2s ease, border-color 0.2s ease',
                        marginBottom: -1,
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (active !== tab) e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { if (active !== tab) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    {labels[i]}
                </button>
            ))}
        </div>
    );
}

/* ── StatRow ──────────────────────────────────────────────── */
export function StatRow({ children }) {
    return (
        <div style={{
            display: 'flex', gap: 16,
            padding: '0 28px 24px',
            flexWrap: 'wrap',
        }}>
            {children}
        </div>
    );
}