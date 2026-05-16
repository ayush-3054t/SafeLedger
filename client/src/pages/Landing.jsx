import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Wallet, Zap, Globe, Lock, Smartphone, ChevronRight, Key, Eye, Server, Users, Award } from 'lucide-react';
import SafeLedgerLogo from '../components/SafeLedgerLogo';

const Landing = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-primary-200 dark:selection:bg-primary-900">
    
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/30 dark:bg-primary-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
    </div>

    <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-white/10 dark:border-white/5 rounded-b-3xl">
      <SafeLedgerLogo showText={true} />
      <div className="hidden md:flex gap-8 items-center text-sm font-medium">
        <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
        <a href="#security" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Security</a>
        <a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</a>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/login" className="text-sm font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Sign in
        </Link>
        <Link to="/register" className="btn-primary text-sm px-6 py-2.5 rounded-full shadow-primary-500/50 hover:shadow-primary-500/80 transition-all">
          Get started
        </Link>
      </div>
    </nav>

    {/* Hero Section */}
    <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-left animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold mb-8 shadow-lg">
          <Zap className="h-4 w-4 text-yellow-400" />
          Platform Redesigned
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900 dark:text-white">
          Control your wealth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">absolute precision.</span>
        </h1>
        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
          Unlock the true potential of your finances. SafeLedger provides a crystal-clear overview of your assets, enabling smarter decisions and seamless global transfers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="btn-primary inline-flex justify-center items-center gap-2 px-8 py-4 text-lg rounded-full group shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50">
            Start Free Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-white dark:bg-dark-card text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md transition-all">
            Log In to Dashboard
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
             <ShieldCheck className="h-5 w-5 text-green-500" />
             <span>Bank-level Security</span>
          </div>
          <div className="flex items-center gap-2">
             <Globe className="h-5 w-5 text-blue-500" />
             <span>Global Coverage</span>
          </div>
        </div>
      </div>
      
      <div className="relative lg:h-[600px] flex justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-primary-500/20 rounded-full blur-[100px]"></div>
        <img 
          src="/hero_dashboard.png" 
          alt="Banking Dashboard Interface" 
          className="relative z-10 w-full max-w-lg lg:max-w-[120%] object-contain animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 lg:-right-10 glass-card px-5 py-3 rounded-2xl animate-float hidden md:flex items-center gap-4" style={{ animationDelay: '1s' }}>
          <div className="bg-primary-500/20 p-2 rounded-xl">
            <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Balance</p>
            <p className="font-bold text-slate-900 dark:text-white text-lg">$142,500.00</p>
          </div>
        </div>

        <div className="absolute bottom-32 left-0 lg:-left-10 glass-card px-5 py-3 rounded-2xl animate-float hidden md:flex items-center gap-3" style={{ animationDelay: '1.5s' }}>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <p className="font-bold text-slate-900 dark:text-white text-sm">System Operational</p>
        </div>
      </div>
    </main>

    <section id="features" className="relative z-10 bg-white/50 dark:bg-dark-card/30 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to manage your money</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful features wrapped in an elegant, easy-to-use interface.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-8">
          <li className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group cursor-default">
            <div className="bg-primary-50 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
              <Lock className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Bank-grade Security</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Your data is protected with enterprise-level encryption. We use JWT for secure authentication and state-of-the-art infrastructure.
            </p>
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
          <li className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group cursor-default">
            <div className="bg-purple-50 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Globe className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Global Transfers</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Send money to anyone, anywhere instantly. Our idempotent transaction system guarantees your funds move safely and accurately.
            </p>
            <Link to="/register" className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
          <li className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group cursor-default">
            <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Smartphone className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Mobile Optimized</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Experience the full power of SafeLedger right from your pocket. Designed from the ground up to look and feel amazing on any device.
            </p>
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        </ul>
      </div>
    </section>

    <section id="security" className="relative z-10 py-24 bg-slate-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Uncompromising <span className="text-primary-600 dark:text-primary-500">Security</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We understand that your trust is our most valuable asset. That's why SafeLedger is built from the ground up with a zero-trust architecture, military-grade encryption, and continuous monitoring to keep your assets completely safe.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl h-fit">
                  <Key className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your data is scrambled before it even leaves your device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl h-fit">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">24/7 Fraud Monitoring</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven systems detect and prevent unauthorized access instantly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl h-fit">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Multi-Factor Auth</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Secure your account with biometric or hardware token verification.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl h-fit">
                  <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Redundant Backups</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Geographically distributed servers ensure 99.99% uptime.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative w-full h-[400px] bg-slate-200 dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10"></div>
            <div className="relative z-10 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-dark-bg rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <Lock className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">System Fully Secured</h3>
                <div className="flex gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about" className="relative z-10 py-24 bg-white dark:bg-dark-card border-t border-slate-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Our <span className="text-primary-600 dark:text-primary-500">Mission</span></h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed">
          Founded in 2026, SafeLedger was created with a simple idea: banking should be beautiful, transparent, and built for the modern digital age. We're a team of engineers, designers, and financial experts dedicated to breaking down borders and democratizing access to premium financial tools.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div className="p-6">
            <div className="mx-auto bg-primary-50 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h4 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">100k+</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Active Users Worldwide</p>
          </div>
          <div className="p-6">
            <div className="mx-auto bg-purple-50 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">$5B+</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Processed Securely</p>
          </div>
          <div className="p-6">
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">#1</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Rated Banking App 2026</p>
          </div>
        </div>
      </div>
    </section>

    <footer className="relative z-10 bg-slate-900 dark:bg-black text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your banking?</h2>
        <p className="text-lg text-slate-400 mb-10">Join thousands of users who are already experiencing the future.</p>
        <Link to="/register" className="btn-primary inline-flex justify-center items-center px-10 py-4 text-xl rounded-full shadow-2xl shadow-primary-500/20">
          Create Free Account
        </Link>
      </div>
      <div className="mt-20 pt-8 border-t border-white/10 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} SafeLedger Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
