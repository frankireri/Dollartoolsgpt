import { tools } from "@/config/tools";
import ToolContainer from "@/components/ToolContainer";
import { notFound } from "next/navigation";
import WordCounter from "@/components/tools/WordCounter";
import JSONFormatter from "@/components/tools/JSONFormatter";
import CaseConverter from "@/components/tools/CaseConverter";
import CharacterCounter from "@/components/tools/CharacterCounter";
import LoremIpsum from "@/components/tools/LoremIpsum";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import QRCodeGenerator from "@/components/tools/QRCodeGenerator";
import UnitConverter from "@/components/tools/UnitConverter";
import ImageCompressor from "@/components/tools/ImageCompressor";
import ImageResizer from "@/components/tools/ImageResizer";
import ImageConverter from "@/components/tools/ImageConverter";
import ImageToPDF from "@/components/tools/ImageToPDF";
import PDFToImage from "@/components/tools/PDFToImage";
import DuplicateRemover from "@/components/tools/DuplicateRemover";
import TextFormatter from "@/components/tools/TextFormatter";
import URLBase64Tool from "@/components/tools/URLBase64Tool";
import PDFMerger from "@/components/tools/PDFMerger";
import PDFSplitter from "@/components/tools/PDFSplitter";
import PDFProtector from "@/components/tools/PDFProtector";
import MetaTagGenerator from "@/components/tools/MetaTagGenerator";
import SitemapGenerator from "@/components/tools/SitemapGenerator";
import KeywordDensityChecker from "@/components/tools/KeywordDensityChecker";
import LoanCalculator from "@/components/tools/LoanCalculator";
import AgeCalculator from "@/components/tools/AgeCalculator";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import BMICalculator from "@/components/tools/BMICalculator";
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import CreditShield from "@/components/auth/CreditShield";
import AIRewriter from "@/components/tools/AIRewriter";
import AISummarizer from "@/components/tools/AISummarizer";
import AIResumeBuilder from "@/components/tools/AIResumeBuilder";
import PDFRotator from "@/components/tools/PDFRotator";
import PDFPageManager from "@/components/tools/PDFPageManager";
import PDFCompressor from "@/components/tools/PDFCompressor";
import PDFEditor from "@/components/tools/PDFEditor";
interface ToolPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug } = await params;
    const tool = tools.find((t) => t.slug === slug);

    if (!tool) {
        notFound();
    }

    // Component mapping
    const renderTool = () => {
        switch (tool.id) {
            case "word-counter": return <WordCounter />;
            case "json-formatter": return <JSONFormatter />;
            case "case-converter": return <CaseConverter />;
            case "lorem-ipsum": return <LoremIpsum />;
            case "character-count": return <CharacterCounter />;
            case "password-gen": return <PasswordGenerator />;
            case "qr-generator": return <QRCodeGenerator />;
            case "unit-converter": return <UnitConverter />;
            case "image-compressor": return <ImageCompressor />;
            case "image-resizer": return <ImageResizer />;
            case "image-converter": return <ImageConverter />;
            case "image-to-pdf": return <ImageToPDF />;
            case "pdf-to-image": return <PDFToImage />;
            case "remove-duplicates": return <DuplicateRemover />;
            case "text-formatter": return <TextFormatter />;
            case "url-base64": return <URLBase64Tool />;
            case "pdf-merge": return <PDFMerger />;
            case "pdf-split": return <PDFSplitter />;
            case "pdf-protect": return <PDFProtector />;
            case "meta-gen": return <MetaTagGenerator />;
            case "sitemap-gen": return <SitemapGenerator />;
            case "keyword-density": return <KeywordDensityChecker />;
            case "loan-calc": return <LoanCalculator />;
            case "age-calc": return <AgeCalculator />;
            case "percentage-calc": return <PercentageCalculator />;
            case "bmi-calc": return <BMICalculator />;
            case "currency-converter": return <CurrencyConverter />;
            case "ai-rewriter": return <AIRewriter />;
            case "ai-summarizer": return <AISummarizer />;
            case "ai-resume": return <AIResumeBuilder />;
            case "pdf-rotate": return <PDFRotator />;
            case "pdf-page-manage": return <PDFPageManager />;
            case "pdf-compress": return <PDFCompressor />;
            case "pdf-editor": return <PDFEditor />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h2 className="text-2xl font-bold mb-4">Tool Coming Soon</h2>
                        <p className="text-muted">We are working hard to bring you {tool.name}. Stay tuned!</p>
                    </div>
                );
        }
    };

    return (
        <ToolContainer tool={tool}>
            <CreditShield slug={slug}>
                {renderTool()}
            </CreditShield>
        </ToolContainer>
    );
}

export async function generateStaticParams() {
    return tools.map((tool) => ({
        slug: tool.slug,
    }));
}
