"use client";

import { useState } from "react";
import { Copy, CheckCircle, Globe, Share2, Search, Code } from "lucide-react";

export default function MetaTagGenerator() {
    const [meta, setMeta] = useState({
        title: "",
        description: "",
        keywords: "",
        author: "",
        type: "website",
        url: "",
        image: ""
    });
    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        return `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}">
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">
<meta name="author" content="${meta.author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${meta.type}">
<meta property="og:url" content="${meta.url}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:image" content="${meta.image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${meta.url}">
<meta property="twitter:title" content="${meta.title}">
<meta property="twitter:description" content="${meta.description}">
<meta property="twitter:image" content="${meta.image}">`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted">Site Title</label>
                            <input
                                type="text"
                                value={meta.title}
                                onChange={e => setMeta({ ...meta, title: e.target.value })}
                                placeholder="e.g., DollarTools - Best Online Tools"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted">Author</label>
                            <input
                                type="text"
                                value={meta.author}
                                onChange={e => setMeta({ ...meta, author: e.target.value })}
                                placeholder="e.g., John Doe"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted">Description (Max 160 chars)</label>
                        <textarea
                            value={meta.description}
                            onChange={e => setMeta({ ...meta, description: e.target.value })}
                            placeholder="Briefly describe your website for search engines..."
                            className="w-full bg-background/50 border border-border rounded-xl p-3 h-24 focus:ring-1 focus:ring-accent outline-none resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted">Keywords (Comma separated)</label>
                        <input
                            type="text"
                            value={meta.keywords}
                            onChange={e => setMeta({ ...meta, keywords: e.target.value })}
                            placeholder="tools, productivity, online"
                            className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted">Site URL</label>
                            <input
                                type="text"
                                value={meta.url}
                                onChange={e => setMeta({ ...meta, url: e.target.value })}
                                placeholder="https://example.com"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted">OG Image URL</label>
                            <input
                                type="text"
                                value={meta.image}
                                onChange={e => setMeta({ ...meta, image: e.target.value })}
                                placeholder="https://example.com/og.jpg"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass p-6 rounded-2xl bg-accent/5 border-accent/20">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Search className="w-4 h-4 text-accent" /> Google Preview
                    </h3>
                    <div className="space-y-1">
                        <div className="text-[#1a0dab] text-xl truncate hover:underline cursor-pointer">
                            {meta.title || "Your Website Title Appears Here"}
                        </div>
                        <div className="text-[#006621] text-sm truncate">
                            {meta.url || "https://yourwebsite.com"}
                        </div>
                        <div className="text-[#4d5156] text-sm line-clamp-2">
                            {meta.description || "Enter a description to see how your site will look on search results."}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold uppercase text-muted flex items-center gap-2">
                            <Code className="w-4 h-4" /> Generated HTML
                        </h3>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-xs font-bold text-accent hover:opacity-80 transition-all"
                        >
                            {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            {copied ? "Copied!" : "Copy Code"}
                        </button>
                    </div>
                    <pre className="w-full h-80 bg-background/80 border border-border rounded-2xl p-6 text-[10px] md:text-xs font-mono overflow-auto scrollbar-hide text-accent/80">
                        {generateCode()}
                    </pre>
                </div>
            </div>
        </div>
    );
}
