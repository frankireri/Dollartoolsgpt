"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, Calculator, Settings, User, CreditCard } from "lucide-react";
import AuthButton from "./auth/AuthButton";
import { tools } from "@/config/tools";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    } else {
      router.push("/tools");
    }
  };

  const filteredTools = searchQuery.trim()
    ? tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-accent rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary">
                DollarTools
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search tools (e.g. PDF, BMI, JSON)..."
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-full bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-sm"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredTools.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {searchQuery.trim() ? (
                            tool.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                              part.toLowerCase() === searchQuery.toLowerCase() ? <span key={i} className="text-accent bg-accent/10">{part}</span> : part
                            ))
                          ) : tool.name}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {searchQuery.trim() ? (
                            tool.description.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                              part.toLowerCase() === searchQuery.toLowerCase() ? <span key={i} className="text-accent bg-accent/10">{part}</span> : part
                            ))
                          ) : tool.description}
                        </p>
                      </div>
                      {tool.pro && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded">
                          PRO
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Links & CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-sm font-medium text-muted hover:text-accent transition-colors">
              Tools
            </Link>
            <Link href="/projects" className="text-sm font-medium text-muted hover:text-accent transition-colors">
              My Projects
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted hover:text-accent transition-colors">
              Pricing
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-muted hover:text-accent focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-border animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/tools" className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-accent hover:bg-white/5">
              Tools
            </Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-accent hover:bg-white/5">
              Pricing
            </Link>
            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-accent font-bold">
              Login / Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
