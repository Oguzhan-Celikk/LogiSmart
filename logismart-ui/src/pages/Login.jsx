import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(
                { fullName: res.data.fullName, role: res.data.role, userId: res.data.userId },
                res.data.token
            );
            navigate('/dashboard');
        } catch {
            setError('E-posta veya şifre hatalı.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>L</div>
                <h2 style={styles.title}>LogiSmart</h2>
                <p style={styles.subtitle}>Fleet ERP — Giriş Yap</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>E-posta</label>
                        <input
                            style={styles.input}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="ornek@logismart.com"
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Şifre</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit">Giriş Yap</button>
                </form>

                <div style={styles.hints}>
                    <p style={styles.hintTitle}>Test Hesapları (şifre: password123)</p>
                    <p style={styles.hint}>👤 ahmet.kaya@logismart.com — Admin</p>
                    <p style={styles.hint}>📋 elif.sahin@logismart.com — Ops Manager</p>
                    <p style={styles.hint}>🚛 murat.yilmaz@logismart.com — Driver</p>
                    <p style={styles.hint}>💳 zeynep.koc@logismart.com — Finance</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card: { background: '#111827', border: '1px solid #1e2d40', borderRadius: 16, padding: '40px', width: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
    logo: { width: 48, height: 48, background: '#f59e0b', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#000', marginBottom: 16 },
    title: { color: '#e2e8f0', fontSize: 24, fontWeight: 800, margin: '0 0 4px' },
    subtitle: { color: '#64748b', fontSize: 13, margin: '0 0 28px' },
    error: { background: '#3f0f0f', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
    field: { marginBottom: 16 },
    label: { display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', background: '#1e2d40', border: '1px solid #1e2d40', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', background: '#f59e0b', border: 'none', borderRadius: 8, padding: '12px', color: '#000', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
    hints: { marginTop: 24, padding: 16, background: '#0d1526', borderRadius: 8, border: '1px solid #1e2d40' },
    hintTitle: { color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' },
    hint: { color: '#94a3b8', fontSize: 12, margin: '4px 0' },
};