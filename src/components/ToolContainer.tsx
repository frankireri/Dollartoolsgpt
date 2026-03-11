"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Info, Share2, Star } from "lucide-react";
import Link from "next/link";
import { Tool } from "@/config/tools";

interface ToolContainerProps {
    tool: Tool;
    children: React.ReactNode;
}

export default function ToolContainer({ tool, children }: ToolContainerProps) {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Tool Header */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-6 text-sm">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Tools
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                            <Star className="w-8 h-8 text-accent fill-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{tool.name}</h1>
                            <p className="text-muted">{tool.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 glass rounded-lg hover:text-accent transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 glass rounded-lg hover:text-accent transition-colors">
                            <Info className="w-5 h-5" />
                        </button>
                        {tool.pro && (
                            <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">PRO</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Tool Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-6 md:p-8 min-h-[400px] shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl -z-10" />
                {children}
            </motion.div>

            {/* Structured Content for SEO */}
            <section className="mt-16 prose prose-invert max-w-none">
                <div className="glass rounded-2xl p-8 border-border/50">
                    <h2 className="text-2xl font-bold mb-4">About {tool.name}</h2>
                    <p className="text-muted leading-relaxed">
                        {tool.name} is a free online tool designed to help you quickly {tool.description.toLowerCase()} No installation is needed, and your data stays safe in your browser.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-4">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        <li className="flex items-center gap-3 text-muted">
                            <div className="w-2 h-2 rounded-full bg-accent" /> Secure & Private
                        </li>
                        <li className="flex items-center gap-3 text-muted">
                            <div className="w-2 h-2 rounded-full bg-accent" /> 100% Free to Use
                        </li>
                        <li className="flex items-center gap-3 text-muted">
                            <div className="w-2 h-2 rounded-full bg-accent" /> Mobile Friendly
                        </li>
                        <li className="flex items-center gap-3 text-muted">
                            <div className="w-2 h-2 rounded-full bg-accent" /> Results in Real-time
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
