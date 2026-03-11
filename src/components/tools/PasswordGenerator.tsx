"use client";

import { useState } from "react";
import { Copy, RefreshCw, CheckCircle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [copied, setCopied] = useState(false);

    const generate = () => {
        const charset: Record<string, string> = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
        };

        let allChars = "";
        Object.keys(options).forEach(key => {
            if ((options as any)[key]) allChars += charset[key];
        });

        if (!allChars) return setPassword("Select at least one option");

        let result = "";
        for (let i = 0; i < length; i++) {
            result += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        setPassword(result);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center">
                <div className="w-full relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-background/50 border border-border rounded-2xl p-6 text-center shadow-xl">
                        <span className="text-3xl font-mono tracking-wider break-all text-foreground">{password || "P@$$w0rd123"}</span>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={generate}
                                className="p-3 glass rounded-xl hover:text-accent transition-all active:rotate-180 duration-500"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-3 glass rounded-xl hover:text-accent transition-all"
                                title="Copy"
                            >
                                {copied ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-sm">Password Length: {length}</label>
                    </div>
                    <input
                        type="range"
                        min="6"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between text-xs text-muted">
                        <span>6</span>
                        <span>64</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(options).map((key) => (
                        <label key={key} className="flex items-center gap-3 glass p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                            <input
                                type="checkbox"
                                checked={(options as any)[key]}
                                onChange={() => setOptions({ ...options, [key]: !(options as any)[key] })}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                            />
                            <span className="text-sm capitalize">{key}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 glass rounded-2xl bg-accent/5">
                {length >= 16 && options.symbols && options.numbers ? (
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                ) : length < 10 ? (
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                ) : (
                    <Shield className="w-6 h-6 text-yellow-500" />
                )}
                <p className="text-sm">
                    {length >= 16 && options.symbols && options.numbers
                        ? "Very Strong: This password would take centuries to crack."
                        : length < 10
                            ? "Weak: Consider increasing length for better security."
                            : "Medium Strength: Decent, but could be stronger."}
                </p>
            </div>
        </div>
    );
}
