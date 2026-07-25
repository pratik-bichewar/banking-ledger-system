import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { MoreVertical, Plus, TrendingUp, Coins, Copy, Check, ShieldAlert } from 'lucide-react';

function LiveAccountCard({ account, onDeposit }) {
  const [copied, setCopied] = useState(false);
  const colors = {
    ACTIVE: 'from-primary to-secondary',
    FROZEN: 'from-blue-500 to-cyan-400',
    CLOSED: 'from-gray-600 to-gray-800',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(account._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${colors[account.status] || colors.ACTIVE} text-white p-6 relative overflow-hidden shadow-card-hover`}>
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white opacity-10 pointer-events-none" />
      <div className="absolute top-12 -right-2 w-20 h-20 rounded-full bg-white opacity-5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">Account ({account.currency || 'INR'})</span>
              <Badge variant="active" className="text-[10px]">{account.status}</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-mono">
              <span>AC ID: {account._id}</span>
              <button onClick={handleCopy} className="hover:text-white transition-colors" title="Copy Account ID">
                {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
          <button
            onClick={() => onDeposit(account._id)}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Deposit Test Money"
          >
            <Coins size={14} />
            <span>Deposit</span>
          </button>
        </div>

        <div className="mt-6">
          <p className="text-white/60 text-xs mb-1">Available Balance</p>
          <p className="text-3xl font-bold">₹{(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deposit Faucet modal state
  const [depositAccountId, setDepositAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('10000');
  const [depositing, setDepositing] = useState(false);

  const fetchAccountsData = async () => {
    try {
      setError('');
      const res = await axios.get('/api/account');
      const rawAccounts = res.data.accounts || [];

      const accountsWithBalances = await Promise.all(
        rawAccounts.map(async (acc) => {
          try {
            const balRes = await axios.get(`/api/account/balance/${acc._id}`);
            return { ...acc, balance: balRes.data.balance };
          } catch (e) {
            return { ...acc, balance: 0 };
          }
        })
      );
      setAccounts(accountsWithBalances);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsData();
  }, []);

  const handleCreateAccount = async () => {
    try {
      await axios.post('/api/account');
      await fetchAccountsData();
    } catch (err) {
      setError('Could not open new account.');
    }
  };

  const handleDepositTestFunds = async (e) => {
    e.preventDefault();
    if (!depositAccountId) return;
    setDepositing(true);
    try {
      await axios.post('/api/account/deposit', {
        accountId: depositAccountId,
        amount: Number(depositAmount)
      });
      setDepositAccountId('');
      await fetchAccountsData();
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed.');
    } finally {
      setDepositing(false);
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  if (loading) {
    return (
      <PageShell pageSubtitle="Manage your banking accounts">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell pageSubtitle="Manage your banking accounts">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3 text-sm">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary bar */}
      <Card className="p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm mb-1">Total Balance</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-800">
              ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} /> Live
            </span>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreateAccount}>
          Open New Account
        </Button>
      </Card>

      {/* Account grid */}
      {accounts.length === 0 ? (
        <Card className="p-12 text-center text-text-muted">
          <p className="text-base font-semibold mb-2">No accounts found</p>
          <p className="text-xs mb-4">Click "Open New Account" to create your first bank account on MongoDB.</p>
          <Button variant="primary" icon={Plus} onClick={handleCreateAccount} className="mx-auto">
            Open Account Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {accounts.map(acc => (
            <LiveAccountCard key={acc._id} account={acc} onDeposit={(id) => setDepositAccountId(id)} />
          ))}
        </div>
      )}

      {/* Deposit Faucet Modal */}
      {depositAccountId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-card-hover border border-slate-100">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Deposit Test Money Faucet</h3>
            <p className="text-text-muted text-xs mb-5">Credit test funds directly into this MongoDB account.</p>

            <form onSubmit={handleDepositTestFunds} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Amount (INR)</label>
                <select
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                >
                  <option value="5000">₹5,000.00</option>
                  <option value="10000">₹10,000.00</option>
                  <option value="50000">₹50,000.00</option>
                  <option value="100000">₹100,000.00</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositAccountId('')}
                  className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={depositing}
                  className="flex-1 py-2.5 text-sm font-semibold bg-primary-gradient text-white rounded-xl shadow-btn hover:opacity-90 disabled:opacity-50"
                >
                  {depositing ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
