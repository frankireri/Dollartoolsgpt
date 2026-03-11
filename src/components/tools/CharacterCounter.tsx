"use client";

import { useState } from "react";
import { Copy, Scissors, FileText } from "lucide-react";

export default function CharacterCounter() {
    const [text, setText] = useState("");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        alert("Text copied!");
    };

    const clearText = () => setText("");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass p-6 rounded-3xl border border-border">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="w-full h-64 bg-background/50 border border-border rounded-2xl p-6 text-lg focus:outline-none focus:ring-1 focus:ring-accent"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="glass p-4 rounded-2xl text-center border-border/50">
                        <p className="text-2xl font-bold text-accent">{text.length}</p>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Characters</p>
                    </div>
                    <div className="glass p-4 rounded-2xl text-center border-border/50">
                        <p className="text-2xl font-bold text-accent">{text.replace(/\s/g, "").length}</p>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">No Spaces</p>
                    </div>
                    <div className="glass p-4 rounded-2xl text-center border-border/50">
                        <p className="text-2xl font-bold text-accent">{text.split(/\n/).filter(Boolean).length}</p>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Lines</p>
                    </div>
                    <div className="glass p-4 rounded-2xl text-center border-border/50">
                        <p className="text-2xl font-bold text-accent">{text.split(/\./).filter(Boolean).length}</p>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Sentences</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-8">
                    <button
                        onClick={copyToClipboard}
                        className="flex-1 px-6 py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/40 transition-all active:scale-95"
                    >
                        <Copy className="w-5 h-5" /> Copy Text
                    </button>
                    <button
                        onClick={clearText}
                        className="px-6 py-4 bg-card border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all active:scale-95"
                    >
                        <Scissors className="w-5 h-5" /> Clear
                    </button>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-border/50 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    How to use Character Counter
                </h3>
                <p className="text-muted leading-relaxed">
                    Simply type or paste your text into the box above. Our tool will instantly calculate the total number of characters, characters excluding spaces, number of lines, and sentences. It is perfect for social media posts, Meta descriptions, or any task with strict length limits.
                </p>
            </div>
        </div>
    );
}
