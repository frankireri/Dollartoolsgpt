"use client";

import { useState } from "react";
import { Search, TextQuote, BarChart2, Hash, Trash2 } from "lucide-react";

export default function KeywordDensityChecker() {
    const [text, setText] = useState("");
    const [results, setResults] = useState<{ word: string; count: number; density: number }[]>([]);

    const analyzeText = () => {
        if (!text.trim()) return;

        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 3); // Filter short words/stop words

        const totalWords = words.length;
        const counts: Record<string, number> = {};

        words.forEach(w => {
            counts[w] = (counts[w] || 0) + 1;
        });

        const sorted = Object.entries(counts)
            .map(([word, count]) => ({
                word,
                count,
                density: Number(((count / totalWords) * 100).toFixed(2))
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        setResults(sorted);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase text-muted flex items-center gap-2">
                        <TextQuote className="w-4 h-4" /> Content to Analyze
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your article or copy here..."
                        className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 focus:ring-1 focus:ring-accent outline-none resize-none"
                    />
                    <button
                        onClick={analyzeText}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all"
                    >
                        Analyze Keyword Density
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase text-muted flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" /> Analysis Results
                    </label>
                    <div className="glass rounded-2xl border border-border overflow-hidden h-80 overflow-y-auto scrollbar-hide">
                        {results.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-accent/5 border-b border-border">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase">Keyword</th>
                                        <th className="p-4 text-xs font-bold uppercase">Count</th>
                                        <th className="p-4 text-xs font-bold uppercase text-right">Density</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((res, idx) => (
                                        <tr key={idx} className="hover:bg-accent/5 transition-all">
                                            <td className="p-4 text-sm font-medium">{res.word}</td>
                                            <td className="p-4 text-sm font-mono">{res.count}</td>
                                            <td className="p-4 text-sm font-mono text-right text-accent">{res.density}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted gap-4 text-center p-8">
                                <Search className="w-12 h-12 opacity-10" />
                                <p>Enter text and click analyze to see word frequencies</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <Hash className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm text-muted">
                    We ignore common stop words and focus on keywords with 4 or more characters to give you accurate SEO insights.
                </p>
            </div>
        </div>
    );
}
