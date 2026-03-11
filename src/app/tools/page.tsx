"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools } from "@/config/tools";
import { ArrowRight, Sparkles, Search } from "lucide-react";

export default function ToolsPage() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);
    const categories = {
        text: "Text Tools",
        developer: "Developer Tools",
        image: "Image & Media",
        utility: "Utilities & Calculators",
        ai: "AI-Powered Tools"
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-black gradient-text">All Tools</h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Browse our complete collection of {tools.length}+ professional tools
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a tool..."
                            className="block w-full pl-12 pr-4 py-4 glass border border-border rounded-2xl text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-lg"
                        />
                    </div>
                </div>

                {/* Tools by Category */}
                {Object.entries(categories).map(([key, label]) => {
                    const categoryParam = searchParams.get("category");

                    // If category param is set, only show that category
                    if (categoryParam && categoryParam !== key) return null;

                    const categoryTools = tools
                        .filter(t => t.category === key)
                        .filter(t =>
                            searchQuery === "" ||
                            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                    if (categoryTools.length === 0) return null;

                    return (
                        <div key={key} className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {label}
                                <span className="text-sm font-normal text-muted">
                                    ({categoryTools.length})
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryTools.map((tool) => (
                                    <Link
                                        key={tool.id}
                                        href={`/tools/${tool.slug}`}
                                        className="group glass p-6 rounded-2xl border border-border hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/20"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {tool.icon === "Sparkles" && <Sparkles className="w-6 h-6 text-accent" />}
                                                {/* Add more icon mappings as needed */}
                                            </div>
                                            {tool.pro && (
                                                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-lg">
                                                    PRO
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-muted mb-4 line-clamp-2">
                                            {tool.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open Tool
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
