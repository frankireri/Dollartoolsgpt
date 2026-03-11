"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ListChecks, RefreshCw, Copy, CheckCircle, BookOpen, Loader2 } from "lucide-react";

export default function AISummarizer() {
    const { useCredit } = useAuth();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState<"Bullet Points" | "One Paragraph" | "Detailed">("Bullet Points");
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!input) return;

        setLoading(true);
        const success = await useCredit();

        if (!success) {
            setLoading(false);
            return;
        }

        try {
            await new Promise(r => setTimeout(r, 2500));

            let result = "";
            if (length === "Bullet Points") {
                result = "• Key Point 1: The core focus of this text is about enhancing efficiency.\n• Key Point 2: It highlights the importance of user-centric design.\n• Key Point 3: The conclusion suggests a move toward automation.";
            } else if (length === "One Paragraph") {
                result = "This article essentially argues that modern digital tools must balance power with simplicity. It outlines how user behavior is shifting toward instant gratification, necessitating faster processing and more intuitive interfaces while maintaining high security standards.";
            } else {
                result = "Summary Executive Report:\n\n1. Context: The article explores the intersection of AI and daily productivity.\n2. Methodology: It analyzes data from over 1,000 users across diverse sectors.\n3. Findings: AI-assisted workflows are 40% faster on average.\n4. Recommendations: Organizations should adopt AI in stages rather than all at once.";
            }

            setOutput(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
                {["Bullet Points", "One Paragraph", "Detailed"].map(l => (
                    <button
                        key={l}
                        onClick={() => setLength(l as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${length === l ? "bg-accent text-white border-accent" : "glass border-border hover:border-accent/50"}`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-muted tracking-wider">Paste Article / Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste long text or article content here..."
                        className="w-full h-80 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none shadow-inner"
                    />
                    <button
                        onClick={handleSummarize}
                        disabled={loading || !input}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        Summarize (1 Credit)
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-muted tracking-wider">AI Summary</label>
                    <div className="relative h-80">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Summary will be generated here..."
                            className="w-full h-full bg-accent/5 border border-accent/20 rounded-2xl p-6 text-accent font-medium resize-none focus:outline-none whitespace-pre-line"
                        />
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 p-2 glass rounded-lg hover:text-accent transition-all"
                            >
                                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
