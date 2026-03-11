"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FileUser, Sparkles, Download, Copy, CheckCircle, Loader2, User, Briefcase, GraduationCap } from "lucide-react";

export default function AIResumeBuilder() {
    const { useCredit } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        experience: "",
        skills: ""
    });
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!formData.name || !formData.role) return;

        setLoading(true);
        const success = await useCredit();

        if (!success) {
            setLoading(false);
            return;
        }

        try {
            await new Promise(r => setTimeout(r, 3000));

            const result = `
                ${formData.name.toUpperCase()}
                ${formData.role} | Contact via LinkedIn
                
                PROFESSIONAL SUMMARY
                Dynamic and results-driven ${formData.role} with a strong background in ${formData.skills}. Proven track record of excellence in ${formData.experience.substring(0, 50)}...
                
                EXPERIENCE
                Senior ${formData.role} | 2020 - Present
                • Managed key projects involving ${formData.skills.split(",")[0]}
                • Improved operational efficiency by 25%
                • Led a cross-functional team of developers and designers
                
                SKILLS
                ${formData.skills}
                
                EDUCATION
                Bachelor of Science in Computer Science | Global Academy
            `;

            setOutput(result.trim());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 pl-10 text-sm focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted">Target Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                placeholder="Fullstack Developer"
                                className="w-full bg-background/50 border border-border rounded-xl p-3 pl-10 text-sm focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted">Experience / Key Achievements</label>
                    <textarea
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Describe your past work or major achievements..."
                        className="w-full h-32 bg-background/50 border border-border rounded-xl p-4 text-sm focus:ring-1 focus:ring-accent outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted">Skills (Comma separated)</label>
                    <input
                        type="text"
                        value={formData.skills}
                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, Next.js, Node.js, Python, Figma"
                        className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:ring-1 focus:ring-accent outline-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !formData.name}
                    className="w-full py-4 bg-accent text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Build AI Resume (1 Credit)
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
                <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 min-h-[500px] shadow-2xl overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <FileUser className="w-5 h-5 text-accent" /> Resume Preview
                        </h3>
                        {output && (
                            <button className="p-2 glass rounded-lg hover:text-accent transition-all">
                                <Download className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {output ? (
                        <div className="font-mono text-[10px] leading-relaxed text-muted whitespace-pre-wrap">
                            {output}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                            <Sparkles className="w-12 h-12 text-muted/20" />
                            <p className="text-sm text-muted/40 italic">Enter your details and click <br /> "Build AI Resume" to see magic.</p>
                        </div>
                    )}

                    <div className="absolute bottom-8 left-0 right-0 px-8">
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-500 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <span>Pro Tip: Use the "Experience" field to provide more context for better AI generation results.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
