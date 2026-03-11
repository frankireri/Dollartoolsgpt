"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Download, Upload, Image as ImageIcon, Loader2, CheckCircle, FileWarning, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

interface FileStatus {
    id: string;
    file: File;
    compressed?: File;
    loading: boolean;
    error?: string;
    saved?: boolean;
}

export default function ImageCompressor() {
    const { user } = useAuth();
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [overallLoading, setOverallLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                loading: false
            }));
            setFileStatuses(prev => [...prev, ...newFiles]);
        }
    };

    const compressSingleFile = async (status: FileStatus) => {
        const options = {
            maxSizeMB: quality * 2,
            maxWidthOrHeight: maxWidth,
            useWebWorker: true,
            initialQuality: quality,
        };

        try {
            const compressedBlob = await imageCompression(status.file, options);
            const compressed = new File([compressedBlob], status.file.name, {
                type: status.file.type,
                lastModified: Date.now(),
            });
            return compressed;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleBulkCompress = async () => {
        setOverallLoading(true);
        const updatedStatuses = [...fileStatuses];

        for (let i = 0; i < updatedStatuses.length; i++) {
            if (updatedStatuses[i].compressed) continue;

            updatedStatuses[i] = { ...updatedStatuses[i], loading: true };
            setFileStatuses([...updatedStatuses]);

            try {
                const compressed = await compressSingleFile(updatedStatuses[i]);
                updatedStatuses[i] = { ...updatedStatuses[i], compressed, loading: false };
            } catch (error) {
                updatedStatuses[i] = { ...updatedStatuses[i], loading: false, error: "Failed to compress" };
            }
            setFileStatuses([...updatedStatuses]);
        }
        setOverallLoading(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const downloadImage = (file: File) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = `compressed_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadAll = () => {
        fileStatuses.forEach(status => {
            if (status.compressed) {
                downloadImage(status.compressed);
            }
        });
    };

    const handleSaveToProjects = async (status: FileStatus) => {
        if (!user || !status.compressed) return;

        // Update local state to show loading for this specific file
        const index = fileStatuses.findIndex(s => s.id === status.id);
        const newStatuses = [...fileStatuses];
        newStatuses[index] = { ...newStatuses[index], loading: true };
        setFileStatuses(newStatuses);

        try {
            await uploadFile({
                file: status.compressed,
                fileName: `compressed_${status.file.name}`,
                toolType: "image"
            });

            newStatuses[index] = { ...newStatuses[index], loading: false, saved: true };
            setFileStatuses([...newStatuses]);
        } catch (error) {
            console.error(error);
            newStatuses[index] = { ...newStatuses[index], loading: false, error: "Save failed" };
            setFileStatuses([...newStatuses]);
        }
    };

    const removeFile = (id: string) => {
        setFileStatuses(prev => prev.filter(s => s.id !== id));
    };

    const clearAll = () => {
        setFileStatuses([]);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration & Upload Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border sticky top-24">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-accent" /> Settings
                        </h4>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2 font-medium">Quality: {Math.round(quality * 100)}%</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            <button
                                onClick={handleBulkCompress}
                                disabled={overallLoading || fileStatuses.length === 0 || fileStatuses.every(s => s.compressed)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {overallLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Compress All"}
                            </button>

                            {fileStatuses.some(s => s.compressed) && (
                                <button
                                    onClick={downloadAll}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-green-500/40 transition-all active:scale-95"
                                >
                                    <Download className="w-5 h-5" /> Download All
                                </button>
                            )}

                            {fileStatuses.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="w-full text-xs text-muted hover:text-red-500 transition-colors"
                                >
                                    Clear all files
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* File List & Progress Panel */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="relative group">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                            <Upload className="w-8 h-8 text-accent mx-auto mb-2" />
                            <p className="font-bold">Add more images</p>
                            <p className="text-muted text-xs">Drag & drop or click</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fileStatuses.map((status) => (
                            <div key={status.id} className="glass p-4 rounded-2xl border border-border flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{status.file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted">
                                        <span>{formatSize(status.file.size)}</span>
                                        {status.compressed && (
                                            <>
                                                <span className="text-accent font-bold">→ {formatSize(status.compressed.size)}</span>
                                                <span className="text-green-500 font-bold ml-1">(-{Math.round((1 - (status.compressed.size / status.file.size)) * 100)}%)</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {status.loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                    ) : status.compressed ? (
                                        <>
                                            <button
                                                onClick={() => downloadImage(status.compressed!)}
                                                className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {user && !status.saved && (
                                                <button
                                                    onClick={() => handleSaveToProjects(status)}
                                                    className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                                                    title="Save to Projects"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                            )}
                                            {status.saved && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </>
                                    ) : status.error ? (
                                        <span className="text-red-500 text-xs font-bold">{status.error}</span>
                                    ) : (
                                        <button
                                            onClick={() => removeFile(status.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {fileStatuses.length === 0 && (
                            <div className="text-center py-12 opacity-20">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                                <p>No files selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <FileWarning className="w-5 h-5 text-accent mt-0.5" />
                <div className="text-sm text-muted">
                    <p className="font-bold text-accent mb-1">Local Processing Enabled</p>
                    <p>We process all images locally in your browser. Your photos are **never** uploaded to our servers, keeping your privacy 100% secure.</p>
                </div>
            </div>
        </div>
    );
}
