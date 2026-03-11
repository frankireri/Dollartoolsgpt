"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, RefreshCw, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AIRewriter() {
    const { useCredit, credits } = useAuth();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState("Professional");
    const [copied, setCopied] = useState(false);

    const handleRewrite = async () => {
        if (!input) return;

        setLoading(true);
        const success = await useCredit();

        if (!success) {
            setLoading(false);
            return;
        }

        try {
            // In a real app, this would call an OpenAI/Gemini API via a Route Handler
            // For now, we simulate a sophisticated rewrite based on tone
            await new Promise(r => setTimeout(r, 2000));

            let result = "";
            const text = input.trim();

            if (tone === "Professional") {
                result = `Please find the revised version of your text: "${text}". I have ensured the language is polished and suitable for a corporate environment.`;
            } else if (tone === "Creative") {
                result = `Imagine a world where your ideas shine brighter! Here's a creative spin on your input: "${text.split(" ").reverse().join(" ")}"... just kidding! I've enhanced the flow and vocabulary of your passage: "${text}" to feel more vibrant.`;
            } else {
                result = `Hey! Here's a casual way to say that: "${text.toLowerCase().replace(/[.!?]/g, "")}, you know?"`;
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
                {["Professional", "Creative", "Casual", "Shorten", "Expand"].map(t => (
                    <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${tone === t ? "bg-accent text-white border-accent" : "glass border-border hover:border-accent/50"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-muted tracking-wider">Original Content</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your text here to rewrite..."
                        className="w-full h-64 bg-background/50 border border-border rounded-2xl p-6 text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none shadow-inner"
                    />
                    <button
                        onClick={handleRewrite}
                        disabled={loading || !input}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                        Rewrite (1 Credit)
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-muted tracking-wider">AI Rewritten Version</label>
                    <div className="relative group/output">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Your rewritten text will appear here..."
                            className="w-full h-64 bg-accent/5 border border-accent/20 rounded-2xl p-6 text-accent font-medium resize-none focus:outline-none"
                        />
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 p-2 glass rounded-lg hover:text-accent transition-all"
                            >
                                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        )}
                        <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[10px] text-accent/60 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            AI-generated content may require human review.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
