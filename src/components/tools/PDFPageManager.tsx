"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Loader2, FileText, Trash2, GripVertical, Save, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

interface PagePreview {
    index: number;
    thumbnail: string;
}

export default function PDFPageManager() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PagePreview[]>([]);
    const [loading, setLoading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [managedBlob, setManagedBlob] = useState<Blob | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || selectedFile.type !== "application/pdf") return;

        setFile(selectedFile);
        setManagedBlob(null);
        setLoading(true);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            // Create page previews
            const previews: PagePreview[] = Array.from({ length: pageCount }, (_, i) => ({
                index: i,
                thumbnail: `data:image/svg+xml,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280"><rect width="200" height="280" fill="#1a1a2e"/><text x="50%" y="50%" text-anchor="middle" fill="#fff" font-size="48" font-family="Arial">${i + 1}</text></svg>`
                )}`
            }));

            setPages(previews);
        } catch (error) {
            console.error("PDF load error:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePage = (index: number) => {
        setPages(pages.filter((_, i) => i !== index));
        setManagedBlob(null);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newPages = [...pages];
        const draggedPage = newPages[draggedIndex];
        newPages.splice(draggedIndex, 1);
        newPages.splice(index, 0, draggedPage);

        setPages(newPages);
        setDraggedIndex(index);
        setManagedBlob(null);
    };

    const downloadReorganized = async () => {
        if (!file || pages.length === 0) return;

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            for (const page of pages) {
                const [copiedPage] = await newPdf.copyPages(sourcePdf, [page.index]);
                newPdf.addPage(copiedPage);
            }

            const pdfBytes = await newPdf.save();
            // @ts-ignore
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            setManagedBlob(blob);
        } catch (error) {
            console.error("PDF reorganization error:", error);
            alert("Failed to reorganize PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!managedBlob) return;
        const url = URL.createObjectURL(managedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `organized_${file?.name}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToProjects = async () => {
        if (!user || !managedBlob || !file) return;
        setLoading(true);
        try {
            await uploadFile({
                file: managedBlob,
                fileName: `organized_${file.name}`,
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
                        <h3 className="text-xl font-bold mb-2">Upload PDF to Manage</h3>
                        <p className="text-muted">Reorder or delete pages with drag & drop</p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <FileText className="w-6 h-6 text-accent" />
                            <div>
                                <h4 className="font-bold">{file.name}</h4>
                                <p className="text-xs text-muted">{pages.length} pages</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {managedBlob ? (
                                <>
                                    <button
                                        onClick={handleDownload}
                                        className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download
                                    </button>
                                    {user && (
                                        <button
                                            onClick={handleSaveToProjects}
                                            disabled={loading}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={downloadReorganized}
                                    disabled={loading || pages.length === 0}
                                    className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                    Apply Changes
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {pages.map((page, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                className="glass rounded-2xl p-3 cursor-move hover:border-accent/50 transition-all group relative"
                            >
                                <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    {index + 1}
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deletePage(index)}
                                        className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                                <img src={page.thumbnail} alt={`Page ${index + 1}`} className="w-full rounded-lg mb-2" />
                                <div className="flex items-center justify-center gap-1 text-xs text-muted">
                                    <GripVertical className="w-3 h-3" />
                                    <span>Drag to reorder</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
