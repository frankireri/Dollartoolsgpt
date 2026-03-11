"use client";

import { useState } from "react";
import { Percent, Calculator, Equal, ArrowRightLeft } from "lucide-react";

export default function PercentageCalculator() {
    const [val1, setVal1] = useState<number>(0);
    const [val2, setVal2] = useState<number>(0);
    const [result, setResult] = useState<number | null>(null);
    const [mode, setMode] = useState<"is-what-percent" | "what-is-percent">("what-is-percent");

    const calculate = () => {
        if (mode === "what-is-percent") {
            setResult(Number(((val1 / 100) * val2).toFixed(2)));
        } else {
            setResult(Number(((val1 / val2) * 100).toFixed(2)));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="flex p-1 bg-background/50 border border-border rounded-2xl mb-8">
                    <button
                        onClick={() => { setMode("what-is-percent"); setResult(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === "what-is-percent" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground"}`}
                    >
                        What is X% of Y?
                    </button>
                    <button
                        onClick={() => { setMode("is-what-percent"); setResult(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === "is-what-percent" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground"}`}
                    >
                        X is what % of Y?
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted tracking-widest">{mode === "what-is-percent" ? "Percentage (%)" : "Value X"}</label>
                            <input
                                type="number"
                                value={val1}
                                onChange={(e) => setVal1(Number(e.target.value))}
                                className="w-full bg-background/50 border border-border rounded-2xl p-5 text-2xl font-bold focus:ring-2 focus:ring-accent outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted tracking-widest">Value Y</label>
                            <input
                                type="number"
                                value={val2}
                                onChange={(e) => setVal2(Number(e.target.value))}
                                className="w-full bg-background/50 border border-border rounded-2xl p-5 text-2xl font-bold focus:ring-2 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={calculate}
                        className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Equal className="w-6 h-6" /> Calculate Result
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center">
                {result !== null ? (
                    <div className="w-full glass p-12 rounded-3xl border-accent/20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-sm font-bold uppercase text-muted mb-4 tracking-widest">Calculated Result</div>
                        <div className="text-6xl font-black text-accent mb-2">
                            {result}{mode === "is-what-percent" ? "%" : ""}
                        </div>
                        <p className="text-muted text-sm italic">
                            {mode === "what-is-percent" ? `${val1}% of ${val2} equals ${result}` : `${val1} is ${result}% of ${val2}`}
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-full glass rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                        <Percent className="w-16 h-16 opacity-10" />
                        <p>Fill in the numbers above to see the calculation result</p>
                    </div>
                )}
            </div>
        </div>
    );
}
