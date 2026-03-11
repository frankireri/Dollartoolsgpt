"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FolderOpen, Calendar, Filter, Download, Trash2, FileText, Image as ImageIcon, FileCode, ArrowRight } from "lucide-react";
import Link from "next/link";
import { listUserFiles, downloadFile, deleteFile } from "@/lib/fileStorage";

interface Project {
    id: string;
    projectId: string;
    userId: string;
    toolType: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
}

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date" | "name">("date");

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const projectsData = await listUserFiles();
            setProjects(projectsData);
        } catch (error) {
            console.error("Fetch projects error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (project: Project) => {
        try {
            await downloadFile(project.projectId, project.fileName);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download file");
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await deleteFile(projectId);
            setProjects(projects.filter(p => p.projectId !== projectId));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete file");
        }
    };

    const filteredProjects = projects
        .filter(p => filterType === "all" || p.toolType === filterType)
        .sort((a, b) => {
            if (sortBy === "date") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return a.fileName.localeCompare(b.fileName);
        });

    const toolTypes = ["all", "pdf", "image", "text", "dev"];

    const getIcon = (type: string) => {
        switch (type) {
            case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
            case "image": return <ImageIcon className="w-5 h-5 text-blue-500" />;
            case "text": return <FileText className="w-5 h-5 text-green-500" />;
            case "dev": return <FileCode className="w-5 h-5 text-purple-500" />;
            default: return <FolderOpen className="w-5 h-5 text-muted" />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <FolderOpen className="w-16 h-16 text-muted mx-auto" />
                    <h2 className="text-2xl font-bold">Sign in to view your projects</h2>
                    <p className="text-muted">Log in with Google to save and access your work</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl transition-all"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black gradient-text mb-2">My Projects</h1>
                        <p className="text-muted">View and manage your saved work</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 glass rounded-xl border border-border">
                            <span className="text-sm text-muted mr-2">Total:</span>
                            <span className="font-bold text-accent">{filteredProjects.length}</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-accent" />
                        <h3 className="font-bold">Filters</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {toolTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize ${filterType === type
                                    ? "bg-accent text-white"
                                    : "bg-background border border-border hover:border-accent/50"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <span className="text-sm text-muted">Sort by:</span>
                        <button
                            onClick={() => setSortBy("date")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${sortBy === "date" ? "bg-accent text-white" : "hover:bg-accent/10"
                                }`}
                        >
                            Date
                        </button>
                        <button
                            onClick={() => setSortBy("name")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${sortBy === "name" ? "bg-accent text-white" : "hover:bg-accent/10"
                                }`}
                        >
                            Name
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <FolderOpen className="w-16 h-16 text-muted/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                        <p className="text-muted mb-6">
                            {filterType === "all"
                                ? "Start using our tools to create your first project"
                                : `No ${filterType} projects found`}
                        </p>
                        <Link
                            href="/tools"
                            className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl transition-all"
                        >
                            Browse Tools
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                        {getIcon(project.toolType)}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDownload(project)}
                                            className="p-2 hover:bg-accent/10 rounded-lg transition-all"
                                        >
                                            <Download className="w-4 h-4 text-accent" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.projectId)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-2 truncate group-hover:text-accent transition-colors">{project.fileName}</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-muted">
                                        <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-accent/5 px-2 py-1 rounded-md border border-accent/10 text-accent font-medium">
                                            <span className="capitalize">{project.toolType}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted">
                                        <span className="font-mono">{(project.fileSize / 1024).toFixed(2)} KB</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-accent font-semibold">
                                            View Project <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
