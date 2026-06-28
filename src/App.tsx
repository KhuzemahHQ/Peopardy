import React, { useState, useEffect } from 'react';
import './App.css';
import gameData from './gameData.json';

interface Clue {
  id: string;
  value: number;
  clue: string;
  answer: string;
}

function App() {
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [revealedClues, setRevealedClues] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('elegant');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleClueClick = (clue: Clue) => {
    setActiveClue(clue);
    setShowAnswer(false);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleReturn = () => {
    setRevealedClues(new Set(revealedClues).add(activeClue.id));
    setActiveClue(null);
    setShowAnswer(false);
  };

  const handleCancel = () => {
    setActiveClue(null);
    setShowAnswer(false);
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <select 
          className="theme-select" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="elegant">Elegant Dark (Default)</option>
          <option value="classic">Classic Jeopardy</option>
          <option value="mogul">Mogul Money</option>
          <option value="cyberpunk">Cyberpunk Neon</option>
          <option value="retro">Retro Sunset</option>
          <option value="emerald">Emerald City</option>
        </select>
      </div>

      <header className="header">
        <h1>Peopardy</h1>
      </header>

      {/* Main Board */}
      <main className="board">
        {gameData.categories.map((category) => (
          <div key={category.name} className="category-header">
            {category.name}
          </div>
        ))}
        
        {/* We need to render rows of values across categories.
            The data is structured by category, then questions.
            We transpose this to render rows. */}
        {[0, 1, 2, 3, 4].map((rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {gameData.categories.map((category) => {
              const clue = category.questions[rowIndex];
              const isRevealed = revealedClues.has(clue.id);
              
              return (
                <div
                  key={clue.id}
                  className={`clue-card ${isRevealed ? 'disabled' : ''}`}
                  onClick={() => handleClueClick(clue)}
                >
                  ${clue.value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </main>

      {/* Clue Modal */}
      {activeClue && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-clue">{activeClue.clue}</div>
            
            {showAnswer && (
              <div className="modal-answer">{activeClue.answer}</div>
            )}
            
            <div className="modal-controls">
              {!showAnswer ? (
                <>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn" onClick={handleReveal}>
                    Reveal Answer
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary" onClick={handleReturn}>
                  Return to Board
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
