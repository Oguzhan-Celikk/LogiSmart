import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 8,
}));

const TEST_ACCOUNTS = [
    { icon: '⬡', label: 'Admin',        email: 'ahmet.kaya@logismart.com' },
    { icon: '📋', label: 'Ops Manager',  email: 'elif.sahin@logismart.com' },
    { icon: '🚛', label: 'Driver',       email: 'murat.yilmaz@logismart.com' },
    { icon: '💳', label: 'Finance',      email: 'zeynep.koc@logismart.com' },
];

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [focused, setFocused]   = useState('');
    const { login } = useAuth();
    const { isDark, toggle } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(
                { fullName: res.data.fullName, role: res.data.role, userId: res.data.userId },
                res.data.token
            );
            navigate('/dashboard');
        } catch {
            setError('E-posta veya şifre hatalı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            {/* Theme toggle — top right */}
            <button
                id="login-theme-toggle"
                onClick={toggle}
                title={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
                style={{
                    position: 'fixed', top: 16, right: 20, zIndex: 100,
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(99,120,180,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 18,
                    transition: 'transform 0.3s ease, border-color 0.2s, background 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(20deg) scale(1.1)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; e.currentTarget.style.borderColor = 'rgba(99,120,180,0.25)'; }}
            >
                {isDark ? '☀️' : '🌙'}
            </button>

            {/* Animated background particles */}
            <div style={s.particleLayer} aria-hidden="true">
                {PARTICLES.map(p => (
                    <div key={p.id} style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: p.id % 3 === 0 ? 'var(--accent)' : p.id % 3 === 1 ? 'var(--accent-2)' : 'var(--blue)',
                        animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
                        opacity: 0.4,
                    }} />
                ))}
                {/* Radial glow blobs */}
                <div style={{ position:'absolute', top:'10%',   left:'15%',  width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'5%', right:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
            </div>

            {/* Login Card */}
            <div style={s.card} className="animate-fade-in-up">
                {/* Logo */}
                <div style={s.logoWrap}>
                    <div style={s.logo}>L</div>
                    <div style={s.logoRing} />
                </div>

                <div style={{ textAlign: 'left', marginBottom: 28 }}>
                    <h1 style={s.title}>LogiSmart</h1>
                    <p style={s.subtitle}>Fleet ERP — Sisteme Giriş Yap</p>
                </div>

                {error && (
                    <div style={s.errorBox} className="animate-fade-in">
                        <span style={{ marginRight: 8 }}>⚠</span>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={s.label}>E-POSTA</label>
                        <input
                            id="login-email"
                            style={{ ...s.input, ...(focused === 'email' ? s.inputFocused : {}) }}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused('')}
                            placeholder="ornek@logismart.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={s.label}>ŞİFRE</label>
                        <input
                            id="login-password"
                            style={{ ...s.input, ...(focused === 'password' ? s.inputFocused : {}) }}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={() => setFocused('password')}
                            onBlur={() => setFocused('')}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        id="login-submit"
                        style={{ ...s.btn, ...(loading ? s.btnLoading : {}) }}
                        type="submit"
                        disabled={loading}
                        onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.filter = 'brightness(1.1)'; e.target.style.boxShadow = '0 8px 24px var(--accent-dim)'; }}}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.filter = 'none'; e.target.style.boxShadow = 'none'; }}
                    >
                        {loading ? (
                            <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                                <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin-slow 0.7s linear infinite' }} />
                                Giriş yapılıyor...
                            </span>
                        ) : 'Giriş Yap →'}
                    </button>
                </form>

                {/* Test accounts */}
                <div style={s.hintsWrap}>
                    <div style={s.hintsTitle}>
                        <span style={{ color: 'var(--text-muted)' }}>───</span>
                        &nbsp; Test Hesapları &nbsp;
                        <span style={{ color: 'var(--text-muted)' }}>───</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {TEST_ACCOUNTS.map(a => (
                            <button
                                key={a.email}
                                type="button"
                                onClick={() => { setEmail(a.email); setPassword('password123'); }}
                                style={s.chip}
                                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; e.target.style.background = 'var(--accent-dim)'; }}
                                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
                            >
                                {a.icon} {a.label}
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign:'center' }}>Şifre: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>password123</span></p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    particleLayer: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
    },
    card: {
        position: 'relative',
        zIndex: 1,
        width: 420,
        background: 'var(--surface)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 36px',
        boxShadow: 'var(--shadow-lg)',
    },
    logoWrap: {
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 24,
    },
    logo: {
        width: 52, height: 52,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 900, color: '#000',
        boxShadow: '0 0 0 0 rgba(245,158,11,0.4)',
        animation: 'glow-pulse 3s ease-in-out infinite',
        position: 'relative', zIndex: 1,
    },
    logoRing: {
        position: 'absolute',
        inset: -6,
        borderRadius: 20,
        border: '1px solid rgba(245,158,11,0.25)',
        pointerEvents: 'none',
    },
    title: {
        fontSize: 26, fontWeight: 800, color: 'var(--text-primary)',
        letterSpacing: '-0.5px', marginBottom: 4,
    },
    subtitle: {
        fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400,
    },
    errorBox: {
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#f87171',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
        marginBottom: 16,
    },
    label: {
        display: 'block',
        fontSize: 11, fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: 1.2,
        marginBottom: 8,
        fontFamily: 'var(--font-mono)',
    },
    input: {
        width: '100%',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '11px 14px',
        color: 'var(--text-primary)',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'var(--transition)',
    },
    inputFocused: {
        borderColor: 'var(--accent)',
        background: 'var(--surface)',
        boxShadow: '0 0 0 3px var(--accent-dim)',
    },
    btn: {
        width: '100%',
        background: 'var(--accent)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: '13px',
        color: '#FFFFFF',
        fontSize: 15, fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
        letterSpacing: '0.3px',
    },
    btnLoading: {
        opacity: 0.7, cursor: 'not-allowed',
    },
    hintsWrap: {
        marginTop: 24,
        padding: '16px',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
    },
    hintsTitle: {
        fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 1.5,
        marginBottom: 12, textAlign: 'center',
    },
    chip: {
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '5px 12px',
        color: 'var(--text-secondary)',
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'var(--transition)',
    },
};