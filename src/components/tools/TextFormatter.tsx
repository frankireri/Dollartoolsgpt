"use client";

import { useState } from "react";
import { Copy, Trash2, CheckCircle, Scissors, AlignLeft, Sparkles } from "lucide-react";

export default function TextFormatter() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const cleanExtraSpaces = () => {
        setText(text.replace(/\s+/g, ' ').trim());
    };

    const removeSymbols = () => {
        setText(text.replace(/[^a-zA-Z0-9\s]/g, ''));
    };

    const trimLines = () => {
        setText(text.split('\n').map(line => line.trim()).join('\n'));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={cleanExtraSpaces}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-lg hover:shadow-accent/40 transition-all"
                >
                    <Sparkles className="w-5 h-5" /> Clean Spaces
                </button>
                <button
                    onClick={removeSymbols}
                    className="flex items-center gap-2 px-6 py-3 glass border-border hover:border-accent/50 rounded-xl font-bold transition-all"
                >
                    <Scissors className="w-5 h-5" /> Remove Symbols
                </button>
                <button
                    onClick={trimLines}
                    className="flex items-center gap-2 px-6 py-3 glass border-border hover:border-accent/50 rounded-xl font-bold transition-all"
                >
                    <AlignLeft className="w-5 h-5" /> Trim Lines
                </button>
                <div className="flex-1" />
                <button onClick={handleCopy} className="p-3 glass rounded-xl hover:text-accent transition-all">
                    {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button onClick={() => setText("")} className="p-3 glass rounded-xl hover:text-red-500 transition-all">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste messy text here to clean it up..."
                className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-mono"
            />
        </div>
    );
}
