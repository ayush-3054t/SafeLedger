const SafeLedgerLogo = ({ className = '', size = 44, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 p-3 shadow-lg shadow-sky-500/10" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 4L12 12v18c0 17.673 7.163 28 20 30 12.837-2 20-12.327 20-30V12L32 4Z" fill="white" opacity="0.95" />
          <path d="M22 30l8.5 8L42 22" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 10v6" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">SafeLedger</span>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Secure Your Finances</span>
        </div>
      )}
    </div>
  )
}

export default SafeLedgerLogo;
