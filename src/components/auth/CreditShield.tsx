"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock, Zap, LogIn, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreditShield({ children, slug }: { children: React.ReactNode; slug: string }) {
    const { user, login, credits, subscription, loading } = useAuth();

    // Free tools list
    const freeTools = ["word-counter", "case-converter", "lorem-ipsum", "text-formatter"];
    const isFree = freeTools.includes(slug);

    if (isFree) return <>{children}</>;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-accent/20 mb-4" />
                <div className="h-4 w-32 bg-accent/10 rounded-full" />
            </div>
        );
    }

    if (!user) {
        // ... (login required UI)
        return (
            <div className="max-w-xl mx-auto py-12 px-6 glass rounded-3xl border-accent/20 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent">
                    <Lock className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold">Login required</h2>
                    <p className="text-muted">You need to sign in to use this advanced tool. New users get <span className="text-accent font-bold">2 free credits</span>!</p>
                </div>
                <button
                    onClick={login}
                    className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/40 mx-auto transition-all active:scale-95"
                >
                    <LogIn className="w-6 h-6" /> Sign in with Google
                </button>
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 50+ Tools</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Powered</span>
                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> M-Pesa Ready</span>
                </div>
            </div>
        );
    }

    // Grant access if subscription is active OR user has credits
    const hasAccess = subscription?.status === "active" || credits >= 1;

    if (!hasAccess) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6 glass rounded-3xl border-orange-500/20 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto text-orange-500">
                    <Zap className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold">Access Required</h2>
                    <p className="text-muted">You need an active subscription or credits to use our premium tools.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 text-center"
                    >
                        <Lock className="w-4 h-4" /> Subscribe for $1/mo
                    </Link>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-card border border-border rounded-2xl font-bold text-sm hover:border-accent/50 transition-all active:scale-95 text-center"
                    >
                        <CreditCard className="w-4 h-4" /> Buy Credits (from 20 KES)
                    </Link>
                </div>
                <p className="text-[10px] text-muted italic">Monthly Pro subscribers get unlimited access to all 50+ tools.</p>
            </div>
        );
    }

    return <>{children}</>;
}
