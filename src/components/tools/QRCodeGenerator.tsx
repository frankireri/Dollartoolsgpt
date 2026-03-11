"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Type, Link as LinkIcon, Wifi, Smartphone } from "lucide-react";

export default function QRCodeGenerator() {
    const [value, setValue] = useState("https://dollartools.com");
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState("#8b5cf6");
    const [bgColor, setBgColor] = useState("#ffffff");
    const svgRef = useRef<SVGSVGElement>(null);

    const downloadQR = () => {
        if (!svgRef.current) return;

        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx?.drawImage(img, 0, 0);
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = "qrcode.png";
            link.href = url;
            link.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">QR Content</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                            placeholder="Enter URL or text..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">QR Color</label>
                        <input
                            type="color"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer bg-background/50 border border-border p-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Background</label>
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer bg-background/50 border border-border p-1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Size: {size}px</label>
                    <input
                        type="range"
                        min="128"
                        max="512"
                        step="64"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={downloadQR}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" /> Download PNG
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center glass p-8 rounded-3xl border-dashed border-2 border-border">
                <div className="p-4 bg-white rounded-2xl shadow-2xl">
                    <QRCodeSVG
                        value={value}
                        size={size}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level="H"
                        includeMargin={true}
                        ref={svgRef}
                    />
                </div>
                <p className="mt-8 text-sm text-muted text-center italic">
                    High-quality vector QR code. Adjust colors and size using the controls on the left.
                </p>
            </div>
        </div>
    );
}
