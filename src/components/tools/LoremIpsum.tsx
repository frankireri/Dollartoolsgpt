"use client";

import { useState } from "react";
import { Copy, RefreshCw, FileText } from "lucide-react";

export default function LoremIpsum() {
    const [paragraphs, setParagraphs] = useState(3);
    const [text, setText] = useState("");

    const generateText = () => {
        const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";
        let generated = "";
        for (let i = 0; i < paragraphs; i++) {
            generated += base + "\n\n";
        }
        setText(generated.trim());
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass p-6 rounded-3xl border border-border">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Number of Paragraphs</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={paragraphs}
                            onChange={(e) => setParagraphs(parseInt(e.target.value))}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <div className="flex justify-between text-xs text-muted mt-2">
                            <span>1</span>
                            <span>{paragraphs} Paragraphs</span>
                            <span>10</span>
                        </div>
                    </div>
                    <button
                        onClick={generateText}
                        className="w-full sm:w-auto px-6 py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/40 transition-all active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" /> Generate
                    </button>
                </div>

                {text && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative">
                            <textarea
                                readOnly
                                value={text}
                                rows={12}
                                className="w-full bg-background/50 border border-border rounded-2xl p-6 font-serif text-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 p-3 bg-accent text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
                                title="Copy to Clipboard"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {!text && (
                    <div className="py-20 text-center opacity-20">
                        <FileText className="w-16 h-16 mx-auto mb-4" />
                        <p>Generate some placeholder text</p>
                    </div>
                )}
            </div>
        </div>
    );
}
