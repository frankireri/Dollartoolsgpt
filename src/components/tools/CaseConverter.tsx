"use client";

import { useState } from "react";
import { Copy, Trash2, CheckCircle, Type, ArrowDown, ArrowUp, CaseUpper, CaseLower } from "lucide-react";

export default function CaseConverter() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const convert = (type: string) => {
        switch (type) {
            case "upper": setText(text.toUpperCase()); break;
            case "lower": setText(text.toLowerCase()); break;
            case "title":
                setText(text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
                break;
            case "sentence":
                setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()));
                break;
            case "camel":
                setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
                break;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
                {[
                    { icon: <CaseUpper className="w-4 h-4" />, label: "UPPERCASE", type: "upper" },
                    { icon: <CaseLower className="w-4 h-4" />, label: "lowercase", type: "lower" },
                    { icon: <Type className="w-4 h-4" />, label: "Title Case", type: "title" },
                    { icon: <ArrowUp className="w-4 h-4" />, label: "Sentence case", type: "sentence" },
                    { icon: <ArrowDown className="w-4 h-4" />, label: "camelCase", type: "camel" }
                ].map(btn => (
                    <button
                        key={btn.type}
                        onClick={() => convert(btn.type)}
                        className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    >
                        {btn.icon} {btn.label}
                    </button>
                ))}
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
                placeholder="Type or paste your text here..."
                className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
            />
        </div>
    );
}
