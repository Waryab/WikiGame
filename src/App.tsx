import { useState } from 'react'
import Setup from './components/Setup';

function App() {
  const [status, setStatus] = useState<'setup' | 'playing' | 'won'>('setup');
  const [startPage, setStartPage] = useState('');
  const [targetPage, setTargetPage] = useState('');

  const handleStartGame = (start: string, target: string) => {
    setStartPage(start);
    setTargetPage(target);
    setStatus('playing');
  };

  const handleWin = () => {
    setStatus('won');
  };

  const handleRestart = () => {
    setStatus('setup');
    setStartPage('');
    setTargetPage('');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {status === 'setup' && (
        <Setup onStart={handleStartGame} />
      )}
      
      {status === 'playing' && (
        <></>
      )}

      {status === 'won' && (
        <></>
      )}

    </div>
  )
}

export default App
