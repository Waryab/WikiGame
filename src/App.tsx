import { useState } from 'react'
import Setup from './components/Setup';
import Game from './components/Game';
import type { GameStats, GameStatus } from './types';
import Results from './components/Result';

function App() {
  const [status, setStatus] = useState<GameStatus>('setup');
  const [startPage, setStartPage] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const [stats, setStats] = useState<GameStats | null>(null);

  const handleStartGame = (start: string, target: string) => {
    setStartPage(start);
    setTargetPage(target);
    setStatus('playing');
  };

  const handleWin = (gameStats: GameStats) => {
    setStats(gameStats);
    setStatus('won');
  };

  const handleRestart = () => {
    setStatus('setup');
    setStartPage('');
    setTargetPage('');
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {status === 'setup' && (
        <Setup onStart={handleStartGame} />
      )}

      {status === 'playing' && (
        <Game
          startPage={startPage}
          targetPage={targetPage}
          onWin={handleWin}
          onRestart={handleRestart}
        />
      )}

      {status === 'won' && stats && (
        <Results
          startPage={startPage}
          targetPage={targetPage}
          stats={stats}
          onRestart={handleRestart}
        />
      )}

    </div>
  )
}

export default App
