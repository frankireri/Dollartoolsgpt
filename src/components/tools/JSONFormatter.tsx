"use client";

import { useState } from "react";
import { Copy, Trash2, CheckCircle, AlertTriangle, Code, Minimize } from "lucide-react";

export default function JSONFormatter() {
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const minifyJSON = () => {
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed));
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput("");
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={formatJSON}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-lg hover:shadow-accent/40 transition-all active:scale-95"
                >
                    <Code className="w-5 h-5" /> Beantify
                </button>
                <button
                    onClick={minifyJSON}
                    className="flex items-center gap-2 px-6 py-3 glass hover:bg-white/5 rounded-xl font-bold transition-all active:scale-95"
                >
                    <Minimize className="w-5 h-5" /> Minify
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleCopy}
                    className="p-3 glass rounded-xl hover:text-accent transition-all active:scale-95"
                    title="Copy JSON"
                >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                    onClick={handleClear}
                    className="p-3 glass rounded-xl hover:text-red-500 transition-all active:scale-95"
                    title="Clear"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Paste your JSON here (e.g. {"name": "test"})'
                    className={`w-full h-[500px] bg-background/50 border ${error ? "border-red-500/50" : "border-border"} rounded-2xl p-6 font-mono text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none shadow-inner`}
                />

                {error && (
                    <div className="absolute top-4 right-4 animate-in slide-in-from-right">
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-md">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-muted">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : input ? "bg-green-500" : "bg-muted"}`} />
                    <span>{error ? "Invalid JSON" : input ? "Valid JSON structure" : "Empty Input"}</span>
                </div>
                <span>Fast, client-side processing.</span>
            </div>
        </div>
    );
}
