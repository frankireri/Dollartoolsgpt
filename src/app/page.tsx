"use client";

import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  FileText,
  Code,
  Layout,
  Image as ImageIcon,
  Calculator as CalcIcon,
  MessageSquare,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Writing & Text",
    id: "text",
    icon: <FileText className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400",
    tools: [
      { name: "Word Counter", slug: "word-counter" },
      { name: "Case Converter", slug: "case-converter" },
      { name: "Lorem Ipsum", slug: "lorem-ipsum" },
      { name: "Summarizer", slug: "ai-summarizer" }
    ]
  },
  {
    name: "Developer Tools",
    id: "developer",
    icon: <Code className="w-6 h-6" />,
    color: "from-purple-500 to-pink-400",
    tools: [
      { name: "JSON Formatter", slug: "json-formatter" },
      { name: "Base64", slug: "url-base64" },
      { name: "QR Generator", slug: "qr-generator" },
      { name: "Password Gen", slug: "password-gen" }
    ]
  },
  {
    name: "Media & Images",
    id: "image",
    icon: <ImageIcon className="w-6 h-6" />,
    color: "from-orange-500 to-yellow-400",
    tools: [
      { name: "Image Compressor", slug: "image-compressor" },
      { name: "Format Converter", slug: "image-converter" },
      { name: "Resizer", slug: "image-resizer" },
      { name: "Image to PDF", slug: "image-to-pdf" }
    ]
  },
  {
    name: "Utilities",
    id: "utility",
    icon: <CalcIcon className="w-6 h-6" />,
    color: "from-green-500 to-emerald-400",
    tools: [
      { name: "BMI Calculator", slug: "bmi-calc" },
      { name: "Unit Converter", slug: "unit-converter" },
      { name: "PDF Merger", slug: "pdf-merge" },
      { name: "PDF Splitter", slug: "pdf-split" }
    ]
  },
  {
    name: "AI Tools",
    id: "ai",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-400",
    tools: [
      { name: "AI Resume", slug: "ai-resume" },
      { name: "AI Rewriter", slug: "ai-rewriter" },
      { name: "PDF Editor", slug: "pdf-editor" },
      { name: "Keyword Density", slug: "keyword-density" }
    ],
    pro: true
  }
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" />
              Over 50+ Tools available
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Every tool you need, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-secondary to-accent bg-300% animate-gradient">
                all in one place.
              </span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              Fast, free, and privacy-focused online tools for developers, content creators, and students. No signup required for basic use.
            </p>

            {/* Trusted Icons / Stats */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold italic">Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                <span className="font-semibold italic">Edge Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold italic">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
              <p className="text-muted">Find the perfect tool for your task</p>
            </div>
            <Link href="/tools" className="text-accent font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View All Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-8 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                <Link href={`/tools?category=${cat.id}`} className="block group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                    {cat.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 group-hover:text-accent transition-colors">
                    {cat.name}
                    {cat.pro && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/30">PRO</span>
                    )}
                  </h3>
                </Link>

                <ul className="space-y-3">
                  {cat.tools.map(tool => (
                    <li key={tool.slug}>
                      <Link href={`/tools/${tool.slug}`} className="flex items-center justify-between text-muted hover:text-accent transition-colors group/link">
                        <span className="text-sm">{tool.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link href={`/tools?category=${cat.id}`} className="mt-8 block text-center py-3 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-sm font-semibold">
                  Explore Category
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tool / CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-16 relative overflow-hidden text-center border-accent/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <h2 className="text-4xl font-bold mb-6">Want to unlock AI tools?</h2>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
              Get unlimited access to advanced AI text generation, image manipulation, and SEO analysis for a small monthly fee or via M-Pesa credits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-accent text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-accent/40 transition-all active:scale-95">
                Go Pro Now
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-card border border-border rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">
                Learn to Earn with APIs
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-x-12 gap-y-4">
              <div className="text-sm text-muted">✓ No Credit Card Required</div>
              <div className="text-sm text-muted">✓ M-Pesa STK Push Integrated</div>
              <div className="text-sm text-muted">✓ Cancel Anytime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
