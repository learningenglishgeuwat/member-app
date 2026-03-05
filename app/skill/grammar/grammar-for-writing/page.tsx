import BackButton from '../../components/BackButton';

export default function GrammarWritingPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar" />
      </div>

      <div className="mx-auto mt-16 w-full max-w-4xl">
        <h1 className="text-3xl font-bold md:text-4xl">Grammar for Writing</h1>
        <p className="mt-2 text-slate-300">Halaman ini siap untuk materi grammar konteks writing.</p>
      </div>
    </main>
  );
}

