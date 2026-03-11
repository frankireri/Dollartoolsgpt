"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Upload, FilePlus, Trash2, MoveUp, MoveDown, FileText, Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

export default function PDFMerger() {
    const { user } = useAuth();
    const [files, setFiles] = useState<{ file: File; id: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9)
            }));
            setFiles(prev => [...prev, ...newFiles]);
            setMergedBlob(null);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setMergedBlob(null);
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        setFiles(prev => {
            const newFiles = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newFiles.length) return prev;
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
            return newFiles;
        });
    };

    const mergePDFs = async () => {
        if (files.length < 2) return;
        setLoading(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const { file } of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            setMergedBlob(blob);
        } catch (error) {
            console.error("Merge error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!mergedBlob) return;
        const url = URL.createObjectURL(mergedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "merged_documents.pdf";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToProjects = async () => {
        if (!user || !mergedBlob) return;
        setLoading(true);
        try {
            await uploadFile({
                file: mergedBlob,
                fileName: "merged_documents.pdf",
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
                    multiple
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                    <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="font-bold">Select PDF Files</h3>
                    <p className="text-muted text-sm">Upload 2 or more PDFs to combine them</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-6">
                    <div className="space-y-3">
                        {files.map((item, idx) => (
                            <div key={item.id} className="glass p-4 rounded-2xl border border-border flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate text-sm">{item.file.name}</p>
                                    <p className="text-xs text-muted">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => moveFile(idx, 'up')}
                                        className="p-2 hover:text-accent disabled:opacity-20"
                                        disabled={idx === 0}
                                    >
                                        <MoveUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => moveFile(idx, 'down')}
                                        className="p-2 hover:text-accent disabled:opacity-20"
                                        disabled={idx === files.length - 1}
                                    >
                                        <MoveDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => removeFile(item.id)}
                                        className="p-2 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {mergedBlob ? (
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
                            onClick={mergePDFs}
                            disabled={loading || files.length < 2}
                            className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `Merge ${files.length} PDFs`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
