import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card, { CardHeader } from '../ui/Card';
import { ChevronDown } from 'lucide-react';
import { spendingCategories, totalSpent } from '../../data/mockData';

export default function SpendingInsightsCard() {
  return (
    <Card className="p-6">
      <CardHeader
        title="Spending Insights"
        action={
          <button className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            This Month <ChevronDown size={14} strokeWidth={1.75} />
          </button>
        }
      />

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0 w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingCategories}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="amount"
                startAngle={90}
                endAngle={450}
              >
                {spendingCategories.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-bold text-gray-800">₹{(totalSpent / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-text-muted font-medium">Total Spent</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {spendingCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-gray-600">{cat.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-muted">{cat.percent}%</span>
                <span className="text-xs font-semibold text-gray-800 w-14 text-right">
                  ₹{cat.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
