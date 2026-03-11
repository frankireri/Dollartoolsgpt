export interface Tool {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: "text" | "developer" | "image" | "utility" | "ai";
    icon: string;
    pro?: boolean;
}

export const tools: Tool[] = [
    // Text Tools
    {
        id: "word-counter",
        name: "Word Counter",
        slug: "word-counter",
        description: "Count words, characters, and sentences in your text instantly.",
        category: "text",
        icon: "FileText"
    },
    {
        id: "case-converter",
        name: "Case Converter",
        slug: "case-converter",
        description: "Convert text to UPPERCASE, lowercase, Title Case, and more.",
        category: "text",
        icon: "Type"
    },
    {
        id: "lorem-ipsum",
        name: "Lorem Ipsum",
        slug: "lorem-ipsum",
        description: "Generate beautiful placeholder text for your designs.",
        category: "text",
        icon: "Layout"
    },
    {
        id: "character-count",
        name: "Character Counter",
        slug: "character-count",
        description: "Instantly count characters, spaces, lines, and sentences in your text.",
        category: "text",
        icon: "CaseSensitive"
    },
    // Developer Tools
    {
        id: "json-formatter",
        name: "JSON Formatter",
        slug: "json-formatter",
        description: "Validate and format JSON code for better readability.",
        category: "developer",
        icon: "Code"
    },
    {
        id: "qr-generator",
        name: "QR Code Generator",
        slug: "qr-generator",
        description: "Generate high-quality QR codes for URLs, text, or WiFi.",
        category: "developer",
        icon: "QrCode"
    },
    {
        id: "password-gen",
        name: "Password Generator",
        slug: "password-gen",
        description: "Create secure, random passwords to stay protected online.",
        category: "developer",
        icon: "Shield"
    },
    // Image & Media Tools
    {
        id: "image-compressor",
        name: "Image Compressor",
        slug: "image-compressor",
        description: "Compress images without losing quality. Works locally in your browser.",
        category: "image",
        icon: "Minimize"
    },
    {
        id: "image-resizer",
        name: "Image Resizer",
        slug: "image-resizer",
        description: "Change image dimensions while maintaining aspect ratio.",
        category: "image",
        icon: "Maximize"
    },
    {
        id: "image-converter",
        name: "Image Converter",
        slug: "image-converter",
        description: "Convert images between PNG, JPG, and WEBP formats.",
        category: "image",
        icon: "RefreshCw"
    },
    {
        id: "image-to-pdf",
        name: "Image to PDF",
        slug: "image-to-pdf",
        description: "Convert one or more images into a single PDF document.",
        category: "image",
        icon: "FileCode"
    },
    {
        id: "pdf-to-image",
        name: "PDF to Image",
        slug: "pdf-to-image",
        description: "Extract pages from a PDF document and save them as images.",
        category: "image",
        icon: "ImageIcon"
    },
    // PDF Advanced
    {
        id: "pdf-merge",
        name: "PDF Merger",
        slug: "pdf-merge",
        description: "Combine multiple PDF files into one single document.",
        category: "utility",
        icon: "FilePlus"
    },
    {
        id: "pdf-split",
        name: "PDF Splitter",
        slug: "pdf-split",
        description: "Separate a PDF into individual pages or sections.",
        category: "utility",
        icon: "Scissors"
    },
    {
        id: "pdf-protect",
        name: "PDF Protector",
        slug: "pdf-protect",
        description: "Add password protection and encryption to your PDF files.",
        category: "utility",
        icon: "Lock"
    },
    // SEO Tools
    {
        id: "meta-gen",
        name: "Meta Tag Generator",
        slug: "meta-gen",
        description: "Generate SEO-friendly meta tags for your website.",
        category: "developer",
        icon: "Code"
    },
    {
        id: "sitemap-gen",
        name: "Sitemap Generator",
        slug: "sitemap-gen",
        description: "Create XML sitemaps to help search engines index your site.",
        category: "developer",
        icon: "Globe"
    },
    {
        id: "keyword-density",
        name: "Keyword Density Checker",
        slug: "keyword-density",
        description: "Analyze how often specific keywords appear in your content.",
        category: "text",
        icon: "BarChart2"
    },
    {
        id: "duplicate-remover",
        name: "Remove Duplicate Lines",
        slug: "remove-duplicates",
        description: "Instantly remove duplicate lines from a list or document.",
        category: "text",
        icon: "ListFilter"
    },
    {
        id: "text-formatter",
        name: "Text Formatter",
        slug: "text-formatter",
        description: "Clean up text by removing extra spaces, symbols, and formatting.",
        category: "text",
        icon: "Scissors"
    },
    {
        id: "url-base64",
        name: "URL & Base64 Tool",
        slug: "url-base64",
        description: "Encode or decode strings using URL or Base64 algorithms.",
        category: "developer",
        icon: "RefreshCw"
    },
    // Utilities
    {
        id: "loan-calc",
        name: "Loan Calculator",
        slug: "loan-calc",
        description: "Calculate your monthly loan payments and total interest easily.",
        category: "utility",
        icon: "Calculator"
    },
    {
        id: "age-calc",
        name: "Age Calculator",
        slug: "age-calc",
        description: "Find out your exact age in years, months, and days.",
        category: "utility",
        icon: "User"
    },
    {
        id: "bmi-calc",
        name: "BMI Calculator",
        slug: "bmi-calc",
        description: "Calculate your Body Mass Index (BMI) instantly.",
        category: "utility",
        icon: "Activity"
    },
    {
        id: "percentage-calc",
        name: "Percentage Calculator",
        slug: "percentage-calc",
        description: "Solve common percentage math problems with ease.",
        category: "utility",
        icon: "Percent"
    },
    {
        id: "currency-converter",
        name: "Currency Converter",
        slug: "currency-converter",
        description: "Get real-time exchange rates for global currencies.",
        category: "utility",
        icon: "Globe"
    },
    // PDF Editor Suite
    {
        id: "pdf-rotate",
        name: "PDF Rotator",
        slug: "pdf-rotate",
        description: "Rotate PDF pages by 90/180/270 degrees.",
        category: "utility",
        icon: "RotateCw"
    },
    {
        id: "pdf-page-manage",
        name: "PDF Page Manager",
        slug: "pdf-page-manage",
        description: "Reorder and delete PDF pages with drag & drop.",
        category: "utility",
        icon: "GripVertical"
    },
    {
        id: "pdf-compress",
        name: "PDF Compressor",
        slug: "pdf-compress",
        description: "Reduce PDF file size without losing quality.",
        category: "utility",
        icon: "Minimize2"
    },
    {
        id: "pdf-editor",
        name: "PDF Editor",
        slug: "pdf-editor",
        description: "Add text, highlights, and drawings to your PDF documents.",
        category: "utility",
        icon: "Edit",
        pro: true
    },
    // AI Tools
    {
        id: "ai-rewriter",
        name: "AI Content Rewriter",
        slug: "ai-rewriter",
        description: "Rewrite text in different tones using AI-powered algorithms.",
        category: "ai",
        icon: "Sparkles",
        pro: true
    },
    {
        id: "ai-summarizer",
        name: "AI Article Summarizer",
        slug: "ai-summarizer",
        description: "Summarize long articles and text into concise bullet points.",
        category: "ai",
        icon: "BookOpen",
        pro: true
    },
    {
        id: "ai-resume",
        name: "AI Resume Builder",
        slug: "ai-resume",
        description: "Let AI help you write a professional resume in minutes.",
        category: "ai",
        icon: "FileUser",
        pro: true
    }
];
