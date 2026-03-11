"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Upload, Scissors, FileText, Loader2, List, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

export default function PDFSplitter() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageRange, setPageRange] = useState("");
    const [splitBlob, setSplitBlob] = useState<Blob | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSplitBlob(null);
        }
    };

    const splitPDF = async () => {
        if (!file || !pageRange) return;
        setLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            const totalPages = pdf.getPageCount();
            const ranges = pageRange.split(",").map(r => r.trim());
            const pagesToInclude: number[] = [];

            ranges.forEach(range => {
                if (range.includes("-")) {
                    const [start, end] = range.split("-").map(Number);
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= totalPages) pagesToInclude.push(i - 1);
                    }
                } else {
                    const p = Number(range);
                    if (p > 0 && p <= totalPages) pagesToInclude.push(p - 1);
                }
            });

            if (pagesToInclude.length === 0) throw new Error("Invalid page range");

            const copiedPages = await newPdf.copyPages(pdf, pagesToInclude);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            setSplitBlob(blob);
        } catch (error) {
            console.error("Split error:", error);
            alert("Error: Check your page range (e.g. 1,3,5-7)");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!splitBlob) return;
        const url = URL.createObjectURL(splitBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `split_${file?.name}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToProjects = async () => {
        if (!user || !splitBlob || !file) return;
        setLoading(true);
        try {
            await uploadFile({
                file: splitBlob,
                fileName: `split_${file.name}`,
                toolType: "pdf"
            });
            alert("Project saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="relative group">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                    <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="font-bold">{file ? file.name : "Select PDF File"}</h3>
                    <p className="text-muted text-sm">Upload a PDF to extract pages</p>
                </div>
            </div>

            {file && (
                <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <List className="w-4 h-4 text-accent" /> Pages to Extract (e.g., 1, 3, 5-8)
                        </label>
                        <input
                            type="text"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            placeholder="1, 3, 5-10"
                            className="w-full bg-background/50 border border-border rounded-2xl p-4 focus:ring-1 focus:ring-accent outline-none font-mono"
                        />
                    </div>

                    {splitBlob ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleDownload}
                                className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Download className="w-6 h-6" />
                                Download PDF
                            </button>
                            {user && (
                                <button
                                    onClick={handleSaveToProjects}
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-6 h-6" />
                                    Save to Projects
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={splitPDF}
                            disabled={loading || !pageRange}
                            className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Extract Pages"}
                        </button>
                    )}
                </div>
            )}

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <Scissors className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm text-muted">
                    Specify the page numbers you want to keep. Separate individual pages with commas and use a hyphen for ranges.
                </p>
            </div>
        </div>
    );
}
