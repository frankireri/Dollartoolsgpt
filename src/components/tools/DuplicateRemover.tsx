"use client";

import { useState } from "react";
import { Copy, Trash2, CheckCircle, ListFilter, Scissors } from "lucide-react";

export default function DuplicateRemover() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const removeDuplicates = () => {
        const lines = text.split(/\n/);
        const uniqueLines = Array.from(new Set(lines.map(l => l.trim()).filter(l => l.length > 0)));
        setText(uniqueLines.join("\n"));
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
                    onClick={removeDuplicates}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-lg hover:shadow-accent/40 transition-all active:scale-95"
                >
                    <ListFilter className="w-5 h-5" /> Remove Duplicates
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
                placeholder="Paste lists or text lines here..."
                className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-mono"
            />
        </div>
    );
}
