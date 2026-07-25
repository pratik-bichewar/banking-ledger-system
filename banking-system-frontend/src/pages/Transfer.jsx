import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AuthContext } from '../context/AuthContext';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const generateKey = () => `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const DAILY_LIMIT = 200000; // ₹2,00,000.00

export default function Transfer() {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFrom] = useState('');
  const [toAccount, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [idempKey, setIdempKey] = useState(generateKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [tab, setTab] = useState('account');

  // Dynamic Transfer Limits state
  const [usedToday, setUsedToday] = useState(0);

  const fetchActiveAccountsAndLimits = async () => {
    try {
      const res = await axios.get('/api/account');
      const list = res.data.accounts || [];

      const accountsWithBalances = await Promise.all(
        list.map(async (acc) => {
          try {
            const balRes = await axios.get(`/api/account/balance/${acc._id}`);
            return { ...acc, balance: balRes.data.balance };
          } catch (e) {
            return { ...acc, balance: 0 };
          }
        })
      );

      const activeList = accountsWithBalances.filter(a => a.status === 'ACTIVE');
      setAccounts(activeList);
      if (activeList.length > 0 && !fromAccount) {
        setFrom(activeList[0]._id);
      }

      // Calculate total debit transfers made today across accounts
      let totalDebitedToday = 0;
      const todayStr = new Date().toISOString().split('T')[0];

      await Promise.all(
        activeList.map(async (acc) => {
          try {
            const legRes = await axios.get(`/api/account/ledger/${acc._id}`);
            const logs = legRes.data.ledger || [];
            logs.forEach(item => {
              if (item.type === 'debit') {
                const itemDate = item.transaction?.createdAt
                  ? new Date(item.transaction.createdAt).toISOString().split('T')[0]
                  : todayStr;
                if (itemDate === todayStr) {
                  totalDebitedToday += Number(item.amount || 0);
                }
              }
            });
          } catch (e) {}
        })
      );

      setUsedToday(totalDebitedToday);
    } catch (err) {}
  };

  useEffect(() => {
    fetchActiveAccountsAndLimits();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setReceipt(null);

    if (!fromAccount || !toAccount || !amount) {
      setError('Please fill in all transaction fields.');
      return;
    }

    if (fromAccount === toAccount) {
      setError('Source account and destination account cannot be the same.');
      return;
    }

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid transfer amount greater than 0.');
      return;
    }

    const availableLimit = Math.max(0, DAILY_LIMIT - usedToday);
    if (amt > availableLimit) {
      setError(`Transfer exceeds your remaining daily limit of ₹${availableLimit.toLocaleString('en-IN')}`);
      return;
    }

    const selectedAcc = accounts.find(a => a._id === fromAccount);
    if (selectedAcc && selectedAcc.balance < amt) {
      setError(`Insufficient balance. Current balance is ₹${selectedAcc.balance.toLocaleString('en-IN')}`);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/transactions', {
        fromAccount,
        toAccount,
        amount: amt,
        idempotencyKey: idempKey
      });

      setReceipt({
        from: fromAccount,
        to: toAccount,
        amount: amt,
        txnId: res.data.transaction?._id || 'TXN_COMPLETED',
        date: new Date().toLocaleString()
      });

      // Update used daily limit dynamically
      setUsedToday(prev => prev + amt);

      setTo('');
      setAmount('');
      setNote('');
      setIdempKey(generateKey());

      // Refresh balances & limits
      await fetchActiveAccountsAndLimits();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Transfer failed. Please check account IDs.');
    } finally {
      setLoading(false);
    }
  };

  const selectedSourceAccount = accounts.find(a => a._id === fromAccount);
  const currentSourceBalance = selectedSourceAccount ? selectedSourceAccount.balance : 0;
  const availableLimit = Math.max(0, DAILY_LIMIT - usedToday);
  const usedPercent = Math.min(100, Math.max(0, (usedToday / DAILY_LIMIT) * 100));

  return (
    <PageShell pageSubtitle="Move money securely and instantly">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1100px]">
        {/* Left: Transfer form */}
        <div className="flex-[3]">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Transfer Money</h2>

            {receipt ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Transfer Successful!</h3>
                <p className="text-text-muted text-sm mb-2">₹{receipt.amount.toLocaleString('en-IN')} sent successfully.</p>
                <p className="text-xs text-text-muted font-mono mb-6">Txn ID: {receipt.txnId}</p>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-xs space-y-2 mb-6 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-text-muted">From:</span>
                    <span className="font-mono">{receipt.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">To:</span>
                    <span className="font-mono">{receipt.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Time:</span>
                    <span>{receipt.date}</span>
                  </div>
                </div>

                <Button variant="primary" onClick={() => setReceipt(null)} className="mx-auto">
                  Make Another Transfer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-5">
                {/* Tabs */}
                <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                  {['account', 'upi', 'bank'].map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-colors capitalize cursor-pointer
                        ${tab === t ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-gray-50'}`}
                    >
                      {t === 'account' ? 'To Account' : t === 'upi' ? 'UPI ID' : 'Bank'}
                    </button>
                  ))}
                </div>

                {/* From Account */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">From Account</label>
                    <span className="text-xs text-text-muted">
                      Balance: <strong className="text-primary">₹{currentSourceBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </span>
                  </div>
                  {accounts.length ? (
                    <select
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-white font-mono"
                      value={fromAccount}
                      onChange={e => setFrom(e.target.value)}
                    >
                      {accounts.map(a => (
                        <option key={a._id} value={a._id}>
                          AC ID: {a._id} (Balance: ₹{a.balance.toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-text-muted p-4 border border-dashed border-slate-200 rounded-xl text-center">
                      No active MongoDB accounts found. <a href="/accounts" className="text-primary font-semibold hover:underline">Open an Account</a>
                    </div>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Recipient Account ID</label>
                  <input
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono"
                    placeholder="Enter 24-character recipient account ID"
                    value={toAccount}
                    onChange={e => setTo(e.target.value)}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold">₹</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Note (Optional)</label>
                  <input
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="Add a payment note..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                    <AlertCircle size={16} strokeWidth={1.75} />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-3"
                  disabled={loading || !accounts.length}
                  icon={Send}
                >
                  {loading ? 'Processing Transaction...' : 'Proceed to Transfer'}
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right: Info + Dynamic Transfer Limits */}
        <div className="flex-[2] space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Idempotency Protection</h3>
            <p className="text-text-muted text-xs leading-relaxed mb-3">
              Every transfer generates a unique idempotency key to guarantee that accidental double clicks will never charge your account twice.
            </p>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-mono text-gray-600 truncate flex items-center justify-between">
              <span>{idempKey}</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Transfer Limits</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Daily Limit</span>
                <span className="font-semibold text-gray-700">₹{DAILY_LIMIT.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Used Today</span>
                <span className="font-semibold text-danger">₹{usedToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Available Limit</span>
                <span className="font-semibold text-success">₹{availableLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-primary-gradient rounded-full transition-all duration-500 ease-out"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted text-right">
              {usedPercent.toFixed(1)}% used today
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
