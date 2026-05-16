import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as bankingApi from '../services/bankingApi';
import { formatCurrency, newIdempotencyKey } from '../utils/format';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [topUpAccountId, setTopUpAccountId] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpStatus, setTopUpStatus] = useState({ type: '', message: '' });
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState('');
  const [adminAccountNumber, setAdminAccountNumber] = useState('');
  const [adminAmount, setAdminAmount] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStatus, setAdminStatus] = useState({ type: '', message: '' });
  const { user } = useAuth();

  const loadAccounts = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await bankingApi.getAccounts();
      setAccounts(data);
      setTopUpAccountId((current) => current || data[0]?._id || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    setTransactionsError('');
    setTransactionsLoading(true);
    try {
      const { data } = user.systemUser
        ? await bankingApi.getAdminTransactions()
        : await bankingApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      setTransactionsError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setTransactionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      await loadAccounts();
      await loadTransactions();
    };

    load();
  }, [loadAccounts, loadTransactions]);

  const handleCreateAccount = async () => {
    setCreating(true);
    setError('');
    try {
      await bankingApi.createAccount();
      await loadAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();
    setTopUpStatus({ type: '', message: '' });

    const parsedAmount = Number(topUpAmount);
    if (!topUpAccountId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setTopUpStatus({ type: 'error', message: 'Select an account and enter a positive amount.' });
      return;
    }

    setTopUpLoading(true);
    try {
      await bankingApi.topUpAccount({
        accountId: topUpAccountId,
        amount: parsedAmount,
        idempotencyKey: newIdempotencyKey(),
      });
      setTopUpAmount('');
      setTopUpStatus({ type: 'success', message: 'Balance added successfully.' });
      await loadAccounts();
      await loadTransactions();
    } catch (err) {
      setTopUpStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add balance.',
      });
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleAdminCredit = async (e) => {
    e.preventDefault();
    setAdminStatus({ type: '', message: '' });

    const parsedAmount = Number(adminAmount);
    if (!adminAccountNumber.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setAdminStatus({ type: 'error', message: 'Enter a valid account number and amount.' });
      return;
    }

    setAdminLoading(true);
    try {
      await bankingApi.createInitialFunds({
        toAccount: adminAccountNumber.trim(),
        amount: parsedAmount,
        idempotencyKey: newIdempotencyKey(),
      });
      setAdminAccountNumber('');
      setAdminAmount('');
      setAdminStatus({ type: 'success', message: 'Funds credited successfully.' });
      await loadTransactions();
    } catch (err) {
      setAdminStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to credit funds.',
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);

  if (loading) {
    return (
      <p className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary-600">SafeLedger dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name || 'Customer'}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Review your accounts, transaction history, and controls in one secure ledger view.
          </p>
        </div>

        <div className="flex items-center gap-3 justify-start lg:justify-end">
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={creating}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Creating...' : 'New account'}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-card rounded-2xl p-6">
          <p className="text-sm text-slate-500 mb-2">Total balance</p>
          <h2 className="text-3xl font-bold">{formatCurrency(totalBalance)}</h2>
          <p className="mt-3 text-sm text-slate-500">All accounts aggregated in your ledger.</p>
        </article>

        <article className="glass-card rounded-2xl p-6">
          <p className="text-sm text-slate-500 mb-2">Active accounts</p>
          <h2 className="text-3xl font-bold">{accounts.length}</h2>
          <p className="mt-3 text-sm text-slate-500">Your available safe ledger accounts.</p>
        </article>

        <article className="glass-card rounded-2xl p-6">
          <p className="text-sm text-slate-500 mb-2">Transactions</p>
          <h2 className="text-3xl font-bold">{transactions.length}</h2>
          <p className="mt-3 text-sm text-slate-500">Recent activity loaded from the ledger.</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Transactions</h2>
              <p className="text-sm text-slate-500">Latest ledger activity</p>
            </div>
            <Link to="/transfer" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              New transfer →
            </Link>
          </div>

          {transactionsLoading ? (
            <p className="text-slate-500">Loading transactions…</p>
          ) : transactionsError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{transactionsError}</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-500 text-sm">No transaction records found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2">To</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="rounded-3xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border">
                      <td className="px-3 py-3 text-slate-600">{new Date(transaction.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{transaction.fromAccount?.accountNumber || 'N/A'}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{transaction.toAccount?.accountNumber || 'N/A'}</td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-900">{formatCurrency(transaction.amount)}</td>
                      <td className="px-3 py-3 text-sm text-slate-700">{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <div className="space-y-4">
          <article className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Add balance</h2>
            {topUpStatus.message && (
              <p className={`mb-4 flex gap-2 text-sm px-4 py-3 rounded-xl ${topUpStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {topUpStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                {topUpStatus.message}
              </p>
            )}
            <form onSubmit={handleAddBalance} className="space-y-4">
              <label className="block text-sm font-semibold">
                Account
                <select
                  value={topUpAccountId}
                  onChange={(e) => setTopUpAccountId(e.target.value)}
                  className="input-field mt-1"
                  disabled={accounts.length === 0}
                  required
                >
                  <option value="" disabled>Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountNumber} • {formatCurrency(acc.balance, acc.currency || 'INR')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Amount
                <span className="relative block mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="input-field pl-10"
                    placeholder="1000"
                    required
                  />
                </span>
              </label>
              <button type="submit" disabled={topUpLoading || accounts.length === 0} className="btn-primary w-full py-3">
                {topUpLoading ? 'Adding...' : 'Add balance'}
              </button>
            </form>
          </article>

          {user?.systemUser && (
            <article className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Admin funds</h2>
              {adminStatus.message && (
                <p className={`mb-4 flex gap-2 text-sm px-4 py-3 rounded-xl ${adminStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {adminStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  {adminStatus.message}
                </p>
              )}
              <form onSubmit={handleAdminCredit} className="space-y-4">
                <label className="block text-sm font-semibold">
                  Recipient account number
                  <input
                    type="text"
                    value={adminAccountNumber}
                    onChange={(e) => setAdminAccountNumber(e.target.value)}
                    className="input-field mt-1"
                    placeholder="Account number"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Amount
                  <span className="relative block mt-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={adminAmount}
                      onChange={(e) => setAdminAmount(e.target.value)}
                      className="input-field pl-10"
                      placeholder="1000"
                      required
                    />
                  </span>
                </label>
                <button type="submit" disabled={adminLoading} className="btn-primary w-full py-3">
                  {adminLoading ? 'Crediting...' : 'Credit funds'}
                </button>
              </form>
            </article>
          )}
        </div>
      </div>

      <article className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Your accounts</h3>
        {accounts.length === 0 ? (
          <p className="text-slate-500 text-sm">No accounts yet. Registration creates one automatically; you can add more.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((acc) => (
              <div key={acc._id} className="rounded-3xl border border-slate-200 dark:border-dark-border bg-white/80 dark:bg-dark-card p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Account</p>
                <p className="font-mono text-lg tracking-[0.15em]">{acc.accountNumber}</p>
                <p className="mt-3 text-sm text-slate-500">Status: <span className="font-semibold text-slate-700">{acc.status}</span></p>
                <p className="mt-1 text-sm text-slate-500">Currency: <span className="font-semibold">{acc.currency || 'INR'}</span></p>
                <p className="mt-4 text-2xl font-bold">{formatCurrency(acc.balance, acc.currency || 'INR')}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
};

export default Dashboard;
