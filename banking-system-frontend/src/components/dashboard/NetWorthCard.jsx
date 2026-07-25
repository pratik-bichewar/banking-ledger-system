import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, BarChart2, FileText } from 'lucide-react';
import heroIllustration from '../../assets/hero-bank-illustration.svg';
import Button from '../ui/Button';

export default function NetWorthCard({ balance = 0 }) {
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-primary-gradient text-white p-7 relative overflow-hidden shadow-card-hover">
      {/* Background decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white opacity-5 pointer-events-none" />
      <div className="absolute top-12 -right-4 w-24 h-24 rounded-full bg-white opacity-5 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        {/* Left: balance info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/70 text-sm font-medium">Total Net Worth</span>
            <button
              onClick={() => setHidden(h => !h)}
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              {hidden ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
            </button>
          </div>

          <div className="text-4xl font-bold tracking-tight mb-3">
            {hidden ? '₹•••••••' : `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <TrendingUp size={12} strokeWidth={2} />
              12.5%
            </span>
            <span className="text-white/60 text-xs">vs last month</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              icon={BarChart2}
              size="md"
              className="text-sm cursor-pointer"
              onClick={() => navigate('/transactions')}
            >
              View Analytics
            </Button>
            <Button
              size="md"
              className="bg-white/15 border border-white/30 text-white text-sm hover:bg-white/25 cursor-pointer"
              icon={FileText}
              onClick={() => navigate('/accounts')}
            >
              Account Summary
            </Button>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:block flex-shrink-0 -mt-4 -mr-4">
          <img src={heroIllustration} alt="Bank" className="w-56 h-40 object-contain" />
        </div>
      </div>
    </div>
  );
}
