import React from 'react';

const Speaking: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            <span className="text-purple-400">S</span>peaking
          </h1>
          <p className="text-slate-400 font-mono text-sm">Develop your English speaking skills</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Daily Conversations</h3>
            <p className="text-slate-400 mb-4">Practice everyday English conversations</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Business Speaking</h3>
            <p className="text-slate-400 mb-4">Professional communication skills</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Presentations</h3>
            <p className="text-slate-400 mb-4">Master public speaking in English</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Interview Skills</h3>
            <p className="text-slate-400 mb-4">Prepare for English job interviews</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Pronunciation Practice</h3>
            <p className="text-slate-400 mb-4">Improve your speaking clarity</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Fluency Building</h3>
            <p className="text-slate-400 mb-4">Develop natural speaking flow</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaking;
