import React, { useState, useEffect } from 'react';
import './App.css';
import defaultGameData from './gameData.json';

interface Clue {
  id: string;
  value: number;
  clue: string;
  answer: string;
}

interface Category {
  name: string;
  questions: Clue[];
}

interface GameData {
  categories: Category[];
}

function App() {
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [revealedClues, setRevealedClues] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('elegant');
  const [data, setData] = useState<GameData>(defaultGameData as GameData);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!json || !Array.isArray(json.categories)) {
          throw new Error('Invalid JSON format. Must contain a "categories" array.');
        }

        // Basic validation of structure
        const isValid = json.categories.every((cat: any) => 
          typeof cat.name === 'string' && Array.isArray(cat.questions)
        );

        if (!isValid) {
          throw new Error('Invalid JSON structure. Each category must have a "name" and a "questions" array.');
        }

        setData(json as GameData);
        setRevealedClues(new Set()); // Reset board
      } catch (error: any) {
        alert(error.message || 'Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    // Clear input so the same file can be uploaded again if needed
    event.target.value = '';
  };

  const maxQuestions = Math.max(...data.categories.map(c => c.questions?.length || 0));
  const rowIndices = Array.from({ length: maxQuestions }, (_, i) => i);

  return (
    <div className="app-container">
      <div className="navbar">
        <label className="file-upload-label">
          Upload Custom Game
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload} 
            className="file-input"
          />
        </label>
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
      <main className="board" style={{ gridTemplateColumns: `repeat(${data.categories.length}, 1fr)` }}>
        {data.categories.map((category, index) => (
          <div key={`cat-${index}`} className="category-header">
            {category.name}
          </div>
        ))}
        
        {/* Render rows dynamically based on maxQuestions */}
        {rowIndices.map((rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {data.categories.map((category, catIndex) => {
              const clue = category.questions[rowIndex];
              if (!clue) return <div key={`empty-${catIndex}-${rowIndex}`} className="clue-card disabled"></div>;
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
