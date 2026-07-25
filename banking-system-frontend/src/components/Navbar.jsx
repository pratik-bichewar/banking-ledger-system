import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Wallet, Home, ArrowLeftRight, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '20px',
      margin: '0 auto 30px auto',
      width: 'calc(100% - 48px)',
      maxWidth: '1200px',
      zIndex: 100,
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      border: '1px solid var(--color-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--accent-gradient)',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px hsla(180, 100%, 50%, 0.3)'
        }}>
          <Wallet size={20} color="#fff" />
        </div>
        <span className="gradient-text" style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.03em'
        }}>AURA BANK</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: location.pathname === '/' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          fontWeight: location.pathname === '/' ? '600' : '400',
        }}>
          <Home size={18} />
          <span style={{ fontSize: '0.9rem' }}>Dashboard</span>
        </Link>

        <Link to="/transfer" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: location.pathname === '/transfer' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          fontWeight: location.pathname === '/transfer' ? '600' : '400',
        }}>
          <ArrowLeftRight size={18} />
          <span style={{ fontSize: '0.9rem' }}>Transfer</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'hsla(224, 71%, 16%, 0.4)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--color-border)'
        }}>
          <User size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {user.name}
          </span>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout} style={{
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem'
        }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
