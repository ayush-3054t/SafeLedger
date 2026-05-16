import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import SafeLedgerLogo from '../components/SafeLedgerLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <SafeLedgerLogo className="mb-4" showText={false} />
          <h1 className="text-2xl font-bold">Sign in to SafeLedger</h1>
          <p className="text-slate-500 text-sm mt-1">Secure ledger access for accounts and transfers</p>
          <p className="text-slate-400 text-xs mt-2">Admin credentials: admin@bank.com / Admin123</p>
        </div>

        {error && (
          <div className="mb-4 flex gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex justify-center gap-2">
            {loading ? 'Signing in…' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          No account? <Link to="/register" className="text-primary-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
