"use client";

import { useState, useEffect } from "react";
import { RefreshCw, ArrowRightLeft, DollarSign, Euro, Coins, Globe } from "lucide-react";

export default function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(100);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("KES");
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Common Currencies
    const currencies = [
        { code: "USD", name: "US Dollar", icon: "$" },
        { code: "EUR", name: "Euro", icon: "€" },
        { code: "GBP", name: "British Pound", icon: "£" },
        { code: "KES", name: "Kenyan Shilling", icon: "Ksh" },
        { code: "INR", name: "Indian Rupee", icon: "₹" },
        { code: "NGN", name: "Nigerian Naira", icon: "₦" },
        { code: "ZAR", name: "S. African Rand", icon: "R" },
    ];

    const convert = async () => {
        setLoading(true);
        try {
            // Using a simple mock conversion for MVP. 
            // In Production, we would use an API like ExchangeRate-API or OpenExchangeRates.
            const rates: Record<string, number> = {
                "USD_KES": 160.0,
                "USD_EUR": 0.92,
                "EUR_USD": 1.09,
                "KES_USD": 0.0063,
                "USD_NGN": 1450.0,
                "USD_INR": 83.0
            };

            const pair = `${from}_${to}`;
            const invPair = `${to}_${from}`;

            let rate = rates[pair] || (rates[invPair] ? 1 / rates[invPair] : 1.5); // Fallback mock

            setResult(Number((amount * rate).toFixed(2)));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted tracking-widest pl-1">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-background/50 border border-border rounded-2xl p-5 text-3xl font-bold focus:ring-1 focus:ring-accent outline-none"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-accent font-bold">{from}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted tracking-widest pl-1">From</label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none appearance-none font-bold"
                            >
                                {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted tracking-widest pl-1">To</label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none appearance-none font-bold"
                            >
                                {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={convert}
                        disabled={loading}
                        className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        {loading ? <RefreshCw className="animate-spin w-6 h-6" /> : <ArrowRightLeft className="w-6 h-6" />}
                        Convert Currency
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                {result !== null ? (
                    <div className="w-full glass p-12 rounded-3xl border-accent/20 text-center animate-in zoom-in duration-300">
                        <p className="text-muted text-xs font-bold uppercase tracking-widest mb-4">Conversion Result</p>
                        <div className="text-6xl font-black text-accent mb-4">
                            {result.toLocaleString()} <span className="text-2xl">{to}</span>
                        </div>
                        <div className="glass px-6 py-2 rounded-full inline-block text-[10px] font-bold text-muted border border-border uppercase">
                            1 {from} = {(result / amount).toFixed(4)} {to}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full glass rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                        <Globe className="w-16 h-16 opacity-10" />
                        <p>Select currencies and amount to see current exchange rates</p>
                    </div>
                )}
            </div>
        </div>
    );
}
