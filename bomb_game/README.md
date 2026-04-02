# 💣 Bomb Squad

A premium, local pass-and-play multiplayer strategy game built entirely with HTML, CSS, and vanilla JavaScript. 

![Bomb Squad Premium UI](https://img.shields.io/badge/UI-Premium-blueviolet) ![Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-yellow) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen)

## 🎮 How to Play
Bomb Squad is a 2-player game played on a 3x3 grid (9 squares). It's a mix between Minesweeper and Battleship.

1. **Phase 1 (Player 1 Setup):** Player 1 secretly selects and hides **3 bombs** on their board.
2. **Phase 2 (Player 2 Setup):** The device is passed to Player 2. Player 2 secretly selects and hides **3 bombs** on their board.
3. **Phase 3 (Guessing):** Players take turns guessing taking spots on the opponent's board.
4. **Game Over:** If you click on 3 bombs, you **LOSE**. The first player to rack up 3 strikes loses the game!

## ✨ Features
- **Premium Aesthetics**: Dark mode, glassmorphism, dynamic gradients, and smooth multi-colored floating orbs.
- **Fluid Animations**: High-quality state transitions, hover ripples, structural CSS pulses, and screen-shake effects when a bomb is hit.
- **100% Static Web App**: No backend server, no npm installations, and no frameworks. Ready to deploy instantly.
- **State Machine Architecture**: Game logic cleanly handles `Phase` progression and enforces safe "pass device" screens so opponents can't peek.

## 🚀 How to Run Locally
Because this project uses vanilla web technologies without modules, running it is instantaneous:
1. Open the folder.
2. Double-click `index.html` to open it in your default web browser.

## 🌐 How to Deploy
You can deploy this in 30 seconds for free:
- **Netlify Drop**: Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the folder in.
- **Vercel Drop**: Go to [vercel.com/new/drop](https://vercel.com/new/drop) and drag the folder in.
- **GitHub Pages**: Upload these files to a GitHub repository and enable GitHub Pages in the settings.

---
*Created for fast, casual local multiplayer sessions.*
