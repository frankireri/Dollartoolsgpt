"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Scale, Ruler, Thermometer, Calculator } from "lucide-react";

const conversionData: any = {
    length: {
        meters: 1,
        kilometers: 0.001,
        centimeters: 100,
        millimeters: 1000,
        inches: 39.3701,
        feet: 3.28084,
        yards: 1.09361,
        miles: 0.000621371
    },
    weight: {
        kilograms: 1,
        grams: 1000,
        milligrams: 1000000,
        pounds: 2.20462,
        ounces: 35.274
    }
};

export default function UnitConverter() {
    const [type, setType] = useState("length");
    const [fromUnit, setFromUnit] = useState("meters");
    const [toUnit, setToUnit] = useState("kilometers");
    const [fromValue, setFromValue] = useState("1");
    const [toValue, setToValue] = useState("");

    useEffect(() => {
        const val = parseFloat(fromValue);
        if (isNaN(val)) {
            setToValue("");
            return;
        }

        const baseValue = val / conversionData[type][fromUnit];
        const result = baseValue * conversionData[type][toUnit];
        setToValue(result.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }, [fromValue, fromUnit, toUnit, type]);

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setFromValue(toValue.replace(/,/g, ''));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => { setType("length"); setFromUnit("meters"); setToUnit("kilometers"); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${type === "length" ? "bg-accent text-white" : "glass hover:bg-white/5"}`}
                >
                    <Ruler className="w-5 h-5" /> Length
                </button>
                <button
                    onClick={() => { setType("weight"); setFromUnit("kilograms"); setToUnit("pounds"); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${type === "weight" ? "bg-accent text-white" : "glass hover:bg-white/5"}`}
                >
                    <Scale className="w-5 h-5" /> Weight
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6">
                <div className="space-y-4">
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                        {Object.keys(conversionData[type]).map(unit => (
                            <option key={unit} value={unit} className="bg-[#0f172a] capitalize">{unit}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-center"
                        placeholder="0"
                    />
                </div>

                <button
                    onClick={handleSwap}
                    className="p-4 glass rounded-full hover:text-accent hover:rotate-180 transition-all duration-500"
                >
                    <ArrowRightLeft className="w-6 h-6" />
                </button>

                <div className="space-y-4">
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                        {Object.keys(conversionData[type]).map(unit => (
                            <option key={unit} value={unit} className="bg-[#0f172a] capitalize">{unit}</option>
                        ))}
                    </select>
                    <div className="w-full text-4xl font-bold text-accent text-center truncate px-4">
                        {toValue || "0"}
                    </div>
                </div>
            </div>

            <div className="p-4 glass rounded-2xl bg-accent/5 text-center text-sm text-muted">
                Converting from <span className="text-foreground font-semibold capitalize">{fromUnit}</span> to <span className="text-foreground font-semibold capitalize">{toUnit}</span>.
            </div>
        </div>
    );
}
