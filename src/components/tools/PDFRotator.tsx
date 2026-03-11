"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw, Upload, Download, Loader2, FileText, RefreshCw, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

export default function PDFRotator() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [rotation, setRotation] = useState<number>(90);
    const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || selectedFile.type !== "application/pdf") return;

        setFile(selectedFile);
        setRotatedBlob(null);

        // Get page count
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPageCount(pdfDoc.getPageCount());
    };

    const rotateAllPages = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            pages.forEach(page => {
                page.setRotation(degrees(rotation));
            });

            const pdfBytes = await pdfDoc.save();
            // @ts-ignore
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            setRotatedBlob(blob);
        } catch (error) {
            console.error("Rotation error:", error);
            alert("Failed to rotate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!rotatedBlob) return;
        const url = URL.createObjectURL(rotatedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rotated_${file?.name}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToProjects = async () => {
        if (!user || !rotatedBlob || !file) return;
        setLoading(true);
        try {
            await uploadFile({
                file: rotatedBlob,
                fileName: `rotated_${file.name}`,
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
            {!file ? (
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center hover:border-accent/50 transition-all group cursor-pointer">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                        <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload PDF to Rotate</h3>
                        <p className="text-muted">Click to browse or drag and drop your PDF file</p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-accent/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h4 className="font-bold">{file.name}</h4>
                                <p className="text-xs text-muted">{pageCount} pages</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-xs text-red-500 hover:text-red-400 font-semibold"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[90, 180, 270].map((deg) => (
                            <button
                                key={deg}
                                onClick={() => setRotation(deg)}
                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${rotation === deg
                                    ? "bg-accent text-white border-accent"
                                    : "glass border-border hover:border-accent/50"
                                    }`}
                            >
                                <RotateCw className="w-8 h-8" style={{ transform: `rotate(${deg}deg)` }} />
                                <span className="font-bold">Rotate {deg}°</span>
                            </button>
                        ))}
                    </div>

                    {rotatedBlob ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleDownload}
                                className="w-full py-5 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg"
                            >
                                <Download className="w-6 h-6" />
                                Download PDF
                            </button>
                            {user && (
                                <button
                                    onClick={handleSaveToProjects}
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg"
                                >
                                    <Save className="w-6 h-6" />
                                    Save to Projects
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={rotateAllPages}
                            disabled={loading}
                            className="w-full py-5 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Rotating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-6 h-6" />
                                    Rotate PDF
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
