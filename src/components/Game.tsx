import { useEffect, useRef, useState } from "react";
import { getPageContent } from "../services/wikipedia";
import { BiTimer } from "react-icons/bi";
import { FiMousePointer, FiRotateCcw } from "react-icons/fi";

interface GameProps {
    startPage: string;
    targetPage: string;
    onWin: (stats: { startTime: number; endTime: number; clicks: number; path: string[] }) => void;
    onRestart: () => void;
}

export default function Game({ startPage, targetPage, onWin, onRestart }: GameProps) {
    const [currentTitle, setCurrentTitle] = useState(startPage);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [clicks, setClicks] = useState(0);
    const [path, setPath] = useState<string[]>([startPage]);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    useEffect(() => {
        async function fetchContent() {
            setIsLoading(true);
            const content = await getPageContent(currentTitle);
            if (content) {
                setHtmlContent(content.html);
                if (content.title.toLowerCase() === targetPage.toLowerCase()) {
                    onWin({
                        startTime,
                        endTime: Date.now(),
                        clicks,
                        path: [...path]
                    });
                }
            }
            setIsLoading(false);
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        }
        fetchContent();
    }, [currentTitle, targetPage, onWin, startTime, clicks, path]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-white">

            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Current Page</span>
                        <h2 className="text-lg font-bold text-zinc-900 truncate md:max-w-md">
                            {currentTitle}
                        </h2>
                    </div>
                    <div className="w-px h-8 bg-zinc-200"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Time</span>
                            <div className="flex items-center gap-1 text-zinc-700 font-mono">
                                <BiTimer className="w-3 h-3" />
                                {formatTime(elapsedTime)}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Clicks</span>
                            <div className="flex items-center gap-1 text-zinc-700 font-mono">
                                <FiMousePointer className="w-3 h-3" />
                                {clicks}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Target</span>
                        <div className="bg-zinc-900 text-white border-none px-2 py-0.5 rounded-4xl">
                            {targetPage}
                        </div>
                    </div>
                    <button onClick={onRestart} title="Restart Game" className="p-2 rounded-lg hover:bg-zinc-200">
                        <FiRotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </header>
            
        </div>
    );
}