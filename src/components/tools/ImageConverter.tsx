"use client";

import { useState, useRef } from "react";
import { Download, Upload, Image as ImageIcon, RefreshCw, FileCode, Save, Loader2, Trash2, CheckCircle, FileWarning } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

interface FileStatus {
    id: string;
    file: File;
    convertedUrl?: string;
    loading: boolean;
    error?: string;
    saved?: boolean;
}

export default function ImageConverter() {
    const { user } = useAuth();
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
    const [targetFormat, setTargetFormat] = useState("image/webp");
    const [overallLoading, setOverallLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const convertSingleFile = (status: FileStatus): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return reject("Canvas not found");

                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                resolve(canvas.toDataURL(targetFormat));
            };
            img.onerror = () => reject("Failed to load image");
            img.src = URL.createObjectURL(status.file);
        });
    };

    const handleBulkConvert = async () => {
        setOverallLoading(true);
        const updatedStatuses = [...fileStatuses];

        for (let i = 0; i < updatedStatuses.length; i++) {
            if (updatedStatuses[i].convertedUrl) continue;

            updatedStatuses[i] = { ...updatedStatuses[i], loading: true };
            setFileStatuses([...updatedStatuses]);

            try {
                const convertedUrl = await convertSingleFile(updatedStatuses[i]);
                updatedStatuses[i] = { ...updatedStatuses[i], convertedUrl, loading: false };
            } catch (error) {
                updatedStatuses[i] = { ...updatedStatuses[i], loading: false, error: "Failed to convert" };
            }
            setFileStatuses([...updatedStatuses]);
        }
        setOverallLoading(false);
    };

    const downloadImage = (url: string, fileName: string) => {
        const extension = targetFormat.split("/")[1].replace("jpeg", "jpg");
        const link = document.createElement("a");
        link.href = url;
        link.download = `converted_${fileName.split(".")[0]}.${extension}`;
        link.click();
    };

    const downloadAll = () => {
        fileStatuses.forEach(status => {
            if (status.convertedUrl) {
                downloadImage(status.convertedUrl, status.file.name);
            }
        });
    };

    const handleSaveToProjects = async (status: FileStatus) => {
        if (!user || !status.convertedUrl) return;

        const index = fileStatuses.findIndex(s => s.id === status.id);
        const newStatuses = [...fileStatuses];
        newStatuses[index] = { ...newStatuses[index], loading: true };
        setFileStatuses(newStatuses);

        try {
            const blob = await fetch(status.convertedUrl).then(r => r.blob());
            const extension = targetFormat.split("/")[1].replace("jpeg", "jpg");
            await uploadFile({
                file: blob,
                fileName: `converted_${status.file.name.split(".")[0]}.${extension}`,
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

    const formats = [
        { label: "PNG", value: "image/png" },
        { label: "JPG", value: "image/jpeg" },
        { label: "WEBP", value: "image/webp" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border sticky top-24">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-accent" /> Conversion Settings
                        </h4>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-muted uppercase mb-3 font-bold">Target Format:</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {formats.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => {
                                                setTargetFormat(f.value);
                                                // Clear previous conversions if format changes
                                                setFileStatuses(prev => prev.map(s => ({ ...s, convertedUrl: undefined, saved: false })));
                                            }}
                                            className={`py-3 rounded-xl font-bold transition-all border ${targetFormat === f.value ? "bg-accent text-white border-accent" : "glass border-border hover:border-accent/50"}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleBulkConvert}
                                disabled={overallLoading || fileStatuses.length === 0 || fileStatuses.every(s => s.convertedUrl)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {overallLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Convert All Images"}
                            </button>

                            {fileStatuses.some(s => s.convertedUrl) && (
                                <button
                                    onClick={downloadAll}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-green-500/40 transition-all active:scale-95"
                                >
                                    <Download className="w-5 h-5" /> Download All Converted
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
                            <p className="font-bold">Add images to convert</p>
                            <p className="text-muted text-xs">Drop multiple files here</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fileStatuses.map((status) => (
                            <div key={status.id} className="glass p-4 rounded-2xl border border-border flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{status.file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted">
                                        <span>{status.file.type.split("/")[1].toUpperCase()}</span>
                                        {status.convertedUrl && (
                                            <span className="text-accent font-bold">→ {targetFormat.split("/")[1].toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {status.loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                    ) : status.convertedUrl ? (
                                        <>
                                            <button
                                                onClick={() => downloadImage(status.convertedUrl!, status.file.name)}
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
                    Conversions happen strictly within your browser. No image data is sent to our servers during the conversion process.
                </p>
            </div>
        </div>
    );
}
