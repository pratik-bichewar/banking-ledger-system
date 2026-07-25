import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Clock, ShieldAlert, FileSpreadsheet, Coins } from 'lucide-react';

export default function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, credit, debit

  const fetchData = async () => {
    try {
      setError('');
      // Fetch Account balance & meta
      const accRes = await axios.get(`/api/account/balance/${id}`);
      
      // Fetch account details to get currency & status
      const listRes = await axios.get('/api/account');
      const meta = listRes.data.accounts.find(a => a._id === id);

      setAccount({
        _id: id,
        balance: accRes.data.balance,
        status: meta?.status || 'ACTIVE',
        currency: meta?.currency || 'INR',
        createdAt: meta?.createdAt
      });

      // Fetch Ledger list
      const ledgerRes = await axios.get(`/api/account/ledger/${id}`);
      setLedger(ledgerRes.data.ledger || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ledger details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Filter ledger list based on search and type
  const filteredLedger = ledger.filter(entry => {
    // Filter by type
    if (filterType === 'credit' && entry.type !== 'credit') return false;
    if (filterType === 'debit' && entry.type !== 'debit') return false;

    // Search query match (amount, transaction ID, source/dest accounts)
    const query = search.toLowerCase();
    if (!query) return true;

    const amountStr = entry.amount.toString();
    const txnId = entry.transaction?._id?.toLowerCase() || '';
    const fromAcc = entry.transaction?.fromAccount?.toLowerCase() || '';
    const toAcc = entry.transaction?.toAccount?.toLowerCase() || '';
    const idempotency = entry.transaction?.idempotencyKey?.toLowerCase() || '';

    return (
      amountStr.includes(query) ||
      txnId.includes(query) ||
      fromAcc.includes(query) ||
      toAcc.includes(query) ||
      idempotency.includes(query)
    );
  });

  // Calculate statistics (total credited vs total debited in this statement)
  const totalCredited = ledger
    .filter(e => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDebited = ledger
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="glass shimmer" style={{ height: '140px', marginBottom: '30px' }} />
        <div className="glass shimmer" style={{ height: '400px' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Back to dashboard breadcrumb */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        marginBottom: '24px',
        fontSize: '0.9rem',
        fontWeight: 500
      }}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {error && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid hsla(346, 84%, 61%, 0.2)',
          padding: '16px',
          borderRadius: '12px',
          color: 'var(--color-danger)',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem'
        }}>
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info card */}
      {account && (
        <div className="glass" style={{
          padding: '28px 30px',
          marginBottom: '35px',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className={`badge badge-${account.status.toLowerCase()}`}>
                {account.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {account.currency} LEDGER RECORD
              </span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              ACC ID: {account._id}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              Created on: {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Available Balance
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '35px'
      }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ background: 'var(--color-success-bg)', padding: '12px', borderRadius: '10px', color: 'var(--color-success)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Deposited (Inflow)</span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-success)', marginTop: '2px' }}>
              +₹{totalCredited.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ background: 'var(--color-danger-bg)', padding: '12px', borderRadius: '10px', color: 'var(--color-danger)' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Transferred (Outflow)</span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-danger)', marginTop: '2px' }}>
              -₹{totalDebited.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Ledger statement card */}
      <div className="glass" style={{
        padding: '30px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        border: '1px solid var(--color-border)'
      }}>
        
        {/* Filters and search panel */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '20px'
        }}>
          {/* Toggles */}
          <div style={{
            display: 'flex',
            background: 'hsla(224, 71%, 5%, 0.6)',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid var(--color-border)'
          }}>
            {['all', 'credit', 'debit'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  color: filterType === type ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: filterType === type ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {type}s
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} color="var(--text-muted)" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search ledger entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', paddingRight: '12px', height: '40px' }}
            />
          </div>
        </div>

        {/* Ledger Entries List */}
        {filteredLedger.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileSpreadsheet size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.95rem' }}>No matching transaction ledger entries found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLedger.map((entry) => {
              const isCredit = entry.type === 'credit';
              const dateObj = entry.transaction?.createdAt 
                ? new Date(entry.transaction.createdAt) 
                : new Date();

              return (
                <div key={entry._id} className="glass-hover" style={{
                  padding: '18px 24px',
                  background: 'hsla(224, 71%, 8%, 0.4)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}>
                  {/* Left Side: Type Icon & Transfer Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      background: isCredit ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                      color: isCredit ? 'var(--color-success)' : 'var(--color-danger)',
                      padding: '10px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isCredit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                        {isCredit 
                          ? (entry.transaction?.fromAccount === account._id 
                              ? 'Mock Deposit Faucet' 
                              : `Received from Account`)
                          : `Sent to Account`
                        }
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                        {isCredit
                          ? (entry.transaction?.fromAccount !== account._id && entry.transaction?.fromAccount)
                          : entry.transaction?.toAccount
                        }
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>
                        <Clock size={12} />
                        <span>{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Ledger Settlement Entry & Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: isCredit ? 'var(--color-success)' : 'var(--color-danger)',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {isCredit ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    
                    {entry.transaction && (
                      <span className={`badge badge-${entry.transaction.status}`} style={{ fontSize: '0.65rem', padding: '2px 6px', marginTop: '6px' }}>
                        {entry.transaction.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
