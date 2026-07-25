import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { spendingCategories, totalSpent, monthlyTrend } from '../data/mockData';

function StatTile({ label, value, change, up }) {
  return (
    <Card className="p-5">
      <p className="text-text-muted text-xs mb-2 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mb-1.5">
        ₹{Number(value).toLocaleString('en-IN')}
      </p>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {change}
        <span className="font-normal text-text-muted ml-0.5">vs last month</span>
      </span>
    </Card>
  );
}

export default function Analytics() {
  return (
    <PageShell pageSubtitle="Understand your financial patterns">
      <div className="max-w-[1100px] space-y-6">
        {/* Stat tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatTile label="Total Spending" value={12750}  change="4.8% added"  up={false} />
          <StatTile label="Total Income"   value={45000}  change="12.3% up"    up={true}  />
          <StatTile label="Savings"        value={32250}  change="7.6% up"     up={true}  />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Spending by Category donut */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Spending by Category</h3>
              <button className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                This Month <ChevronDown size={13} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={spendingCategories} cx="50%" cy="50%" innerRadius={52} outerRadius={70} paddingAngle={2} dataKey="amount" startAngle={90} endAngle={450}>
                      {spendingCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-lg font-bold text-gray-800">₹{(totalSpent/1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-text-muted">Total</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {spendingCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      <span className="text-xs text-gray-600">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{cat.percent}%</span>
                      <span className="text-xs font-semibold text-gray-800 w-14 text-right">
                        ₹{cat.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Monthly Trend line chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Monthly Trend</h3>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success inline-block rounded-full" /> Income</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-danger inline-block rounded-full" /> Expense</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#647488' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#647488' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                  formatter={v => [`₹${v.toLocaleString('en-IN')}`, '']}
                />
                <Line type="monotone" dataKey="income"  stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
