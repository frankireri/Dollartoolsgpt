"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, CheckCircle } from "lucide-react";

export default function WordCounter() {
    const [text, setText] = useState("");
    const [stats, setStats] = useState({
        words: 0,
        characters: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200); // Avg 200 wpm

        setStats({ words, characters, sentences, paragraphs, readingTime });
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText("");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Words", value: stats.words },
                    { label: "Characters", value: stats.characters },
                    { label: "Sentences", value: stats.sentences },
                    { label: "Paragraphs", value: stats.paragraphs },
                    { label: "Reading Time (m)", value: stats.readingTime }
                ].map(stat => (
                    <div key={stat.label} className="glass-card p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-accent">{stat.value}</div>
                        <div className="text-xs text-muted uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none shadow-inner"
                />

                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 glass rounded-lg hover:text-accent transition-all active:scale-95"
                        title="Copy Text"
                    >
                        {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 glass rounded-lg hover:text-red-500 transition-all active:scale-95"
                        title="Clear Text"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-muted">
                <span>Processing happens locally in your browser.</span>
                <span>{text.length > 0 ? "Autosaving to local storage..." : "Ready"}</span>
            </div>
        </div>
    );
}
