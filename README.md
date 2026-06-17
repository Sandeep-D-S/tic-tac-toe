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
TicTacToe/
├── index.html
├── styles.css
├── script.js
└── README.md