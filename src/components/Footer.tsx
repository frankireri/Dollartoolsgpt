import Link from "next/link";
import { Calculator, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-border glass py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="p-2 bg-accent rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                                <Calculator className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary">
                                DollarTools
                            </span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed">
                            Premium online tools for developers, writers, and entrepreneurs. Fast, free, and beautiful.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <Link href="#" className="p-2 rounded-full glass hover:text-accent transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full glass hover:text-accent transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full glass hover:text-accent transition-colors">
                                <Mail className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-4">Writing & Text</h3>
                        <ul className="space-y-2">
                            <li><Link href="/tools/word-counter" className="text-muted text-sm hover:text-accent transition-colors">Word Counter</Link></li>
                            <li><Link href="/tools/case-converter" className="text-muted text-sm hover:text-accent transition-colors">Case Converter</Link></li>
                            <li><Link href="/tools/lorem-ipsum" className="text-muted text-sm hover:text-accent transition-colors">Lorem Ipsum</Link></li>
                            <li><Link href="/tools/character-count" className="text-muted text-sm hover:text-accent transition-colors">Character Counter</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-foreground font-semibold mb-4">Developer Tools</h3>
                        <ul className="space-y-2">
                            <li><Link href="/tools/json-formatter" className="text-muted text-sm hover:text-accent transition-colors">JSON Formatter</Link></li>
                            <li><Link href="/tools/qr-generator" className="text-muted text-sm hover:text-accent transition-colors">QR Generator</Link></li>
                            <li><Link href="/tools/url-base64" className="text-muted text-sm hover:text-accent transition-colors">Base64</Link></li>
                            <li><Link href="/tools/password-gen" className="text-muted text-sm hover:text-accent transition-colors">Password Generator</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-foreground font-semibold mb-4">Calculators</h3>
                        <ul className="space-y-2">
                            <li><Link href="/tools/bmi-calc" className="text-muted text-sm hover:text-accent transition-colors">BMI Calculator</Link></li>
                            <li><Link href="/tools/unit-converter" className="text-muted text-sm hover:text-accent transition-colors">Unit Converter</Link></li>
                            <li><Link href="/tools/percentage-calc" className="text-muted text-sm hover:text-accent transition-colors">Percentage Calc</Link></li>
                            <li><Link href="/tools/age-calc" className="text-muted text-sm hover:text-accent transition-colors">Age Calculator</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted text-xs">
                        © {new Date().getFullYear()} DollarTools. All rights reserved. Built with love in Kenya.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-muted text-xs hover:text-accent transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-muted text-xs hover:text-accent transition-colors">Privacy</Link>
                        <Link href="/contact" className="text-muted text-xs hover:text-accent transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
