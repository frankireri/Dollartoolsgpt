"use client";

import { useState } from "react";
import { Copy, Trash2, CheckCircle, RefreshCw, ArrowRightLeft, ShieldCheck } from "lucide-react";

export default function URLBase64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"url-encode" | "url-decode" | "base64-encode" | "base64-decode">("url-encode");
    const [copied, setCopied] = useState(false);

    const process = () => {
        try {
            let res = "";
            switch (mode) {
                case "url-encode": res = encodeURIComponent(input); break;
                case "url-decode": res = decodeURIComponent(input); break;
                case "base64-encode": res = btoa(input); break;
                case "base64-decode": res = atob(input); break;
            }
            setOutput(res);
        } catch (e) {
            setOutput("Error: Invalid input for selected mode.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "URL Encode", val: "url-encode" },
                    { label: "URL Decode", val: "url-decode" },
                    { label: "Base64 Encode", val: "base64-encode" },
                    { label: "Base64 Decode", val: "base64-decode" }
                ].map(btn => (
                    <button
                        key={btn.val}
                        onClick={() => { setMode(btn.val as any); }}
                        className={`py-3 rounded-xl font-bold transition-all border ${mode === btn.val ? "bg-accent text-white border-accent" : "glass border-border hover:border-accent/50"}`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-muted uppercase">Input</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter text here..."
                        className="w-full h-64 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-mono"
                    />
                    <button
                        onClick={process}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all"
                    >
                        Execute {mode.split("-").join(" ")}
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-semibold text-muted uppercase">Output Result</label>
                    <div className="relative">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="w-full h-64 bg-accent/5 border border-accent/20 rounded-2xl p-6 text-accent font-mono resize-none focus:outline-none"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={handleCopy} className="p-2 glass rounded-lg hover:text-accent transition-all">
                                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button onClick={() => setOutput("")} className="p-2 glass rounded-lg hover:text-red-500 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
