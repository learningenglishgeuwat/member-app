export default function DashboardLoadingShell() {
  return (
    <div className="dashboard-layout font-sans min-h-screen overflow-hidden">
      <main className="relative min-h-screen overflow-hidden p-4 pb-28 md:p-8 md:pb-32 lg:p-12 lg:pb-36">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl space-y-6 sm:space-y-8">
          <header className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
              INITIATE <span className="text-cyan-300">PROTOCOL</span>
            </h2>
            <p className="text-slate-400 font-mono text-xs sm:text-sm">
              Jangan biarkan bahasa membatasi langkahmu. Tuliskan mimpi besar yang sedang kamu perjuangkan di sini.
            </p>
          </header>

          <div
            className="dashboard-widget-card p-4 sm:p-6 md:p-8 relative overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50" />
            <div className="space-y-4">
              <div className="block text-[11px] sm:text-sm font-medium text-cyan-200 uppercase tracking-widest font-display">
                Mission Objective
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-11 flex-1 rounded-lg border border-cyan-500/20 bg-black/40" />
                <div className="h-11 rounded-lg bg-cyan-500/25 px-8 sm:w-28" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
