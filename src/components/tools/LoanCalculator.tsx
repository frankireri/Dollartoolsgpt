"use client";

import { useState } from "react";
import { Calculator, DollarSign, Calendar, Percent, Landmark } from "lucide-react";

export default function LoanCalculator() {
    const [amount, setAmount] = useState<number>(10000);
    const [interest, setInterest] = useState<number>(5);
    const [years, setYears] = useState<number>(5);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
    const [totalPayment, setTotalPayment] = useState<number | null>(null);
    const [totalInterest, setTotalInterest] = useState<number | null>(null);

    const calculateLoan = () => {
        const principal = amount;
        const calculateInterest = interest / 100 / 12;
        const calculatePayments = years * 12;

        const x = Math.pow(1 + calculateInterest, calculatePayments);
        const monthly = (principal * x * calculateInterest) / (x - 1);

        if (isFinite(monthly)) {
            setMonthlyPayment(Number(monthly.toFixed(2)));
            setTotalPayment(Number((monthly * calculatePayments).toFixed(2)));
            setTotalInterest(Number((monthly * calculatePayments - principal).toFixed(2)));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted flex items-center gap-2">
                            <DollarSign className="w-3 h-3" /> Loan Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted flex items-center gap-2">
                            <Percent className="w-3 h-3" /> Annual Interest (%)
                        </label>
                        <input
                            type="number"
                            value={interest}
                            onChange={(e) => setInterest(Number(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Loan Term (Years)
                        </label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>
                    <button
                        onClick={calculateLoan}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" /> Calculate
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {monthlyPayment !== null ? (
                    <div className="glass p-8 rounded-3xl border-accent/20 space-y-8 animate-in zoom-in duration-300">
                        <div className="text-center">
                            <div className="text-xs font-bold uppercase text-muted mb-2">Monthly Payment</div>
                            <div className="text-5xl font-bold text-accent">${monthlyPayment}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-background/50 border border-border">
                                <div className="text-xs text-muted uppercase mb-1">Total Payment</div>
                                <div className="font-bold text-lg">${totalPayment}</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-background/50 border border-border">
                                <div className="text-xs text-muted uppercase mb-1">Total Interest</div>
                                <div className="font-bold text-lg">${totalInterest}</div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center gap-4 text-xs text-muted">
                            <Landmark className="w-8 h-8 text-accent opacity-20" />
                            <p>This is an estimate. Actual bank rates and terms may vary based on credit score and local regulations.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full glass rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                        <Calculator className="w-16 h-16 opacity-10" />
                        <p>Enter loan details to see your repayment schedule</p>
                    </div>
                )}
            </div>
        </div>
    );
}
