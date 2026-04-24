import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Badge } from '../UI';

export default function FinanceDashboard() {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = () => api.get('/invoice').then(r => setInvoices(r.data)).catch(() => {});

    useEffect(() => { fetchInvoices(); }, []);

    const markPaid = async (id) => {
        try {
            await api.patch(`/invoice/${id}/mark-paid`);
            fetchInvoices();
        } catch { alert('İşlem başarısız.'); }
    };

    const total = invoices.reduce((a, b) => a + (b.totalAmount || 0), 0);
    const paid = invoices.filter(i => i.isPaid).reduce((a, b) => a + (b.totalAmount || 0), 0);
    const unpaid = total - paid;

    return (
        <div style={p}>
            <Header title="Finans Paneli" sub="Fatura ve ödeme yönetimi" />

            <div style={{ display: 'flex', gap: 16, padding: '0 28px 20px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Toplam Ciro', value: `₺${total.toLocaleString()}`, color: '#3b82f6' },
                    { label: 'Tahsil Edilen', value: `₺${paid.toLocaleString()}`, color: '#10b981' },
                    { label: 'Bekleyen', value: `₺${unpaid.toLocaleString()}`, color: '#ef4444' },
                    { label: 'Fatura Sayısı', value: invoices.length, color: '#8b5cf6' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#111827', border: `1px solid #1e2d40`, borderLeft: `3px solid ${s.color}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
                        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: s.label === 'Fatura Sayısı' ? 28 : 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ margin: '0 28px', background: '#111827', border: '1px solid #1e2d40', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2d40', fontSize: 13, fontWeight: 700 }}>Faturalar</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#0d1526' }}>
                        {['Fatura No','Sefer','Yakıt','Harcırah','Servis','Toplam','Durum','İşlem'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map((inv, i) => (
                        <tr key={inv.id} style={{ borderTop: '1px solid #1e2d40', background: i % 2 === 0 ? 'transparent' : '#0d1526' }}>
                            <td style={{ padding: '12px 14px', fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>{inv.invoiceNumber}</td>
                            <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b' }}>#{inv.tripId}</td>
                            <td style={{ padding: '12px 14px', fontSize: 11 }}>₺{inv.fuelCost?.toLocaleString()}</td>
                            <td style={{ padding: '12px 14px', fontSize: 11 }}>₺{inv.driverAllowance?.toLocaleString()}</td>
                            <td style={{ padding: '12px 14px', fontSize: 11 }}>₺{inv.serviceFee?.toLocaleString()}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>₺{inv.totalAmount?.toLocaleString()}</td>
                            <td style={{ padding: '12px 14px' }}><Badge status={inv.isPaid ? 'Paid' : 'Unpaid'} /></td>
                            <td style={{ padding: '12px 14px' }}>
                                {!inv.isPaid && (
                                    <button onClick={() => markPaid(inv.id)} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '3px 10px', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>
                                        Ödendi ✓
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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