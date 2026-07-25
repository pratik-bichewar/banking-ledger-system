import React, { useContext, useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Topbar({ pageTitle, pageSubtitle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-light-bg sticky top-0 z-40">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-xs text-text-muted">{pageSubtitle || "Here's an overview of your finances."}</p>
      </div>

      {/* Right: Search + Bell + User */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 w-56 text-gray-700 placeholder:text-text-muted transition-all"
          />
        </div>

        {/* Bell */}
        <button className="relative w-9 h-9 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Bell size={18} strokeWidth={1.75} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            4
          </span>
        </button>

        {/* User Chip */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(v => !v)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">{firstName}</span>
            <ChevronDown size={14} className="text-gray-400" strokeWidth={1.75} />
          </button>

          {/* Dropdown */}
          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden z-50">
              <button
                onClick={() => { setDropOpen(false); navigate('/support'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <User size={16} strokeWidth={1.75} className="text-text-muted" /> Help & Support
              </button>
              <div className="border-t border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
              >
                <LogOut size={16} strokeWidth={1.75} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
