import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, Table, Badge } from '../UI';

export default function AdminDashboard() {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [tab, setTab] = useState('trips');

    useEffect(() => {
        api.get('/trip').then(r => setTrips(r.data)).catch(() => {});
        api.get('/vehicle/available').then(r => setVehicles(r.data)).catch(() => {});
        api.get('/maintenance').then(r => setMaintenance(r.data)).catch(() => {});
        api.get('/invoice').then(r => setInvoices(r.data)).catch(() => {});
    }, []);

    return (
        <div style={p}>
            <Header title="Admin Paneli" sub="Tüm sistem verileri" />
            <div style={row}>
                <StatCard label="Toplam Sefer" value={trips.length} color="#3b82f6" />
                <StatCard label="Müsait Araç" value={vehicles.length} color="#10b981" />
                <StatCard label="Açık Bakım" value={maintenance.filter(m => !m.isResolved).length} color="#f59e0b" />
                <StatCard label="Ödenmemiş Fatura" value={invoices.filter(i => !i.isPaid).length} color="#ef4444" />
            </div>

            <Tabs tabs={['trips','vehicles','maintenance','invoices']} labels={['Seferler','Araçlar','Bakım','Faturalar']} active={tab} onChange={setTab} />

            {tab === 'trips' && (
                <Table headers={['Kod','Güzergah','Sürücü','Araç','Durum']} rows={trips.map(t => [
                    <span style={{color:'#f59e0b',fontWeight:700}}>{t.tripCode}</span>,
                    `${t.origin} → ${t.destination}`,
                    t.driverName, t.vehiclePlate,
                    <Badge status={t.status} />
                ])} />
            )}
            {tab === 'vehicles' && (
                <Table headers={['Plaka','Marka','Model','Kapasite','Durum']} rows={vehicles.map(v => [
                    <span style={{color:'#f59e0b',fontWeight:700}}>{v.plateNumber}</span>,
                    v.brand, v.model, `${v.maxLoadCapacityTons}t`,
                    <Badge status={v.status} />
                ])} />
            )}
            {tab === 'maintenance' && (
                <Table headers={['Sorun','Araç','Teknisyen','Durum']} rows={maintenance.map(m => [
                    m.issueDescription, `Araç #${m.vehicleId}`, `Teknisyen #${m.technicianId}`,
                    <Badge status={m.isResolved ? 'Resolved' : 'Open'} />
                ])} />
            )}
            {tab === 'invoices' && (
                <Table headers={['Fatura No','Sefer','Toplam','Durum']} rows={invoices.map(i => [
                    <span style={{color:'#f59e0b',fontWeight:700}}>{i.invoiceNumber}</span>,
                    `Sefer #${i.tripId}`,
                    `₺${i.totalAmount?.toLocaleString()}`,
                    <Badge status={i.isPaid ? 'Paid' : 'Unpaid'} />
                ])} />
            )}
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