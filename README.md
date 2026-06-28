# Peopardy

A custom, self-implemented game of Jeopardy built with React and Vite.

## Overview
Peopardy is designed for you to present a Jeopardy-style trivia game on a shared screen. It features a 5x5 grid with categories and values, a sleek dark mode UI with a classic blue/gold color scheme, and an intuitive flow to reveal answers and track questions that have already been clicked.

## How to Run Locally

To get the app up and running on your local machine, follow these steps:

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/KhuzemahHQ/Peopardy.git
   cd Peopardy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Play the Game**:
   - Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).
   - Click on any dollar value in the grid to see the clue.
   - Click "Reveal Answer" to show the answer to your audience.
   - Click "Return to Board" to go back to the grid. The answered question will be greyed out.

## Modifying Questions
The game comes with 25 default questions to get you started. 

**Option 1: Upload at runtime (Recommended)**
You can easily load any custom game data file by clicking the **Upload Custom Game** button in the top left corner of the app. Select a `.json` file that follows the same format as the default `gameData.json`, and the board will instantly update! This makes it incredibly easy to share question files and load them on the fly without changing code.

**Option 2: Hardcode into the app**
To permanently add your own custom questions to the default repository, simply open the `src/gameData.json` file and edit the text for the categories, clues, and answers. The app will automatically compile with your new content.
