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
  questions: (Clue | null)[];
}

interface GameData {
  categories: Category[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const processGameData = (rawData: GameData): GameData => {
  if (rawData.categories.length < 5) {
    throw new Error('Game data must have at least 5 categories.');
  }

  // Pick 5 categories randomly
  const pickedCategories = shuffleArray(rawData.categories).slice(0, 5);
  const targetValues = [200, 400, 600, 800, 1000];

  const processedCategories = pickedCategories.map(cat => {
    const pickedQuestions = targetValues.map(value => {
      // Find all questions in this category with the target value
      const candidates = cat.questions.filter(q => q && q.value === value);
      if (candidates.length > 0) {
        // Pick one at random
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      // Leave space blank if no question of this difficulty exists
      return null;
    });

    return {
      name: cat.name,
      questions: pickedQuestions
    };
  });

  return { categories: processedCategories };
};

function App() {
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [revealedClues, setRevealedClues] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('elegant');
  const [data, setData] = useState<GameData>(() => {
    try {
      return processGameData(defaultGameData as GameData);
    } catch {
      return defaultGameData as GameData;
    }
  });

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

        const processed = processGameData(json as GameData);
        setData(processed);
        setRevealedClues(new Set()); // Reset board
      } catch (error: any) {
        alert(error.message || 'Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    // Clear input so the same file can be uploaded again if needed
    event.target.value = '';
  };

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
      <main className="board">
        {data.categories.map((category, index) => (
          <div key={`cat-${index}`} className="category-header">
            {category.name}
          </div>
        ))}
        
        {/* Render exactly 5 rows to stick to the 5x5 grid */}
        {[0, 1, 2, 3, 4].map((rowIndex) => (
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
