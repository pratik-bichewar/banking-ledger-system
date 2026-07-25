import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import AccountsCard from '../components/dashboard/AccountsCard';
import SpendingInsightsCard from '../components/dashboard/SpendingInsightsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SecurityPromoCard from '../components/dashboard/SecurityPromoCard';
import { AuthContext } from '../context/AuthContext';
import { Plus, Coins, ShieldAlert, Check } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deposit Faucet modal state
  const [depositAccountId, setDepositAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('10000');
  const [depositing, setDepositing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError('');
      // 1. Fetch user accounts
      const accRes = await axios.get('/api/account');
      const rawAccounts = accRes.data.accounts || [];

      // 2. Fetch balances for each account
      const accountsWithBalances = await Promise.all(
        rawAccounts.map(async (acc) => {
          try {
            const balRes = await axios.get(`/api/account/balance/${acc._id}`);
            return { ...acc, balance: balRes.data.balance, number: `AC ${acc._id}` };
          } catch (e) {
            return { ...acc, balance: 0, number: `AC ${acc._id}` };
          }
        })
      );
      setAccounts(accountsWithBalances);

      // 3. Fetch transaction ledgers for accounts
      let allLedgers = [];
      await Promise.all(
        accountsWithBalances.map(async (acc) => {
          try {
            const legRes = await axios.get(`/api/account/ledger/${acc._id}`);
            const logs = legRes.data.ledger || [];
            logs.forEach(item => {
              allLedgers.push({
                id: item._id,
                description: item.type === 'credit'
                  ? (item.transaction?.fromAccount === acc._id ? 'Deposit Faucet' : 'Money Received')
                  : 'Online Transfer',
                counterparty: item.type === 'credit' ? 'Credo Bank System' : `To AC ${item.transaction?.toAccount?.slice(-6) || ''}`,
                amount: item.type === 'credit' ? item.amount : -item.amount,
                type: item.type,
                category: item.type === 'credit' ? 'salary' : 'transfer',
                account: acc.name || 'Savings Account',
                date: item.transaction?.createdAt
                  ? new Date(item.transaction.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent'
              });
            });
          } catch (e) {}
        })
      );

      // Sort newest first
      allLedgers.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTxns(allLedgers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load live backend data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateAccount = async () => {
    try {
      await axios.post('/api/account');
      await fetchDashboardData();
    } catch (err) {
      setError('Could not create new account.');
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
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed.');
    } finally {
      setDepositing(false);
    }
  };

  const totalNetWorth = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3 text-sm">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px]">
        {/* Left column ~66% */}
        <div className="flex-[2] min-w-0 space-y-5">
          <NetWorthCard balance={totalNetWorth} />
          
          <AccountsCard
            accounts={accounts.length ? accounts : []}
            onCreateAccount={handleCreateAccount}
            onDeposit={(accId) => setDepositAccountId(accId)}
          />

          <SpendingInsightsCard />
        </div>

        {/* Right column ~34% */}
        <div className="flex-[1] min-w-0 space-y-5 min-w-[300px]">
          <QuickActions />
          <RecentTransactions txns={recentTxns} />
          <SecurityPromoCard />
        </div>
      </div>

      {/* Mock Deposit Faucet Modal */}
      {depositAccountId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-card-hover border border-slate-100">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Deposit Test Money Faucet</h3>
            <p className="text-text-muted text-xs mb-5">Select an amount to credit this MongoDB account instantly for testing.</p>

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
