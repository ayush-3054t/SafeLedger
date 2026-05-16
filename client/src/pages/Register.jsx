import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import SafeLedgerLogo from '../components/SafeLedgerLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <article className="w-full max-w-md glass-card rounded-2xl p-8">
        <header className="flex flex-col items-center mb-8">
          <SafeLedgerLogo className="mb-4" showText={false} />
          <h1 className="text-2xl font-bold">Create your SafeLedger account</h1>
          <p className="text-slate-500 text-sm mt-1">Register and start managing funds securely</p>
        </header>

        {error && (
          <p className="mb-4 flex gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <span className="relative block mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
              />
            </span>
          </label>
          <label className="block text-sm font-medium">
            Email
            <span className="relative block mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </span>
          </label>
          <label className="block text-sm font-medium">
            Password
            <span className="relative block mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
              />
            </span>
          </label>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex justify-center gap-2">
            {loading ? 'Creating…' : <>Register <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Have an account? <Link to="/login" className="text-primary-600 font-semibold">Sign in</Link>
        </p>
      </article>
    </section>
  );
};

export default Register;
