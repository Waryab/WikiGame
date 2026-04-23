import React, { useEffect, useState } from "react";
import { getRandomPage, searchPages, validatePage } from "../services/wikipedia";
import { FiPlay, FiSearch } from "react-icons/fi";
import { BiShuffle } from "react-icons/bi";

interface SetupProps {
    onStart: (startPage: string, targetPage: string) => void;
}

interface WikiResult {
    pageid: number;
    title: string;
}

function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

function useWikiSearch(query: string) {
    const debounced = useDebouncedValue(query);
    const [results, setResults] = useState<WikiResult[]>([]);

    useEffect(() => {
        if (debounced.length <= 2) {
            setResults([]);
            return;
        }

        let cancelled = false;

        (async () => {
            const res = await searchPages(debounced);
            if (!cancelled) setResults(res);
        })();

        return () => {
            cancelled = true;
        };
    }, [debounced]);

    return [results, setResults] as const;
}

export default function Setup({ onStart }: SetupProps) {
    const [startQuery, setStartQuery] = useState("");
    const [targetQuery, setTargetQuery] = useState("");

    const [selectedStart, setSelectedStart] = useState<string | null>(null);
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

    const [startResults, setStartResults] = useWikiSearch(startQuery);
    const [targetResults, setTargetResults] = useWikiSearch(targetQuery);

    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        if (!selectedStart || !selectedTarget) return;

        setIsLoading(true);
        try {
            const [validStart, validTarget] = await Promise.all([
                validatePage(selectedStart),
                validatePage(selectedTarget),
            ]);

            if (validStart && validTarget) {
                onStart(validStart, validTarget);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (
        title: string,
        setSelected: (v: string) => void,
        setQuery: (v: string) => void,
        clear: () => void
    ) => {
        setSelected(title);
        setQuery(title);
        clear();
    };

    const handleRandomize = async (start: boolean) => {
        setIsLoading(true);
        try {
            const page = await getRandomPage();
            if (start) {
                setSelectedStart(page);
                setStartQuery(page);
            } else {
                setSelectedTarget(page);
                setTargetQuery(page);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex sm:items-center justify-center h-screen bg-zinc-50">
            <div className="sm:rounded-xl sm:border-2 border-zinc-200 sm:shadow-xl w-full max-w-2xl bg-white text-center">

                <div className="bg-zinc-50 border-b border-zinc-200 p-4 rounded-t-xl">
                    <h1 className="text-3xl font-bold text-zinc-900">
                        WikiGame
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Navigate from point A to point B using only Wikipedia links.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-4 px-4 py-6">

                    <SearchSection
                        label="Start Page"
                        query={startQuery}
                        setQuery={(v) => {
                            setStartQuery(v);
                            setSelectedStart(null);
                        }}
                        results={startResults}
                        selected={selectedStart}
                        onSelect={(title) =>
                            handleSelect(title, setSelectedStart, setStartQuery, () => setStartResults([]))
                        }
                        onRandomize={() => handleRandomize(true)}
                        randomizeTitle="Randomize Start Page"
                        isLoading={isLoading}
                    />

                    <SearchSection
                        label="Target Page"
                        query={targetQuery}
                        setQuery={(v) => {
                            setTargetQuery(v);
                            setSelectedTarget(null);
                        }}
                        results={targetResults}
                        selected={selectedTarget}
                        onSelect={(title) =>
                            handleSelect(title, setSelectedTarget, setTargetQuery, () => setTargetResults([]))
                        }
                        onRandomize={() => handleRandomize(false)}
                        randomizeTitle="Randomize Target Page"
                        isLoading={isLoading}
                    />
                </div>

                <div className="flex justify-center pb-6">
                    <button
                        onClick={handleStart}
                        disabled={!selectedStart || !selectedTarget || isLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50"
                    >
                        <FiPlay className="w-4 h-4" />
                        {isLoading ? "Loading..." : "Start Race"}
                    </button>
                </div>

                <div className="bg-zinc-50 border-t border-zinc-200 py-4 rounded-b-xl">
                    <p className="text-xs text-zinc-400 italic">
                        Tip: Try "United States" or "Philosophy"
                    </p>
                </div>
            </div>
        </div>
    );
}


function SearchSection({
    label,
    query,
    setQuery,
    results,
    selected,
    onSelect,
    onRandomize,
    randomizeTitle,
    isLoading,
}: {
    label: string;
    query: string;
    setQuery: (v: string) => void;
    results: WikiResult[];
    selected: string | null;
    onSelect: (title: string) => void;
    onRandomize: () => void;
    randomizeTitle: string;
    isLoading: boolean;
}) {
    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase text-zinc-500 text-left block">
                {label}
            </label>

            <div className="flex items-center gap-2">
                <SearchBar
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={onRandomize}
                    disabled={isLoading}
                    className="border border-zinc-300 rounded-xl p-2 hover:bg-zinc-100"
                    title={randomizeTitle}
                >
                    <BiShuffle className="size-4" />
                </button>
            </div>

            {results.length > 0 && !selected && (
                <div className="absolute left-0 right-0 top-full z-50 bg-white border border-zinc-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((r) => (
                        <button
                            key={r.pageid}
                            onClick={() => onSelect(r.title)}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm"
                        >
                            {r.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


const SearchBar = React.memo(
    ({ value, ...props }: React.ComponentProps<"input">) => {
        return (
            <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    value={value}
                    className="pl-9 h-9 w-full rounded-lg border border-zinc-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    {...props}
                />
            </div>
        );
    }
);