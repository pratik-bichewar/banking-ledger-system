import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Download, ChevronDown, ArrowDownLeft, ArrowUpRight, Zap, Smartphone, DollarSign, ShoppingBag, Gift, TrendingUp, ShieldAlert } from 'lucide-react';

export default function Transactions() {
  const [filter, setFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactionsData = async () => {
    try {
      setError('');
      // 1. Fetch user accounts
      const accRes = await axios.get('/api/account');
      const userAccounts = accRes.data.accounts || [];
      setAccounts(userAccounts);

      // 2. Fetch ledgers for each account
      let allLedgerLogs = [];
      await Promise.all(
        userAccounts.map(async (acc) => {
          try {
            const legRes = await axios.get(`/api/account/ledger/${acc._id}`);
            const logs = legRes.data.ledger || [];
            logs.forEach(item => {
              allLedgerLogs.push({
                id: item._id,
                accountId: acc._id,
                accountName: acc.name || `AC ${acc._id.slice(-6)}`,
                description: item.type === 'credit'
                  ? (item.transaction?.fromAccount === acc._id ? 'Deposit Faucet' : 'Money Received')
                  : 'Online Transfer',
                counterparty: item.type === 'credit'
                  ? 'Credo System Faucet'
                  : `To AC ${item.transaction?.toAccount?.slice(-6) || ''}`,
                amount: item.amount,
                type: item.type,
                status: item.transaction?.status || 'completed',
                date: item.transaction?.createdAt
                  ? new Date(item.transaction.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent',
                rawDate: item.transaction?.createdAt || new Date().toISOString()
              });
            });
          } catch (e) {}
        })
      );

      // Sort newest first
      allLedgerLogs.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
      setTransactions(allLedgerLogs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transaction records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const displayed = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (selectedAccount !== 'all' && t.accountId !== selectedAccount) return false;
    return true;
  });

  if (loading) {
    return (
      <PageShell pageSubtitle="Full history of your transactions">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell pageSubtitle="Full history of your transactions">
      <div className="max-w-[1000px]">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3 text-sm">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-white border-slate-200 text-gray-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>AC ID: {acc._id.slice(0, 10)}...</option>
            ))}
          </select>

          {['all', 'credit', 'debit'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border capitalize transition-colors
                ${filter === f ? 'bg-primary text-white border-transparent' : 'bg-white border-slate-200 text-text-muted hover:border-primary/30'}`}
            >
              {f === 'all' ? 'All Types' : f === 'credit' ? 'Credits' : 'Debits'}
            </button>
          ))}

          <button
            onClick={fetchTransactionsData}
            className="ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-text-muted hover:border-primary/30 transition-colors"
          >
            <Download size={14} strokeWidth={1.75} /> Refresh
          </button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {displayed.length === 0 ? (
            <div className="p-12 text-center text-text-muted text-sm">
              No transactions recorded yet in MongoDB. Create accounts, deposit test funds, or make a transfer!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Account</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((txn, idx) => {
                    const isCredit = txn.type === 'credit';
                    return (
                      <tr key={txn.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                        <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{txn.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{txn.description}</p>
                              <p className="text-xs text-text-muted">{txn.counterparty}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={isCredit ? 'success' : 'danger'}>
                            {isCredit ? 'Credit' : 'Debit'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{txn.accountName}</td>
                        <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${isCredit ? 'text-success' : 'text-danger'}`}>
                          {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
