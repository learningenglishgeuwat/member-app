import Link from '../../components/HoverPrefetchLink';
import BackButton from '../components/BackButton';
import './grammar.css';

export default function GrammarPage() {
  const showAnalisisGrammarForSpeakingCard = false;

  return (
    <main className="grammar-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill" />
      </div>

      <div className="grammar-shell">
        <h1 className="grammar-title">Grammar</h1>
        <p className="grammar-subtitle">Pilih jalur grammar yang ingin dipelajari.</p>

        <div className="grammar-triangle">
          <Link prefetch={false} prefetchOnHover={false}
            href="/skill/grammar/grammar-resource"
            className="grammar-btn grammar-btn-top"
            data-tour="grammar-resource-button"
          >
            Grammar Resource
          </Link>

          <div className="grammar-connector">
            <div className="grammar-snake" aria-hidden="true">
              <span className="snake-line snake-trunk" />
              <span className="snake-node" />
              <span className="snake-line snake-branch-left" />
              <span className="snake-line snake-branch-right" />
              <span className="snake-line snake-left" />
              <span className="snake-line snake-right" />
            </div>
            <div className="grammar-bottom">
              <div className="grammar-btn grammar-btn-locked" aria-disabled="true">
                <span>Grammar for Speaking</span>
                <span className="grammar-lock-badge">Locked</span>
              </div>

              <div className="grammar-btn grammar-btn-locked" aria-disabled="true">
                <span>Grammar for Writing</span>
                <span className="grammar-lock-badge">Locked</span>
              </div>
            </div>

            {showAnalisisGrammarForSpeakingCard && (
              <div className="grammar-bottom-extra">
                <div className="grammar-btn grammar-btn-locked" aria-disabled="true">
                  <span>Analisis Grammar for Speaking</span>
                  <span className="grammar-lock-badge">Locked</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
