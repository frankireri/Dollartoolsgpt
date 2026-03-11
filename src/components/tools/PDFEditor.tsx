"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, FileText, Type, Highlighter, PenTool, MousePointer, ChevronLeft, ChevronRight, Edit3, Image as ImageIcon, Save } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/fileStorage";

if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
}

type Tool = "select" | "text" | "highlight" | "draw" | "edit" | "image";

interface Annotation {
    type: "text" | "highlight" | "draw" | "image";
    x: number;
    y: number;
    content?: string;
    width?: number;
    height?: number;
    color?: string;
    points?: { x: number; y: number }[];
    dataUrl?: string; // For images
}

interface TextItem {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
}

export default function PDFEditor() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeTool, setActiveTool] = useState<Tool>("select");
    const [annotations, setAnnotations] = useState<Map<number, Annotation[]>>(new Map()); // Page-specific annotations
    const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState<{ page: number, index: number } | null>(null);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null); // 'nw', 'ne', 'sw', 'se'
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

    const [textItems, setTextItems] = useState<TextItem[]>([]);
    const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
    const [hoverTextIndex, setHoverTextIndex] = useState<number | null>(null);
    const [modifiedTexts, setModifiedTexts] = useState<Map<number, Map<number, string>>>(new Map());

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pdfDocRef = useRef<any>(null);
    const pdfBytesRef = useRef<Uint8Array | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || selectedFile.type !== "application/pdf") return;

        setFile(selectedFile);
        setLoading(true);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            pdfBytesRef.current = new Uint8Array(arrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            pdfDocRef.current = pdf;
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
            await renderPage(1, pdf);
        } catch (error) {
            console.error("PDF load error:", error);
            alert("Failed to load PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderPage = async (pageNum: number, pdf: any) => {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        const textContent = await page.getTextContent();
        const extractedTexts: TextItem[] = [];

        textContent.items.forEach((item: any) => {
            if (item.str.trim()) {
                const transform = item.transform;
                const x = transform[4];
                const y = viewport.height - transform[5];
                const fontSize = Math.abs(transform[3]);

                extractedTexts.push({
                    text: item.str,
                    x: x,
                    y: y,
                    width: item.width,
                    height: item.height,
                    fontSize: fontSize,
                });
            }
        });

        setTextItems(extractedTexts);

        const overlay = overlayRef.current;
        if (overlay) {
            overlay.width = viewport.width;
            overlay.height = viewport.height;
            redrawOverlay();
        }
    };

    const redrawOverlay = () => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ctx = overlay.getContext("2d");
        if (!ctx) return;

        // Draw annotations for current page
        const pageAnnotations = annotations.get(currentPage) || [];
        pageAnnotations.forEach((ann, index) => {
            const isSelected = selectedAnnotationIndex?.page === currentPage && selectedAnnotationIndex?.index === index;

            if (ann.type === "text" && ann.content) {
                ctx.font = "20px Arial";
                ctx.fillStyle = "#ef4444";
                ctx.fillText(ann.content, ann.x, ann.y);
            } else if (ann.type === "highlight") {
                ctx.fillStyle = "rgba(255, 235, 59, 0.4)";
                ctx.fillRect(ann.x, ann.y, ann.width || 150, ann.height || 30);
            } else if (ann.type === "draw" && ann.points && ann.points.length > 0) {
                ctx.strokeStyle = ann.color || "#10b981";
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(ann.points[0].x, ann.points[0].y);
                ann.points.forEach(point => ctx.lineTo(point.x, point.y));
                ctx.stroke();
            } else if (ann.type === "image" && ann.dataUrl) {
                const img = new Image();
                img.src = ann.dataUrl;
                if (img.complete) {
                    ctx.drawImage(img, ann.x, ann.y, ann.width || 100, ann.height || 100);
                } else {
                    img.onload = () => redrawOverlay();
                }
            }

            if (isSelected) {
                ctx.strokeStyle = "#3b82f6";
                ctx.lineWidth = 2;
                ctx.strokeRect(ann.x - 5, ann.y - 5, (ann.width || 100) + 10, (ann.height || 100) + 10);

                // Draw resize handles for images
                if (ann.type === "image") {
                    ctx.fillStyle = "#3b82f6";
                    const size = 8;
                    ctx.fillRect(ann.x - 5 - size / 2, ann.y - 5 - size / 2, size, size); // NW
                    ctx.fillRect(ann.x + (ann.width || 100) + 5 - size / 2, ann.y - 5 - size / 2, size, size); // NE
                    ctx.fillRect(ann.x - 5 - size / 2, ann.y + (ann.height || 100) + 5 - size / 2, size, size); // SW
                    ctx.fillRect(ann.x + (ann.width || 100) + 5 - size / 2, ann.y + (ann.height || 100) + 5 - size / 2, size, size); // SE
                }
            }
        });

        // Only modify text that has been changed or is being edited
        if (activeTool === "edit") {
            const pageModifications = modifiedTexts.get(currentPage);

            textItems.forEach((item, index) => {

                // Skip if currently being edited (input will show it)
                if (editingTextIndex === index) {
                    // Just hide original
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(item.x - 3, item.y - item.fontSize - 2, item.width + 6, item.fontSize + 6);

                    // Show subtle hover indicator only
                    if (hoverTextIndex === index) {
                        ctx.strokeStyle = "#3b82f6";
                        ctx.lineWidth = 2;
                        ctx.setLineDash([5, 3]);
                        ctx.strokeRect(item.x - 2, item.y - item.fontSize, item.width + 100, item.fontSize + 4);
                        ctx.setLineDash([]);
                    }
                    return;
                }

                // Only hide and replace if text has been MODIFIED
                if (pageModifications?.has(index)) {
                    const modifiedText = pageModifications.get(index)!;

                    // Hide original text
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(item.x - 2, item.y - item.fontSize - 1, item.width + 20, item.fontSize + 4);

                    // Draw modified text
                    ctx.font = `${item.fontSize}px Arial`;
                    ctx.fillStyle = "#000000";
                    ctx.fillText(modifiedText, item.x, item.y);
                }

                // Show hover indicator
                if (hoverTextIndex === index) {
                    ctx.strokeStyle = "#3b82f680";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 2]);
                    ctx.strokeRect(item.x - 2, item.y - item.fontSize, item.width + 4, item.fontSize + 4);
                    ctx.setLineDash([]);
                }
            });
        }
    };

    useEffect(() => {
        redrawOverlay();
    }, [annotations, activeTool, textItems, modifiedTexts, editingTextIndex, hoverTextIndex]);

    useEffect(() => {
        if (editingTextIndex !== null && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingTextIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === "Delete" || e.key === "Backspace") && selectedAnnotationIndex && activeTool === "select") {
                // Don't delete if we are typing in an input (though edit tool handles that differently)
                if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

                setAnnotations(prev => {
                    const next = new Map(prev);
                    const list = [...(next.get(currentPage) || [])];
                    list.splice(selectedAnnotationIndex.index, 1);
                    next.set(currentPage, list);
                    return next;
                });
                setSelectedAnnotationIndex(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedAnnotationIndex, activeTool, currentPage]);

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (activeTool !== "edit" || editingTextIndex !== null) {
            setHoverTextIndex(null);
            return;
        }

        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const hoveredIndex = textItems.findIndex(item =>
            x >= item.x - 2 &&
            x <= item.x + item.width + 2 &&
            y >= item.y - item.fontSize &&
            y <= item.y + 4
        );

        setHoverTextIndex(hoveredIndex !== -1 ? hoveredIndex : null);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === "edit") {
            const clickedTextIndex = textItems.findIndex(item =>
                x >= item.x - 2 &&
                x <= item.x + item.width + 2 &&
                y >= item.y - item.fontSize &&
                y <= item.y + 4
            );

            if (clickedTextIndex !== -1) {
                setEditingTextIndex(clickedTextIndex);
            } else {
                setEditingTextIndex(null);
            }
            return;
        }

        if (activeTool === "select") {
            const pageAnns = annotations.get(currentPage) || [];
            // Check for hits from top to bottom (reverse)
            const index = pageAnns.findLastIndex(ann => {
                const w = ann.width || 100;
                const h = ann.height || 100;
                return x >= ann.x && x <= ann.x + w && y >= ann.y && y <= ann.y + h;
            });
            if (index !== -1) {
                setSelectedAnnotationIndex({ page: currentPage, index });
            } else {
                setSelectedAnnotationIndex(null);
            }
            return;
        }

        if (activeTool === "text") {
            const text = prompt("Enter text:");
            if (text) {
                setAnnotations(prev => {
                    const next = new Map(prev);
                    const list = [...(next.get(currentPage) || []), { type: "text" as const, x, y, content: text }];
                    next.set(currentPage, list);
                    return next;
                });
            }
        } else if (activeTool === "highlight") {
            setAnnotations(prev => {
                const next = new Map(prev);
                const list = [...(next.get(currentPage) || []), { type: "highlight" as const, x, y, width: 150, height: 30 }];
                next.set(currentPage, list);
                return next;
            });
        } else if (activeTool === "image") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (ie) => {
                const file = (ie.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        const dataUrl = re.target?.result as string;
                        setAnnotations(prev => {
                            const next = new Map(prev);
                            const list = [...(next.get(currentPage) || []), {
                                type: "image" as const,
                                x: x - 100, // Center on click
                                y: y - 100,
                                width: 200,
                                height: 200,
                                dataUrl
                            }];
                            next.set(currentPage, list);
                            return next;
                        });
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === "draw") {
            setIsDrawing(true);
            setCurrentPoints([{ x, y }]);
            return;
        }

        if (activeTool === "select" && selectedAnnotationIndex) {
            const pageAnns = annotations.get(currentPage) || [];
            const ann = pageAnns[selectedAnnotationIndex.index];
            if (!ann) return;

            const w = ann.width || 100;
            const h = ann.height || 100;
            const size = 10;

            // Check handles
            if (x >= ann.x - 5 - size / 2 && x <= ann.x - 5 + size / 2 && y >= ann.y - 5 - size / 2 && y <= ann.y - 5 + size / 2) setResizeHandle("nw");
            else if (x >= ann.x + w + 5 - size / 2 && x <= ann.x + w + 5 + size / 2 && y >= ann.y - 5 - size / 2 && y <= ann.y - 5 + size / 2) setResizeHandle("ne");
            else if (x >= ann.x - 5 - size / 2 && x <= ann.x - 5 + size / 2 && y >= ann.y + h + 5 - size / 2 && y <= ann.y + h + 5 + size / 2) setResizeHandle("sw");
            else if (x >= ann.x + w + 5 - size / 2 && x <= ann.x + w + 5 + size / 2 && y >= ann.y + h + 5 - size / 2 && y <= ann.y + h + 5 + size / 2) setResizeHandle("se");
            else if (x >= ann.x && x <= ann.x + w && y >= ann.y && y <= ann.y + h) {
                setIsDragging(true);
                setDragOffset({ x: x - ann.x, y: y - ann.y });
            }
        }
    };

    const handleMouseMoveInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isDrawing && activeTool === "draw") {
            setCurrentPoints(prev => [...prev, { x, y }]);
            const overlay = overlayRef.current;
            const ctx = overlay.getContext("2d");
            if (ctx && currentPoints.length > 0) {
                redrawOverlay();
                ctx.strokeStyle = "#10b981";
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
                [...currentPoints, { x, y }].forEach(point => ctx.lineTo(point.x, point.y));
                ctx.stroke();
            }
            return;
        }

        if (selectedAnnotationIndex) {
            const pageAnns = [...(annotations.get(currentPage) || [])];
            const ann = { ...pageAnns[selectedAnnotationIndex.index] };

            if (isDragging && dragOffset) {
                ann.x = x - dragOffset.x;
                ann.y = y - dragOffset.y;
                pageAnns[selectedAnnotationIndex.index] = ann;
                setAnnotations(prev => {
                    const next = new Map(prev);
                    next.set(currentPage, pageAnns);
                    return next;
                });
            } else if (resizeHandle) {
                if (resizeHandle === "se") {
                    ann.width = Math.max(20, x - ann.x);
                    ann.height = Math.max(20, y - ann.y);
                } else if (resizeHandle === "sw") {
                    const newWidth = (ann.width || 100) + (ann.x - x);
                    ann.x = x;
                    ann.width = Math.max(20, newWidth);
                    ann.height = Math.max(20, y - ann.y);
                } else if (resizeHandle === "ne") {
                    const newHeight = (ann.height || 100) + (ann.y - y);
                    ann.y = y;
                    ann.width = Math.max(20, x - ann.x);
                    ann.height = Math.max(20, newHeight);
                } else if (resizeHandle === "nw") {
                    const newWidth = (ann.width || 100) + (ann.x - x);
                    const newHeight = (ann.height || 100) + (ann.y - y);
                    ann.x = x;
                    ann.y = y;
                    ann.width = Math.max(20, newWidth);
                    ann.height = Math.max(20, newHeight);
                }
                pageAnns[selectedAnnotationIndex.index] = ann;
                setAnnotations(prev => {
                    const next = new Map(prev);
                    next.set(currentPage, pageAnns);
                    return next;
                });
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && currentPoints.length > 0) {
            setAnnotations(prev => {
                const next = new Map(prev);
                const list = [...(next.get(currentPage) || []), { type: "draw" as const, x: 0, y: 0, points: currentPoints, color: "#10b981" }];
                next.set(currentPage, list);
                return next;
            });
            setCurrentPoints([]);
        }
        setIsDrawing(false);
        setIsDragging(false);
        setResizeHandle(null);
        setDragOffset(null);
    };

    const changePage = async (newPage: number) => {
        if (newPage < 1 || newPage > totalPages || !pdfDocRef.current) return;
        setCurrentPage(newPage);
        await renderPage(newPage, pdfDocRef.current);
        setEditingTextIndex(null);
        setHoverTextIndex(null);
    };

    const getModifiedPDFBlob = async (): Promise<Blob | null> => {
        if (!pdfBytesRef.current) return null;

        const pdfDoc = await PDFDocument.load(pdfBytesRef.current);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const pageModifications = modifiedTexts.get(pageNum);
            if (!pageModifications || pageModifications.size === 0) continue;

            const page = pdfDoc.getPage(pageNum - 1);
            const { height } = page.getSize();

            const pdfPage = await pdfDocRef.current.getPage(pageNum);
            const textContent = await pdfPage.getTextContent();

            let itemIndex = 0;
            textContent.items.forEach((item: any) => {
                if (item.str.trim()) {
                    const modifiedText = pageModifications.get(itemIndex);
                    if (modifiedText !== undefined) {
                        const transform = item.transform;
                        const x = transform[4] / 1.5;
                        const y = height - (transform[5] / 1.5);
                        const fontSize = Math.abs(transform[3]) / 1.5;

                        page.drawRectangle({
                            x: x - 2,
                            y: y - 2,
                            width: item.width / 1.5 + 4,
                            height: fontSize + 4,
                            color: rgb(1, 1, 1),
                        });

                        page.drawText(modifiedText, {
                            x: x,
                            y: y,
                            size: fontSize,
                            font: helveticaFont,
                            color: rgb(0, 0, 0),
                        });
                    }
                    itemIndex++;
                }
            });
        }

        const pdfBytes = await pdfDoc.save();
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const pageAnns = annotations.get(pageNum);
            if (!pageAnns || pageAnns.length === 0) continue;

            const page = pdfDoc.getPage(pageNum - 1);
            const { height } = page.getSize();

            for (const ann of pageAnns) {
                if (ann.type === "image" && ann.dataUrl) {
                    try {
                        const imgBytes = await fetch(ann.dataUrl).then(res => res.arrayBuffer());
                        const image = ann.dataUrl.includes("png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
                        page.drawImage(image, {
                            x: ann.x / 1.5,
                            y: height - (ann.y / 1.5) - (ann.height || 100) / 1.5,
                            width: (ann.width || 100) / 1.5,
                            height: (ann.height || 100) / 1.5,
                        });
                    } catch (e) { console.error("Error embedding image:", e); }
                } else if (ann.type === "text" && ann.content) {
                    page.drawText(ann.content, {
                        x: ann.x / 1.5,
                        y: height - (ann.y / 1.5),
                        size: 20 / 1.5,
                        font: helveticaFont,
                        color: rgb(1, 0, 0),
                    });
                }
            }
        }

        const finalPdfBytes = await pdfDoc.save();
        // @ts-ignore - Uint8Array is compatible with BlobPart
        return new Blob([finalPdfBytes], { type: "application/pdf" });
    };

    const downloadModifiedPDF = async () => {
        try {
            setLoading(true);
            const blob = await getModifiedPDFBlob();
            if (!blob) {
                alert("No PDF loaded");
                setLoading(false);
                return;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `edited_${file?.name || "document.pdf"}`;
            a.click();
            URL.revokeObjectURL(url);
            setLoading(false);
        } catch (error) {
            console.error("Error saving PDF:", error);
            alert("Failed to save PDF. Please try again.");
            setLoading(false);
        }
    };

    const handleSaveToProjects = async () => {
        if (!user) {
            alert("Please sign in to save projects");
            return;
        }

        try {
            setLoading(true);
            const blob = await getModifiedPDFBlob();
            if (!blob) {
                alert("Nothing to save");
                setLoading(false);
                return;
            }

            const fileName = `edited_${file?.name || "document.pdf"}`;
            await uploadFile({
                file: blob,
                fileName,
                toolType: "pdf"
            });

            alert("Project saved successfully!");
            setLoading(false);
        } catch (error) {
            console.error("Save project error:", error);
            alert(error instanceof Error ? error.message : "Failed to save project");
            setLoading(false);
        }
    };

    const currentEditingItem = editingTextIndex !== null ? textItems[editingTextIndex] : null;
    const pageModifications = modifiedTexts.get(currentPage);
    const currentEditValue = editingTextIndex !== null
        ? (pageModifications?.get(editingTextIndex) ?? textItems[editingTextIndex]?.text ?? "")
        : "";

    return (
        <div className="space-y-6">
            {!file ? (
                <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center hover:border-accent/50 transition-all group cursor-pointer">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-upload"
                        disabled={loading}
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                        <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload PDF to Edit</h3>
                        <p className="text-muted">Edit text inline, add annotations, modify your PDF</p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass p-4 rounded-2xl border border-accent/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-accent" />
                                    <h4 className="font-bold truncate max-w-xs">{file.name}</h4>
                                </div>
                                <span className="text-sm text-muted">
                                    Page {currentPage} / {totalPages}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {[
                                    { id: "select" as Tool, icon: MousePointer, label: "Select" },
                                    { id: "edit" as Tool, icon: Edit3, label: "Edit Text", highlight: true },
                                    { id: "text" as Tool, icon: Type, label: "Add Text" },
                                    { id: "highlight" as Tool, icon: Highlighter, label: "Highlight" },
                                    { id: "draw" as Tool, icon: PenTool, label: "Draw" },
                                    { id: "image" as Tool, icon: ImageIcon, label: "Image" },
                                ].map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            setActiveTool(tool.id);
                                            setEditingTextIndex(null);
                                            setHoverTextIndex(null);
                                            setSelectedAnnotationIndex(null);
                                        }}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-semibold ${activeTool === tool.id
                                            ? "bg-accent text-white"
                                            : tool.highlight
                                                ? "bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/30"
                                                : "hover:bg-accent/10"
                                            }`}
                                    >
                                        <tool.icon className="w-4 h-4" />
                                        <span className="hidden md:inline text-sm">{tool.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setCurrentPage(1);
                                        setTotalPages(0);
                                        setAnnotations(new Map<number, Annotation[]>());
                                        setSelectedAnnotationIndex(null);
                                    }}
                                    className="px-4 py-2 border border-border rounded-lg font-semibold hover:bg-red-500/10 hover:border-red-500 transition-all text-sm"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={downloadModifiedPDF}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    Export PDF
                                </button>
                                {user && (
                                    <button
                                        onClick={handleSaveToProjects}
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-border">
                        {loading ? (
                            <div className="min-h-[600px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-muted">Processing PDF...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <button
                                        onClick={() => changePage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-accent text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/90 transition-all flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    <span className="text-sm font-semibold min-w-[100px] text-center">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => changePage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-accent text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/90 transition-all flex items-center gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative border border-border rounded-xl overflow-auto bg-white/5 max-h-[700px] flex justify-center">
                                    <div className="relative inline-block">
                                        <canvas ref={canvasRef} className="block" />
                                        <canvas
                                            ref={overlayRef}
                                            onClick={handleCanvasClick}
                                            onMouseMove={(e) => {
                                                handleCanvasMouseMove(e);
                                                handleMouseMoveInteraction(e);
                                            }}
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={() => {
                                                setIsDrawing(false);
                                                setHoverTextIndex(null);
                                            }}
                                            className="absolute top-0 left-0"
                                            style={{
                                                pointerEvents: "auto",
                                                cursor: activeTool === "select" ? "default" :
                                                    activeTool === "edit" ? "text" :
                                                        activeTool === "text" ? "crosshair" :
                                                            activeTool === "highlight" ? "cell" : "crosshair"
                                            }}
                                        />

                                        {currentEditingItem && (
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={currentEditValue}
                                                onChange={(e) => {
                                                    const newModifiedTexts = new Map(modifiedTexts);
                                                    if (!newModifiedTexts.has(currentPage)) {
                                                        newModifiedTexts.set(currentPage, new Map());
                                                    }
                                                    newModifiedTexts.get(currentPage)!.set(editingTextIndex!, e.target.value);
                                                    setModifiedTexts(newModifiedTexts);
                                                }}
                                                onBlur={() => setEditingTextIndex(null)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === "Escape") {
                                                        setEditingTextIndex(null);
                                                    }
                                                }}
                                                className="absolute outline-none shadow-lg"
                                                style={{
                                                    left: `${currentEditingItem.x}px`,
                                                    top: `${currentEditingItem.y - currentEditingItem.fontSize + 2}px`,
                                                    fontSize: `${currentEditingItem.fontSize}px`,
                                                    width: `${Math.max(currentEditingItem.width + 100, 200)}px`,
                                                    height: `${currentEditingItem.fontSize + 4}px`,
                                                    fontFamily: "Arial",
                                                    backgroundColor: "#ffffff",
                                                    color: "#000000",
                                                    border: "2px solid #3b82f6",
                                                    borderRadius: "2px",
                                                    padding: "0 4px",
                                                    lineHeight: `${currentEditingItem.fontSize + 4}px`,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-accent/5 rounded-xl">
                                    <p className="text-sm text-muted">
                                        <strong>💡 {activeTool === "edit" ? "Edit Mode:" : "Tips:"}</strong>
                                        {activeTool === "edit" ? " Hover over text to see editable areas, then click to edit. Press Enter when done." :
                                            activeTool === "text" ? " Click anywhere to add new text." :
                                                activeTool === "highlight" ? " Click to add highlights." :
                                                    activeTool === "draw" ? " Click and drag to draw." :
                                                        " Select a tool to start editing."}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
