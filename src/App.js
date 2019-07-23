import React from 'react';
import './App.css';
import GameContainer from './components/GameContainer'

export default function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Word Game</h1>
      </header>
      <GameContainer />
    </div>
  );
}
