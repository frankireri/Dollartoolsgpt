"use client";

import { useState } from "react";
import { Calendar, User, Clock, Star, Gift } from "lucide-react";

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState("");
    const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

    const calculateAge = () => {
        if (!birthDate) return;

        const birth = new Date(birthDate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            months -= 1;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        setAge({ years, months, days });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase text-muted flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" /> Date of Birth
                    </label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl p-6 focus:ring-1 focus:ring-accent outline-none"
                    />
                    <button
                        onClick={calculateAge}
                        className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3"
                    >
                        <Star className="w-6 h-6" /> Calculate Age
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {age ? (
                    <div className="glass p-8 rounded-3xl border-accent/20 space-y-8 animate-in zoom-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Your Age</h3>
                                <p className="text-muted text-sm">Calculated to this very day</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="glass p-6 rounded-2xl text-center border-accent/10">
                                <div className="text-4xl font-bold text-accent mb-1">{age.years}</div>
                                <div className="text-[10px] font-bold uppercase text-muted tracking-widest">Years</div>
                            </div>
                            <div className="glass p-6 rounded-2xl text-center border-accent/10">
                                <div className="text-4xl font-bold text-accent mb-1">{age.months}</div>
                                <div className="text-[10px] font-bold uppercase text-muted tracking-widest">Months</div>
                            </div>
                            <div className="glass p-6 rounded-2xl text-center border-accent/10">
                                <div className="text-4xl font-bold text-accent mb-1">{age.days}</div>
                                <div className="text-[10px] font-bold uppercase text-muted tracking-widest">Days</div>
                            </div>
                        </div>

                        <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center gap-4">
                            <Gift className="w-6 h-6 text-accent" />
                            <p className="text-xs text-muted">
                                Your next birthday is in **{11 - age.months} months** and **{30 - age.days} days**.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full glass rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                        <Clock className="w-16 h-16 opacity-10" />
                        <p>Select your birthday to find out exactly how old you are</p>
                    </div>
                )}
            </div>
        </div>
    );
}
