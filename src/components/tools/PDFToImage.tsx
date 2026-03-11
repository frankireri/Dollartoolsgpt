"use client";

import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Download, Upload, FileType, ImageIcon, Loader2, CheckCircle, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

// Use worker from local package
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFToImage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImages([]);
            setProgress({ current: 0, total: 0 });
        }
    };

    const convertPDF = async () => {
        if (!file) return;
        setLoading(true);
        setImages([]);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;
            setProgress({ current: 0, total: totalPages });

            const extractedImages: string[] = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 }); // High quality
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context!, viewport, canvas: canvas }).promise;
                extractedImages.push(canvas.toDataURL("image/png"));
                setProgress(prev => ({ ...prev, current: i }));
            }

            setImages(extractedImages);
        } catch (error) {
            console.error("PDF conversion error:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadAll = () => {
        images.forEach((dataUrl, idx) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `page_${idx + 1}.png`;
            link.click();
        });
    };

    const handleSaveToProjects = async () => {
        if (!user || images.length === 0) return;
        setLoading(true);
        try {
            // Since we have multiple images, we'll save them as a zip or separate files?
            // The storage API currently handles single files. 
            // For now, let's save the first page or prompt the user?
            // Actually, a better approach for PDF to Image is to save individual pages.
            // But to keep it simple and consistent with other tools:
            for (let i = 0; i < images.length; i++) {
                const response = await fetch(images[i]);
                const blob = await response.blob();
                await uploadFile({
                    file: blob,
                    fileName: `page_${i + 1}.png`,
                    toolType: "image"
                });
            }
            alert(`Saved ${images.length} images to your projects!`);
        } catch (error) {
            console.error(error);
            alert("Failed to save some images.");
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
                    <h3 className="font-bold">{file ? file.name : "Select PDF Document"}</h3>
                    <p className="text-muted text-sm">Convert PDF pages into high-quality PNG images</p>
                </div>
            </div>

            {file && !loading && images.length === 0 && (
                <button
                    onClick={convertPDF}
                    className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all"
                >
                    Start Extraction
                </button>
            )}

            {loading && (
                <div className="glass p-12 rounded-3xl text-center flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Extracting Pages...</h3>
                        <p className="text-muted">Processing page {progress.current} of {progress.total}</p>
                    </div>
                </div>
            )}

            {images.length > 0 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {progress.total} Pages Extracted
                        </h3>
                        <div className="flex gap-2">
                            {user && (
                                <button
                                    onClick={handleSaveToProjects}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                                >
                                    <Save className="w-4 h-4" /> Save to Projects
                                </button>
                            )}
                            <button
                                onClick={downloadAll}
                                className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                            >
                                <Download className="w-4 h-4" /> Download All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img, idx) => (
                            <div key={idx} className="glass p-2 rounded-2xl border border-border group overflow-hidden">
                                <img src={img} alt={`Page ${idx + 1}`} className="w-full rounded-xl" />
                                <div className="p-3 text-center">
                                    <span className="text-xs font-bold text-muted uppercase">Page {idx + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm text-muted">
                    Each page is converted into a separate high-resolution PNG image. Processing happens entirely in your browser.
                </p>
            </div>
        </div>
    );
}
