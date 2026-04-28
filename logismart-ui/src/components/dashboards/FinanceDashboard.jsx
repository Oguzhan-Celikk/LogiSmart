import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Badge, PageHeader } from '../UI';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceDashboard() {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = () => api.get('/invoice').then(r => setInvoices(r.data)).catch(() => {});
    useEffect(() => { fetchInvoices(); }, []);

    const markPaid = async (id) => {
        try { await api.patch(`/invoice/${id}/mark-paid`); fetchInvoices(); }
        catch { alert('Operation failed.'); }
    };

    const total  = invoices.reduce((a, b) => a + (b.totalAmount || 0), 0);
    const paid   = invoices.filter(i => i.isPaid).reduce((a, b) => a + (b.totalAmount || 0), 0);
    const unpaid = total - paid;

    const { isDark } = useTheme();

    const SummaryCard = ({ label, value, color, icon }) => (
        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px 22px', flex: 1, minWidth: 130,
            position: 'relative', overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            boxShadow: 'var(--shadow-sm)',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15), 0 0 0 1px ${color}33`; e.currentTarget.style.borderColor = `${color}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: 'var(--font-mono)' }}>{label}</div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}1A`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
            </div>
            <div style={{ fontSize: typeof value === 'number' ? 32 : 26, fontWeight: 800, color: isDark ? color : 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
        </div>
    );

    return (
        <div style={{ padding: '0 0 32px', height: '100%', overflowY: 'auto' }}>
            <PageHeader title="Finance Dashboard" sub="Invoice and payment management" breadcrumb="Accounting" />

            <div style={{ display: 'flex', gap: 16, padding: '0 28px 24px', flexWrap: 'wrap' }}>
                <SummaryCard label="Total Revenue"    value={`$${total.toLocaleString('en-US')}`}  color="var(--blue)"   icon="💰" />
                <SummaryCard label="Collected"  value={`$${paid.toLocaleString('en-US')}`}   color="var(--green)"  icon="✅" />
                <SummaryCard label="Pending"       value={`$${unpaid.toLocaleString('en-US')}`} color="var(--red)"    icon="⏳" />
                <SummaryCard label="Total Invoices"  value={invoices.length}                       color="var(--purple)" icon="🧾" />
            </div>

            <div style={{ margin: '0 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700 }}>Invoices</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--surface-2)' }}>
                            {['Invoice No', 'Trip', 'Fuel', 'Allowance', 'Service', 'Total', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, i) => {
                            const baseBg = i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)';
                            return (
                                <tr key={inv.id}
                                    style={{ borderTop: '1px solid var(--border)', background: baseBg, transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                                    onMouseLeave={e => e.currentTarget.style.background = baseBg}
                                >
                                <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{inv.invoiceNumber}</td>
                                <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{inv.tripCode || `#${inv.tripId}`}</td>
                                <td style={{ padding: '12px 14px', fontSize: 12 }}>${inv.fuelCost?.toLocaleString('en-US')}</td>
                                <td style={{ padding: '12px 14px', fontSize: 12 }}>${inv.driverAllowance?.toLocaleString('en-US')}</td>
                                <td style={{ padding: '12px 14px', fontSize: 12 }}>${inv.serviceFee?.toLocaleString('en-US')}</td>
                                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>${inv.totalAmount?.toLocaleString('en-US')}</td>
                                <td style={{ padding: '12px 14px' }}><Badge status={inv.isPaid ? 'Paid' : 'Unpaid'} /></td>
                                <td style={{ padding: '12px 14px' }}>
                                    {!inv.isPaid && (
                                        <button
                                            onClick={() => markPaid(inv.id)}
                                            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: 'var(--green)', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, transition: 'var(--transition)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                                        >Paid ✓</button>
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