import React from 'react';

const Grammar: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            <span className="text-purple-400">G</span>rammar
          </h1>
          <p className="text-slate-400 font-mono text-sm">Master English grammar rules</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Tenses</h3>
            <p className="text-slate-400 mb-4">Master all English tenses</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Sentence Structure</h3>
            <p className="text-slate-400 mb-4">Learn proper sentence construction</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Parts of Speech</h3>
            <p className="text-slate-400 mb-4">Understand nouns, verbs, adjectives, and more</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Punctuation</h3>
            <p className="text-slate-400 mb-4">Master punctuation rules</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Active & Passive Voice</h3>
            <p className="text-slate-400 mb-4">Learn when to use active and passive voice</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Conditionals</h3>
            <p className="text-slate-400 mb-4">Master conditional sentences</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grammar;
