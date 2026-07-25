import React from 'react';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Plus, Eye, Shield, Settings, Sliders, ShoppingBag, Music, ArrowDownLeft } from 'lucide-react';
import { mockCard, mockTransactions } from '../data/mockData';

const cardTxns = mockTransactions.filter(t => t.type === 'debit').slice(0, 4);
const catIcons = {
  shopping: { icon: ShoppingBag, color: 'bg-danger/10 text-danger' },
  food:     { icon: Music,       color: 'bg-pink-100 text-pink-500' },
  transfer: { icon: ArrowDownLeft, color: 'bg-success/10 text-success' },
};

export default function Cards() {
  return (
    <PageShell pageSubtitle="Manage your debit and credit cards">
      <div className="max-w-[900px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">My Cards</h2>
          <Button variant="primary" icon={Plus} size="sm">New Card</Button>
        </div>

        {/* Credit Card Visual */}
        <div className="mb-6">
          <div
            className="rounded-2xl p-7 text-white relative overflow-hidden shadow-card-hover max-w-sm"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #885CF6 100%)', aspectRatio:'1.586/1' }}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white opacity-10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white opacity-5 pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-xs">Balance</p>
                  <p className="text-xl font-bold">₹{mockCard.balance.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-white font-black text-xl tracking-tight italic">{mockCard.network}</div>
              </div>

              {/* Chip */}
              <div className="w-10 h-8 rounded bg-yellow-300/80 flex items-center justify-center">
                <div className="w-7 h-5 rounded-sm border-2 border-yellow-500/60 grid grid-cols-2 gap-px p-0.5">
                  <div className="bg-yellow-500/40 rounded-sm"/>
                  <div className="bg-yellow-500/40 rounded-sm"/>
                  <div className="bg-yellow-500/40 rounded-sm"/>
                  <div className="bg-yellow-500/40 rounded-sm"/>
                </div>
              </div>

              {/* Bottom row */}
              <div>
                <p className="text-white/70 text-base font-mono tracking-widest mb-2">**** **** **** {mockCard.number}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Card Holder</p>
                    <p className="text-sm font-bold tracking-wider">{mockCard.holder}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Expires</p>
                    <p className="text-sm font-bold">{mockCard.expiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="flex gap-3 mb-6">
          {[
            { label: 'View PIN', icon: Eye },
            { label: 'Block Card', icon: Shield },
            { label: 'Limits', icon: Sliders },
            { label: 'Settings', icon: Settings },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex-1 flex flex-col items-center gap-2 py-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-150 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium text-text-muted">{label}</span>
            </button>
          ))}
        </div>

        {/* Recent card transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {cardTxns.map(txn => {
              const cat = catIcons[txn.category] || { icon: ShoppingBag, color: 'bg-primary/10 text-primary' };
              const Icon = cat.icon;
              return (
                <div key={txn.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{txn.description}</p>
                    <p className="text-xs text-text-muted">{txn.date}</p>
                  </div>
                  <span className="text-sm font-bold text-danger">
                    -₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
