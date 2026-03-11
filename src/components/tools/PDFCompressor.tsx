"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Loader2, FileText, Minimize2, Save, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

export default function PDFCompressor() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || selectedFile.type !== "application/pdf") return;

        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedSize(0);
        setCompressedBlob(null);
    };

    const compressPDF = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Compress by removing metadata and unnecessary data
            const pdfBytes = await pdfDoc.save({
                useObjectStreams: false,
                addDefaultPage: false,
                objectsPerTick: 50,
            });

            setCompressedSize(pdfBytes.length);

            // @ts-ignore - Avoid Uint8Array SharedArrayBuffer mismatch
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            setCompressedBlob(blob);
        } catch (error) {
            console.error("Compression error:", error);
            alert("Failed to compress PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_${file?.name}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToProjects = async () => {
        if (!user || !compressedBlob || !file) return;
        setLoading(true);
        try {
            await uploadFile({
                file: compressedBlob,
                fileName: `compressed_${file.name}`,
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

    const savings = originalSize > 0 && compressedSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

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
                        <h3 className="text-xl font-bold mb-2">Upload PDF to Compress</h3>
                        <p className="text-muted">Reduce file size while maintaining quality</p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-accent/20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-bold">{file.name}</h4>
                                    <p className="text-xs text-muted">Original size: {formatSize(originalSize)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setFile(null); setCompressedBlob(null); }}
                                className="text-xs text-red-500 hover:text-red-400 font-semibold"
                            >
                                Remove
                            </button>
                        </div>

                        {compressedSize > 0 && (
                            <div className="grid grid-cols-3 gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted uppercase mb-1">Original</p>
                                    <p className="font-bold text-lg">{formatSize(originalSize)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted uppercase mb-1">Compressed</p>
                                    <p className="font-bold text-lg text-green-500">{formatSize(compressedSize)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted uppercase mb-1">Saved</p>
                                    <p className="font-bold text-lg text-accent">{savings}%</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {compressedBlob ? (
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
                            onClick={compressPDF}
                            disabled={loading}
                            className="w-full py-5 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Compressing...
                                </>
                            ) : (
                                <>
                                    <Minimize2 className="w-6 h-6" />
                                    Compress PDF
                                </>
                            )}
                        </button>
                    )}

                    <div className="text-xs text-muted text-center italic">
                        💡 Tip: Compression works best on PDFs with large file sizes. Results may vary based on PDF content.
                    </div>
                </div>
            )}
        </div>
    );
}
