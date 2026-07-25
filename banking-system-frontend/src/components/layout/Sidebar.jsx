import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, List, Layers,
  Users, BarChart2, HelpCircle, Crown, Star, ChevronRight
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import logoMark from '../../assets/logo-mark.svg';

const navItems = [
  { path: '/',             icon: LayoutDashboard,  label: 'Dashboard' },
  { path: '/accounts',     icon: CreditCard,        label: 'Accounts' },
  { path: '/transfer',     icon: ArrowLeftRight,    label: 'Transfer' },
  { path: '/transactions', icon: List,              label: 'Transactions' },
  { path: '/cards',        icon: Layers,            label: 'Cards' },
  { path: '/beneficiaries',icon: Users,             label: 'Beneficiaries' },
  { path: '/analytics',    icon: BarChart2,         label: 'Analytics' },
  { path: '/support',      icon: HelpCircle,        label: 'Support' },
];

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-dark-sidebar flex flex-col z-50 overflow-y-auto no-scrollbar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <img src={logoMark} alt="Credo" className="w-9 h-9" />
        <div>
          <span className="text-white font-bold text-lg tracking-widest block leading-none">CREDO</span>
          <span className="text-slate-400 text-[10px] tracking-widest uppercase">Bank</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 group
               ${isActive
                 ? 'bg-primary-gradient text-white shadow-btn'
                 : 'text-slate-400 hover:text-white hover:bg-white/5'
               }`
            }
          >
            <Icon size={20} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Promo */}
      <div className="mx-3 mb-3 rounded-2xl p-4 relative overflow-hidden" style={{background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(136,92,246,0.2))', border:'1px solid rgba(99,102,241,0.3)'}}>
        <Crown size={20} className="text-warning mb-2" strokeWidth={1.75} />
        <p className="text-white font-bold text-sm">Upgrade to</p>
        <p className="text-warning font-bold text-sm mb-1">Credo Premium</p>
        <p className="text-slate-400 text-xs mb-3">Unlock exclusive benefits and higher limits.</p>
        <button className="w-full bg-primary-gradient text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90">
          Upgrade Now <ChevronRight size={14} />
        </button>
      </div>

      {/* User mini profile */}
      <div className="mx-3 mb-4 rounded-xl p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors">
        <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{user?.name || 'User'}</p>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-warning fill-warning" />
            <span className="text-slate-400 text-xs">Premium Member</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-500" />
      </div>
    </aside>
  );
}
