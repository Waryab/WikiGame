import { useEffect, useRef, useState } from "react";
import { getPageContent } from "../services/wikipedia";
import { BiTimer } from "react-icons/bi";
import { FiFlag, FiMousePointer, FiRotateCcw } from "react-icons/fi";

interface GameProps {
    startPage: string;
    targetPage: string;
    onWin: (stats: { startTime: number; endTime: number; clicks: number; path: string[] }) => void;
    onRestart: () => void;
}

export default function Game({ startPage, targetPage, onWin, onRestart }: GameProps) {
    const [currentTitle] = useState(startPage);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [clicks] = useState(0);
    const [path] = useState<string[]>([startPage]);
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

            <main className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div
                        className="flex-1 overflow-y-auto"
                        ref={contentRef}
                    >
                        <div
                            className="mx-auto p-4 md:p-8 wiki-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>

                <aside className="hidden xl:flex w-64 border-l border-zinc-200 flex-col bg-zinc-50/30">
                    <div className="p-4 border-b border-zinc-200">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <FiFlag className="w-3 h-3" />
                            Your Path
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {path.map((step, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="flex flex-col items-center mt-1 shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                        {i < path.length - 1 && <div className="w-px h-8 bg-zinc-200" />}
                                    </div>
                                    <span className="text-xs text-zinc-600 leading-tight wrap-break-word">
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-medium text-zinc-500 animate-pulse">Fetching Wikipedia...</p>
                        </div>
                    </div>
                )}

            </main>

            <div className="lg:hidden p-2 bg-zinc-900 text-white text-center text-xs font-bold uppercase tracking-widest font-mono">
                Target: {targetPage}
            </div>
        </div>
    );
}