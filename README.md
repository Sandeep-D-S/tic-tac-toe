# Tic-Tac-Toe Advanced Demo

## Project Objective
This project is a responsive and interactive Tic-Tac-Toe game built using **HTML**, **CSS**, and **JavaScript**.  
It demonstrates core front-end development concepts such as:

- DOM manipulation
- Event handling
- Game state management
- Responsive UI design
- LocalStorage usage
- AI logic using the Minimax algorithm
- Animations and visual effects

The game supports:
- 2-player human mode
- Human vs AI mode
- Multiple AI difficulty levels
- Score tracking
- Move history
- Undo functionality
- Winner overlay display
- Win line animation
- Confetti celebration

---
## Deployed URL: https://eloquent-treacle-37027b.netlify.app/

## Technologies Used
- **HTML5** – for structure and layout
- **CSS3** – for styling, responsiveness, and animations
- **JavaScript (ES6)** – for game logic and interactivity
- **LocalStorage** – to persist scores across browser refreshes
- **SVG** – for drawing the winning line
- **Canvas** – for confetti animation

---

## Features Implemented

### 1. Responsive Game Board
- A 3x3 board created using CSS Grid
- Works smoothly on desktop, tablet, and mobile devices

### 2. Two Game Modes
- **2 Players** mode: two human players can play alternately
- **Play vs AI** mode: user can play against the computer

### 3. AI Difficulty Levels
- **Easy** – random AI moves
- **Medium** – mixed random and smart moves
- **Hard** – optimal AI using the Minimax algorithm

### 4. Winner and Draw Detection
- Detects all possible winning combinations
- Detects draw when all cells are filled without a winner

### 5. Winner Overlay Display
- Shows a centered overlay message on the board
- Displays messages such as:
  - `Player X Won`
  - `Player O Won`
  - `You Won`
  - `AI Won`
- Stays visible for a few seconds

### 6. Scoreboard
- Tracks wins for:
  - Player X
  - Player O
  - Draws
- Scores are saved using `localStorage`

### 7. Move History
- Shows a list of all moves made during the game
- Displays player name and selected cell

### 8. Undo Functionality
- Allows the last move to be reversed
- In AI mode, undo restores the previous human turn correctly

### 9. Restart Functionality
- Resets the board for a new game
- Keeps the scoreboard unchanged

### 10. Win Highlight and Animation
- Winning cells are highlighted clearly
- A win line is drawn using SVG
- Confetti animation is displayed on victory
- Winning cells remain highlighted briefly for better visibility

### 11. Keyboard Accessibility
- Cells can also be played using keyboard keys like `Enter` and `Space`

---

## Folder Structure
```text
project-root/
├── .github/
│   └── workflows/
│       └── pages.yml
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .gitlab-ci.yml
└── README.md

## How the Application Works

### Game Flow
- The board starts empty.
- Player X always begins first.
- Players click a cell or use the keyboard to place their mark.
- After every move, the game checks:
  - whether someone has won
  - whether the game ended in a draw
- If AI mode is selected:
  - after the human move, the AI makes its move automatically
- The scoreboard updates when the game ends.
- Users can restart, undo, or reset scores anytime.

### AI Flow
- In **Easy** mode, the AI selects a random available cell.
- In **Medium** mode, the AI sometimes plays randomly and sometimes uses Minimax.
- In **Hard** mode, the AI always uses Minimax to choose the best possible move.

---

## JavaScript Logic Overview

### Main State Variables
- `board` – stores the 9-cell board state
- `turn` – tracks the current player (`X` or `O`)
- `over` – indicates whether the game is finished
- `history` – stores move history
- `scores` – stores win/draw counts
- `mode` – stores current game mode
- `difficulty` – stores selected AI difficulty

### Key Functions
- `renderBoard()` – updates the board UI
- `makeMove(index)` – places a mark on the board
- `checkWinner(board)` – checks for win/draw conditions
- `endGame(result)` – handles game completion
- `restart()` – resets the board
- `undo()` – reverts the previous move
- `getAIMove()` – chooses the AI move
- `minimax(board, player)` – computes the best move for hard AI
- `launchConfetti()` – displays confetti on winner
- `showWinnerOverlay()` – displays winner message in the center of the board
- `persistScores()` – saves scores to localStorage
- `loadScores()` – loads saved scores from localStorage

---

## How to Run the Project

### Option 1: Open Directly in Browser
1. Download or extract the project folder.
2. Open `index.html` in your browser.

### Option 2: Using VS Code Live Server
1. Open the project in VS Code.
2. Install the Live Server extension if not already installed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option 3: Using Any Local Server
You may also use:
- Node.js live server
- Python simple HTTP server
- Apache / XAMPP if preferred

---

## Enhancements Added
This project includes several enhancements beyond the basic Tic-Tac-Toe requirement:

- AI opponent
- Multiple difficulty levels
- Undo feature
- Score persistence
- Move history
- Animated win line
- Confetti celebration
- Winner overlay message
- Keyboard support
- Responsive design

---

## Conclusion
This project demonstrates a complete front-end implementation of Tic-Tac-Toe with interactive gameplay, AI logic, animations, responsive UI, and persistent scoring.  
It is suitable as a tool demonstration project for showing practical JavaScript skills and application flow understanding.