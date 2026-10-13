import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react';
import SafeLedgerLogo from '../components/SafeLedgerLogo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Sync and cache theme preference + layout tokens
  useEffect(() => {
    const isDarkMode =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDarkMode);
    setIsDark(isDarkMode);

    // Cache non-sensitive layout tokens in localStorage for zero-CLS & quick restore
    if (!localStorage.getItem('safeledger_layout_tokens')) {
      localStorage.setItem(
        'safeledger_layout_tokens',
        JSON.stringify({ density: 'comfortable', surface: 'glassmorphism', fontScale: '1.0' })
      );
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.theme = next ? 'dark' : 'light';
    setIsDark(next);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (field === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!EMAIL_REGEX.test(value.trim())) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < MIN_PASSWORD_LENGTH) {
        newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isValid = validateAll();
    if (!isValid) return;

    // Immediate loading state trigger (< 100ms perceived performance target)
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setServerError(result.message || 'Invalid credentials');
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative transition-colors duration-200">
      {/* Theme Switcher Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          data-testid="theme-toggle"
          className="p-2.5 rounded-xl bg-white/80 dark:bg-dark-card/80 border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 backdrop-blur-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-6 sm:p-8 transition-all duration-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <SafeLedgerLogo className="mb-4" showText={false} />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to SafeLedger
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Secure ledger access for accounts and transfers
          </p>
          <div className="mt-2.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border">
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Demo: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">admin@bank.com</span> /{' '}
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">Admin123</span>
            </p>
          </div>
        </div>

        {/* Server Level Alert Container - Zero Layout Shift (CLS) container */}
        <div className="min-h-[48px] mb-4 flex items-center" aria-live="assertive">
          {serverError && (
            <div
              id="server-error"
              role="alert"
              data-testid="server-error"
              className="w-full flex items-center gap-2.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-3 rounded-xl transition-opacity duration-150"
            >
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) validateField('email', e.target.value);
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                data-testid="email-input"
                className={`input-field pl-10 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-500'
                    : ''
                }`}
                placeholder="you@example.com"
              />
            </div>
            {/* Field Error with CLS-prevention container */}
            <div className="min-h-[20px] mt-1">
              {errors.email && (
                <p id="email-error" role="alert" data-testid="email-error" className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) validateField('password', e.target.value);
                }}
                onBlur={(e) => validateField('password', e.target.value)}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                data-testid="password-input"
                className={`input-field pl-10 pr-10 ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-500'
                    : ''
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="password-toggle"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {/* Field Error with CLS-prevention container */}
            <div className="min-h-[20px] mt-1">
              {errors.password && (
                <p id="password-error" role="alert" data-testid="password-error" className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            data-testid="login-submit"
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" data-testid="loading-spinner" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          No account?{' '}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
