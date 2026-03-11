"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Zap, CreditCard, CheckCircle, Loader2, Sparkles, Globe, Lock } from "lucide-react";
import { usePaystack } from "@/hooks/usePaystack";

export default function CreditShop() {
    const { user, login } = useAuth();
    const { initializePayment } = usePaystack();
    const [loading, setLoading] = useState(false);

    // Simplified to just one membership plan
    const membershipPlan = {
        kes: 100,
        credits: "Unlimited",
        label: "Monthly Pro",
        planCode: "PLN_bnhtl7n29i443b3"
    };

    const handleCheckout = async () => {
        if (!user) return login();

        setLoading(true);
        try {
            const data = await initializePayment({
                email: user.email || `${user.uid}@dollartools.com`,
                // We pass amount even for subscription to ensure it's exactly 100 KES ($1) 
                // in case the plan code isn't fully configured in sandbox
                amount: 100,
                plan: membershipPlan.planCode,
                callbackUrl: `${window.location.origin}/projects`,
                metadata: {
                    userId: user.uid,
                    plan: membershipPlan.label,
                    source: "dollartools_gpt"
                }
            });

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            }
        } catch (e: any) {
            console.error("Checkout Error:", e);
            const errorMessage = e.details ? `${e.message}: ${e.details}` : e.message;
            alert(`Payment failed: ${errorMessage || "Please try again later"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase mb-4">
                    <Sparkles className="w-3 h-3" /> Get Full Access
                </div>
                <h2 className="text-4xl font-extrabold mb-4">One Simple Membership</h2>
                <p className="text-muted max-w-lg mx-auto italic">
                    Unlock all 30+ premium tools, AI features, and cloud storage for just $1 per month.
                </p>
            </div>

            <div className="max-w-md mx-auto">
                <div className="glass-card p-10 rounded-3xl border border-accent ring-1 ring-accent/20 scale-105 shadow-2xl shadow-accent/10 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Lock className="w-24 h-24" />
                    </div>

                    <h3 className="text-3xl font-black mb-2">{membershipPlan.label}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-6xl font-black gradient-text">{membershipPlan.credits}</span>
                        <span className="text-muted font-bold">/ Month</span>
                    </div>

                    <div className="space-y-4 mb-8">
                        {[
                            "Unlimited access to 30+ tools",
                            "AI Content Rewriting & Summaries",
                            "PDF Editor with Cloud Storage",
                            "Priority Tool Updates",
                            "M-Pesa, Card & Card Payments"
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-4xl font-black text-accent mb-8">
                        KES {membershipPlan.kes}
                        <span className="text-sm text-muted font-normal ml-2">($1.00 USD)</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl shadow-xl shadow-accent/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                        Unlock Pro Access
                    </button>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-4 grayscale opacity-50">
                        <div className="h-4 bg-green-500 px-2 rounded text-[8px] flex items-center justify-center font-bold text-white">M-PESA</div>
                        <CreditCard className="w-4 h-4" />
                        <Globe className="w-4 h-4" />
                    </div>

                    <p className="text-[10px] text-center text-muted uppercase tracking-widest font-bold mt-4">Secure Checkout by Paystack</p>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                <div className="space-y-2">
                    <h4 className="font-bold">Instant Activation</h4>
                    <p className="text-xs text-muted">Tools are unlocked precisely 3 seconds after payment confirmation.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold">Cancel Anytime</h4>
                    <p className="text-xs text-muted">No contracts. Manage your subscription directly from your project dashboard.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold">Pay via M-Pesa</h4>
                    <p className="text-xs text-muted">Choose M-Pesa on the checkout page for instant local payment.</p>
                </div>
            </div>
        </div>
    );
}
