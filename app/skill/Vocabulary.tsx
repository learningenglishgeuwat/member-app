import React from 'react';

const Vocabulary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            <span className="text-purple-400">V</span>ocabulary
          </h1>
          <p className="text-slate-400 font-mono text-sm">Expand your English word power</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Basic Words</h3>
            <p className="text-slate-400 mb-4">Essential everyday vocabulary</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Academic Words</h3>
            <p className="text-slate-400 mb-4">Advanced vocabulary for academic success</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Business English</h3>
            <p className="text-slate-400 mb-4">Professional vocabulary for the workplace</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Phrasal Verbs</h3>
            <p className="text-slate-400 mb-4">Master common phrasal verbs</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Idioms</h3>
            <p className="text-slate-400 mb-4">Learn English idioms and expressions</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-colors">
            <h3 className="text-xl font-semibold text-purple-300 mb-3 font-display">Word Families</h3>
            <p className="text-slate-400 mb-4">Learn related words and their forms</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
