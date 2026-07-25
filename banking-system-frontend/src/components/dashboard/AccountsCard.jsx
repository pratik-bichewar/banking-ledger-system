import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Plus, ChevronRight, Coins, Copy, Check } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';

function AccountRow({ account, onDeposit }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account._id || account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl p-4 bg-primary-gradient text-white relative overflow-hidden mb-3 shadow-card">
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white opacity-10 pointer-events-none" />
      <div className="absolute top-8 right-12 w-14 h-14 rounded-full bg-white opacity-5 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{account.name || 'Savings Account'}</span>
            <Badge variant="active" className="text-[10px]">{account.status || 'Active'}</Badge>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 text-xs font-mono">
            <span>ID: {account._id || account.id}</span>
            <button onClick={handleCopy} className="hover:text-white transition-colors" title="Copy Account ID">
              {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="font-bold text-lg">₹{(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-white/60 text-xs">Available Balance</p>
          </div>
          {onDeposit && (
            <button
              onClick={() => onDeposit(account._id || account.id)}
              className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors mt-0.5"
              title="Deposit Test Money Faucet"
            >
              <Coins size={14} />
              <span className="hidden sm:inline">Deposit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountsCard({ accounts = [], onCreateAccount, onDeposit }) {
  return (
    <Card className="p-6">
      <CardHeader
        title="Your Accounts"
        action={
          <Link to="/accounts" className="text-primary text-sm font-semibold hover:underline">
            View All
          </Link>
        }
      />

      {accounts.length === 0 ? (
        <div className="p-6 text-center text-text-muted text-sm border border-dashed border-slate-200 rounded-xl mb-3">
          No active accounts found in MongoDB. Click below to create your first account!
        </div>
      ) : (
        accounts.map(acc => (
          <AccountRow key={acc._id || acc.id} account={acc} onDeposit={onDeposit} />
        ))
      )}

      <button
        onClick={onCreateAccount}
        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 text-primary hover:bg-primary/5 transition-colors group cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus size={16} className="text-primary" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">Open New Account</p>
          <p className="text-xs text-text-muted">Start your banking journey with Credo Bank</p>
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" strokeWidth={1.75} />
      </button>
    </Card>
  );
}
