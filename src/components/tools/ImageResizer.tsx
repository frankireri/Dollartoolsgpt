"use client";

import { useState, useRef } from "react";
import { Download, Upload, Image as ImageIcon, Maximize, CheckCircle, Lock, Unlock, Save, Loader2, Trash2, FileWarning } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

interface FileStatus {
    id: string;
    file: File;
    resizedUrl?: string;
    loading: boolean;
    error?: string;
    saved?: boolean;
    width: number;
    height: number;
    aspectRatio: number;
}

export default function ImageResizer() {
    const { user } = useAuth();
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
    const [globalWidth, setGlobalWidth] = useState<number>(1200);
    const [globalHeight, setGlobalHeight] = useState<number>(800);
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [overallLoading, setOverallLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const img = new Image();
                img.onload = () => {
                    const status: FileStatus = {
                        id: Math.random().toString(36).substr(2, 9),
                        file,
                        loading: false,
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height
                    };
                    setFileStatuses(prev => [...prev, status]);
                    // Update global width/height based on first image if none set
                    if (fileStatuses.length === 0) {
                        setGlobalWidth(img.width);
                        setGlobalHeight(img.height);
                    }
                };
                img.src = URL.createObjectURL(file);
            });
        }
    };

    const handleGlobalWidthChange = (newWidth: number) => {
        setGlobalWidth(newWidth);
        if (lockAspectRatio) {
            // This is tricky for bulk since images have different aspect ratios.
            // We'll apply the change to the UI, but actual resizing will respect individual ratios if needed.
            // For now, let's just let the user set dimensions.
        }
    };

    const resizeSingleFile = (status: FileStatus): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return reject("Canvas not found");

                const ctx = canvas.getContext("2d");

                let targetWidth = globalWidth;
                let targetHeight = globalHeight;

                if (lockAspectRatio) {
                    if (globalWidth / status.aspectRatio < globalHeight) {
                        targetHeight = Math.round(globalWidth / status.aspectRatio);
                    } else {
                        targetWidth = Math.round(globalHeight * status.aspectRatio);
                    }
                }

                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
                resolve(canvas.toDataURL(status.file.type));
            };
            img.onerror = () => reject("Failed to load image");
            img.src = URL.createObjectURL(status.file);
        });
    };

    const handleBulkResize = async () => {
        setOverallLoading(true);
        const updatedStatuses = [...fileStatuses];

        for (let i = 0; i < updatedStatuses.length; i++) {
            if (updatedStatuses[i].resizedUrl) continue;

            updatedStatuses[i] = { ...updatedStatuses[i], loading: true };
            setFileStatuses([...updatedStatuses]);

            try {
                const resizedUrl = await resizeSingleFile(updatedStatuses[i]);
                updatedStatuses[i] = { ...updatedStatuses[i], resizedUrl, loading: false };
            } catch (error) {
                updatedStatuses[i] = { ...updatedStatuses[i], loading: false, error: "Failed to resize" };
            }
            setFileStatuses([...updatedStatuses]);
        }
        setOverallLoading(false);
    };

    const downloadImage = (url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `resized_${fileName}`;
        link.click();
    };

    const downloadAll = () => {
        fileStatuses.forEach(status => {
            if (status.resizedUrl) {
                downloadImage(status.resizedUrl, status.file.name);
            }
        });
    };

    const handleSaveToProjects = async (status: FileStatus) => {
        if (!user || !status.resizedUrl) return;

        const index = fileStatuses.findIndex(s => s.id === status.id);
        const newStatuses = [...fileStatuses];
        newStatuses[index] = { ...newStatuses[index], loading: true };
        setFileStatuses(newStatuses);

        try {
            const blob = await fetch(status.resizedUrl).then(r => r.blob());
            await uploadFile({
                file: blob,
                fileName: `resized_${status.file.name}`,
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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold flex items-center gap-2">
                                <Maximize className="w-5 h-5 text-accent" /> Resize All
                            </h4>
                            <button
                                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                className={`p-2 rounded-lg transition-all ${lockAspectRatio ? "text-accent bg-accent/10" : "text-muted"}`}
                                title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                            >
                                {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted uppercase font-bold">Target Width</label>
                                    <input
                                        type="number"
                                        value={globalWidth}
                                        onChange={(e) => setGlobalWidth(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted uppercase font-bold">Target Height</label>
                                    <input
                                        type="number"
                                        value={globalHeight}
                                        onChange={(e) => setGlobalHeight(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleBulkResize}
                                disabled={overallLoading || fileStatuses.length === 0 || fileStatuses.every(s => s.resizedUrl)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {overallLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Resize All Images"}
                            </button>

                            {fileStatuses.some(s => s.resizedUrl) && (
                                <button
                                    onClick={downloadAll}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-green-500/40 transition-all active:scale-95"
                                >
                                    <Download className="w-5 h-5" /> Download All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* File List Panel */}
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
                            <p className="font-bold">Add images to resize</p>
                            <p className="text-muted text-xs">Bulk processing enabled</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fileStatuses.map((status) => (
                            <div key={status.id} className="glass p-4 rounded-2xl border border-border flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-background/50 shrink-0 border border-border">
                                    <img src={status.resizedUrl || URL.createObjectURL(status.file)} alt="preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{status.file.name}</p>
                                    <p className="text-xs text-muted">
                                        Original: {status.width}x{status.height}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {status.loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                    ) : status.resizedUrl ? (
                                        <>
                                            <button
                                                onClick={() => downloadImage(status.resizedUrl!, status.file.name)}
                                                className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {user && !status.saved && (
                                                <button
                                                    onClick={() => handleSaveToProjects(status)}
                                                    className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                            )}
                                            {status.saved && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </>
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
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <FileWarning className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm text-muted">
                    Your images are resized 100% locally in your browser using the HTML5 Canvas API. Privacy is fully preserved.
                </p>
            </div>
        </div>
    );
}
