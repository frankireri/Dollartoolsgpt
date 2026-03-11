"use client";

import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, User, Sparkles, Loader2 } from "lucide-react";

export default function AuthButton() {
    const { user, login, logout, loading, credits } = useAuth();

    if (loading) return <Loader2 className="w-5 h-5 animate-spin text-accent" />;

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full border border-accent/20">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-accent">{credits} Credits</span>
                </div>
                <div className="flex items-center gap-3 glass p-1.5 pr-4 rounded-full border border-border hover:border-accent/30 transition-all group">
                    <img
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full border border-border"
                    />
                    <div className="hidden lg:block text-left">
                        <p className="text-[10px] font-bold truncate max-w-[100px]">{user.displayName}</p>
                        <button
                            onClick={logout}
                            className="text-[9px] text-muted hover:text-red-500 flex items-center gap-1 transition-all"
                        >
                            <LogOut className="w-2 h-2" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={login}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-full font-bold text-sm hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95 group"
        >
            <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Sign In
        </button>
    );
}
