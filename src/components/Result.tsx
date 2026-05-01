import { FiMousePointer, FiRotateCcw } from "react-icons/fi";
import type { GameStats } from "../types";
import { BiHistory, BiTimer } from "react-icons/bi";

interface ResultsProps {
    startPage: string;
    targetPage: string;
    stats: GameStats;
    onRestart: () => void;
}

export default function Results({ startPage, targetPage, stats, onRestart }: ResultsProps) {
    const duration = Math.floor((stats.endTime - stats.startTime) / 1000);
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
    <div className="flex items-center justify-center h-screen sm:p-4 sm:bg-zinc-50/95 backdrop-blur-xs">
      <div className="w-full max-w-2xl">
        <div className="border-2 border-zinc-200 shadow-2xl overflow-hidden sm:rounded-lg h-screen sm:h-full flex flex-col">
          <div className="text-center bg-zinc-50 border-b border-zinc-200 py-8">
            <div className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
              Race Completed!
            </div>
            <div className="text-zinc-500 mt-2">
              You successfully navigated from <span className="font-bold text-zinc-700">{startPage}</span> to <span className="font-bold text-zinc-700">{targetPage}</span>.
            </div>
          </div>

          <div className="space-y-8 px-4 py-6 bg-white/95 sm:bg-white grow">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex flex-col items-center text-center">
                <BiTimer className="w-6 h-6 text-zinc-400 mb-2" />
                <span className="text-3xl font-black text-zinc-900 font-mono">
                  {formatTime(duration)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Time</span>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex flex-col items-center text-center">
                <FiMousePointer className="w-6 h-6 text-zinc-400 mb-2" />
                <span className="text-3xl font-black text-zinc-900 font-mono">
                  {stats.clicks}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Clicks</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <BiHistory className="w-4 h-4" />
                Your Path
              </h3>
              <div className="h-48 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 overflow-y-auto">
                <div>
                  {stats.path.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center translate-y-1.5">
                        <div className={`size-2 rounded-full ${i === 0 || i === stats.path.length - 1 ? 'bg-zinc-900' : 'bg-zinc-300'}`} />
                        {i < stats.path.length - 1 && <div className="w-px h-6 bg-zinc-200" />}
                      </div>
                      <span className={`text-sm ${i === 0 || i === stats.path.length - 1 ? 'font-bold text-zinc-900' : 'text-zinc-500'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border-t border-zinc-200 p-6 flex flex-col gap-3">
            <button
              onClick={onRestart}
              className="w-full flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg justify-center py-1"
            >
              <FiRotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
    );
}