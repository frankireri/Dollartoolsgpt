"use client";

import { useState } from "react";
import { Copy, CheckCircle, FileCode, Plus, Trash2, Globe } from "lucide-react";

export default function SitemapGenerator() {
    const [baseUrl, setBaseUrl] = useState("https://example.com");
    const [urls, setUrls] = useState<string[]>(["/"]);
    const [copied, setCopied] = useState(false);

    const addUrl = () => setUrls([...urls, ""]);
    const updateUrl = (idx: number, val: string) => {
        const newUrls = [...urls];
        newUrls[idx] = val;
        setUrls(newUrls);
    };
    const removeUrl = (idx: number) => setUrls(urls.filter((_, i) => i !== idx));

    const generateXML = () => {
        const entries = urls.map(u => {
            const fullUrl = u.startsWith("http") ? u : `${baseUrl.replace(/\/$/, "")}${u.startsWith("/") ? u : `/${u}`}`;
            return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${u === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
        }).join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateXML());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadXML = () => {
        const blob = new Blob([generateXML()], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sitemap.xml";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted">Base Website URL</label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-muted block">Relative Paths / URL List</label>
                        {urls.map((url, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => updateUrl(idx, e.target.value)}
                                    className="flex-1 bg-background/50 border border-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-accent outline-none"
                                    placeholder={idx === 0 ? "/" : "/about"}
                                />
                                <button
                                    onClick={() => removeUrl(idx)}
                                    className="p-3 text-muted hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addUrl}
                        className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 font-bold"
                    >
                        <Plus className="w-4 h-4" /> Add URL
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold uppercase text-muted flex items-center gap-2">
                            <FileCode className="w-4 h-4" /> sitemap.xml
                        </h3>
                        <div className="flex gap-4">
                            <button onClick={handleCopy} className="text-xs font-bold text-accent hover:opacity-80">
                                {copied ? "Copied!" : "Copy XML"}
                            </button>
                            <button onClick={downloadXML} className="text-xs font-bold text-accent hover:opacity-80 underline underline-offset-4">
                                Download
                            </button>
                        </div>
                    </div>
                    <pre className="w-full h-[400px] bg-background/80 border border-border rounded-2xl p-6 text-xs font-mono overflow-auto text-accent/80 scrollbar-hide">
                        {generateXML()}
                    </pre>
                </div>
            </div>
        </div>
    );
}
