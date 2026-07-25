import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft, Zap, ArrowUpRight, Smartphone,
  DollarSign, ShoppingBag, TrendingUp, Gift
} from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';

const categoryIcons = {
  transfer:  { icon: ArrowDownLeft, color: 'success' },
  bills:     { icon: Zap,           color: 'warning' },
  mobile:    { icon: Smartphone,    color: 'primary' },
  salary:    { icon: DollarSign,    color: 'success' },
  shopping:  { icon: ShoppingBag,   color: 'danger' },
  food:      { icon: Gift,          color: 'pink' },
  interest:  { icon: TrendingUp,    color: 'teal' },
};

const colorMap = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  primary: 'bg-primary/10 text-primary',
  danger:  'bg-danger/10 text-danger',
  pink:    'bg-pink-100 text-pink-500',
  teal:    'bg-teal-100 text-teal-600',
};

export default function RecentTransactions({ txns = [], limit = 4 }) {
  const displayList = txns.slice(0, limit);

  return (
    <Card className="p-6">
      <CardHeader
        title="Recent Transactions"
        action={
          <Link to="/transactions" className="text-primary text-sm font-semibold hover:underline">
            View All
          </Link>
        }
      />

      {displayList.length === 0 ? (
        <div className="py-6 text-center text-text-muted text-xs">
          No recent transactions yet. Make a transfer or deposit test funds to see your activity here!
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map(txn => {
            const cat = categoryIcons[txn.category] || { icon: ArrowUpRight, color: 'primary' };
            const Icon = cat.icon;
            const isCredit = txn.type === 'credit' || txn.amount > 0;

            return (
              <div key={txn.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[cat.color] || colorMap.primary}`}>
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{txn.description}</p>
                  <p className="text-xs text-text-muted truncate">{txn.counterparty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isCredit ? 'text-success' : 'text-danger'}`}>
                    {isCredit ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-text-muted">{txn.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
