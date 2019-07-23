import React from 'react';
import './App.css';
import GameContainer from './components/GameContainer'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        Word Game
      </header>
      <GameContainer />
    </div>
  );
}

export default App;
