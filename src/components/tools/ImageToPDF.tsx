"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { Download, Upload, FileText, Image as ImageIcon, Trash2, MoveUp, MoveDown, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

export default function ImageToPDF() {
    const { user } = useAuth();
    const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
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

    const generatePDFBlob = async (): Promise<Blob | null> => {
        if (files.length === 0) return null;
        const pdf = new jsPDF();

        for (let i = 0; i < files.length; i++) {
            const { file } = files[i];
            const imgData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });

            const img = new Image();
            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = imgData;
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const ratio = img.width / img.height;
            let imgWidth = pageWidth - 20;
            let imgHeight = imgWidth / ratio;

            if (imgHeight > pageHeight - 20) {
                imgHeight = pageHeight - 20;
                imgWidth = imgHeight * ratio;
            }

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);
        }

        return pdf.output("blob");
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            const blob = await generatePDFBlob();
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "converted_images.pdf";
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToProjects = async () => {
        if (!user || files.length === 0) return;
        setLoading(true);
        try {
            const blob = await generatePDFBlob();
            if (blob) {
                await uploadFile({
                    file: blob,
                    fileName: "converted_images.pdf",
                    toolType: "pdf"
                });
                alert("Project saved successfully!");
            }
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
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                    <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="font-bold">Select or Drag Images</h3>
                    <p className="text-muted text-sm">Add multiple images to combine into one PDF</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.map((item, idx) => (
                            <div key={idx} className="glass p-4 rounded-2xl border border-border group relative">
                                <img src={item.preview} alt="preview" className="w-full h-40 object-cover rounded-xl mb-4" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted truncate max-w-[120px]">{item.file.name}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => moveFile(idx, 'up')} className="p-1 hover:text-accent disabled:opacity-30" disabled={idx === 0}><MoveUp className="w-4 h-4" /></button>
                                        <button onClick={() => moveFile(idx, 'down')} className="p-1 hover:text-accent disabled:opacity-30" disabled={idx === files.length - 1}><MoveDown className="w-4 h-4" /></button>
                                        <button onClick={() => removeFile(idx)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Download className="w-6 h-6" />
                            {loading ? "Generating..." : "Download PDF"}
                        </button>
                        {user && (
                            <button
                                onClick={handleSaveToProjects}
                                disabled={loading}
                                className="py-5 bg-blue-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-6 h-6" />
                                Save Project
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="p-4 glass rounded-2xl bg-accent/5 flex items-start gap-3">
                <FileText className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm text-muted">
                    Images are combined in the order shown above. You can reorder your images or remove them before converting.
                </p>
            </div>
        </div>
    );
}
