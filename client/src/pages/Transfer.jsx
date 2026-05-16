import { useState, useEffect } from 'react';
import { Send, User, IndianRupee, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as bankingApi from '../services/bankingApi';
import { formatCurrency, newIdempotencyKey } from '../utils/format';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    bankingApi.getAccounts().then(({ data }) => {
      setAccounts(data);
      if (data.length > 0) setFromAccount(data[0]._id);
    });
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !amount) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setStatus({ type: 'error', message: 'Amount must be greater than zero.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const { data } = await bankingApi.createTransaction({
        fromAccount,
        toAccount: toAccount.trim(),
        amount: parsed,
        idempotencyKey: newIdempotencyKey(),
      });
      setStatus({
        type: 'success',
        message: data.message || 'Transfer completed successfully.',
      });
      setToAccount('');
      setAmount('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Transfer failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Transfer</h1>
        <p className="text-slate-500 text-sm">POST /api/transactions - recipient is account number</p>
      </header>

      <article className="glass-card rounded-2xl p-6 sm:p-8">
        {status.message && (
          <p
            className={`mb-6 flex gap-2 text-sm px-4 py-3 rounded-xl ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            {status.message}
          </p>
        )}

        <form onSubmit={handleTransfer} className="space-y-5">
          <label className="block text-sm font-semibold">
            From account (your account ID)
            <span className="relative block mt-1">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="input-field pl-10 appearance-none"
                required
              >
                <option value="" disabled>Select account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountNumber} - balance {formatCurrency(acc.balance, acc.currency || 'INR')}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="block text-sm font-semibold">
            To account number
            <span className="relative block mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="input-field pl-10 font-mono"
                placeholder="10-digit account number"
                required
              />
            </span>
          </label>

          <label className="block text-sm font-semibold">
            Amount
            <span className="relative block mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-10"
                required
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || accounts.length === 0}
            className="w-full btn-primary py-3 flex justify-center gap-2"
          >
            {loading ? 'Processing...' : <><Send className="h-5 w-5" /> Send</>}
          </button>
        </form>
      </article>
    </section>
  );
};

export default Transfer;
