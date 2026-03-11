"use client";

import { useState } from "react";
import { Activity, Scale, Ruler, Info, AlertTriangle } from "lucide-react";

export default function BMICalculator() {
    const [weight, setWeight] = useState<number>(70);
    const [height, setHeight] = useState<number>(170);
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string>("");

    const calculateBMI = () => {
        const heightInMeters = height / 100;
        const res = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
        setBmi(res);

        if (res < 18.5) setCategory("Underweight");
        else if (res < 25) setCategory("Healthy weight");
        else if (res < 30) setCategory("Overweight");
        else setCategory("Obese");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-muted flex items-center gap-2">
                            <Scale className="w-3 h-3 text-accent" /> Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-2xl p-4 text-xl font-bold focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-muted flex items-center gap-2">
                            <Ruler className="w-3 h-3 text-accent" /> Height (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-2xl p-4 text-xl font-bold focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={calculateBMI}
                    className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3"
                >
                    <Activity className="w-6 h-6" /> Calculate BMI
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {bmi !== null ? (
                    <div className="glass p-8 rounded-3xl border-accent/20 text-center animate-in zoom-in duration-300">
                        <div className="text-[10px] font-bold uppercase text-muted tracking-widest mb-2">Your BMI Score</div>
                        <div className="text-7xl font-black text-accent mb-4">{bmi}</div>
                        <div className={`inline-block px-6 py-2 rounded-full font-bold text-sm ${category === "Healthy weight" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                            }`}>
                            Category: {category}
                        </div>

                        <div className="mt-8 pt-8 border-t border-border grid grid-cols-4 gap-1 text-[8px] font-bold uppercase text-muted">
                            <div className={bmi < 18.5 ? "text-accent" : ""}>Under<br />&lt;18.5</div>
                            <div className={bmi >= 18.5 && bmi < 25 ? "text-accent" : ""}>Healthy<br />18.5-25</div>
                            <div className={bmi >= 25 && bmi < 30 ? "text-accent" : ""}>Over<br />25-30</div>
                            <div className={bmi >= 30 ? "text-accent" : ""}>Obese<br />&gt;30</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 glass rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                        <Scale className="w-16 h-16 opacity-10" />
                        <p>Know your Body Mass Index by filling in the details</p>
                    </div>
                )}

                <div className="p-4 glass rounded-2xl bg-orange-500/5 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <p className="text-[10px] text-muted leading-relaxed">
                        **Disclaimer:** BMI is a general indicator and does not account for muscle mass, bone density, or overall body composition. Consult a professional for a detailed health analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
