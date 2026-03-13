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
import PDFRotator from "@/components/tools/PDFRotator";
import PDFPageManager from "@/components/tools/PDFPageManager";
import PDFCompressor from "@/components/tools/PDFCompressor";
import PDFEditor from "@/components/tools/PDFEditor";
import AudioConverter from "@/components/tools/AudioConverter";
import AudioTrimmer from "@/components/tools/AudioTrimmer";
import VideoToMP3 from "@/components/tools/VideoToMP3";
import VideoCompressor from "@/components/tools/VideoCompressor";
import VideoToGIF from "@/components/tools/VideoToGIF";
import VideoMuter from "@/components/tools/VideoMuter";
import VideoTrimmer from "@/components/tools/VideoTrimmer";
import VideoSpeedChanger from "@/components/tools/VideoSpeedChanger";
import VideoReverse from "@/components/tools/VideoReverse";
import VideoResizer from "@/components/tools/VideoResizer";
import GIFToVideo from "@/components/tools/GIFToVideo";
import AudioMerger from "@/components/tools/AudioMerger";
import AudioBooster from "@/components/tools/AudioBooster";
import AudioSpeedChanger from "@/components/tools/AudioSpeedChanger";
import BacklinkChecker from "@/components/tools/BacklinkChecker";
import AudioCompressor from "@/components/tools/AudioCompressor";
import AudioReverse from "@/components/tools/AudioReverse";
import SilenceRemover from "@/components/tools/SilenceRemover";
import MP3TagEditor from "@/components/tools/MP3TagEditor";
import AudioWaveformGenerator from "@/components/tools/AudioWaveformGenerator";
import StereoMonoConverter from "@/components/tools/StereoMonoConverter";
import AudioNoiseGate from "@/components/tools/AudioNoiseGate";
import AudioEffects from "@/components/tools/AudioEffects";
import MP3ToVideo from "@/components/tools/MP3ToVideo";
import AudioStudio from "@/components/tools/AudioStudio";
import BulkAudioConverter from "@/components/tools/BulkAudioConverter";
import BulkImageOptimizer from "@/components/tools/BulkImageOptimizer";
import BulkVideoToMP3 from "@/components/tools/BulkVideoToMP3";
import BulkPDFToImage from "@/components/tools/BulkPDFToImage";
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
            case "duplicate-remover": return <DuplicateRemover />;
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
            case "pdf-rotate": return <PDFRotator />;
            case "pdf-page-manage": return <PDFPageManager />;
            case "pdf-compress": return <PDFCompressor />;
            case "pdf-editor": return <PDFEditor />;
            case "audio-converter": return <AudioConverter />;
            case "audio-trimmer": return <AudioTrimmer />;
            case "video-to-mp3": return <VideoToMP3 />;
            case "video-compressor": return <VideoCompressor />;
            case "video-to-gif": return <VideoToGIF />;
            case "video-muter": return <VideoMuter />;
            case "video-trimmer": return <VideoTrimmer />;
            case "video-speed": return <VideoSpeedChanger />;
            case "video-reverse": return <VideoReverse />;
            case "video-resize": return <VideoResizer />;
            case "gif-to-video": return <GIFToVideo />;
            case "audio-merger": return <AudioMerger />;
            case "audio-booster": return <AudioBooster />;
            case "audio-speed": return <AudioSpeedChanger />;
            case "backlink-check": return <BacklinkChecker />;
            case "audio-compress": return <AudioCompressor />;
            case "audio-reverse": return <AudioReverse />;
            case "audio-silence": return <SilenceRemover />;
            case "audio-tags": return <MP3TagEditor />;
            case "audio-waveform": return <AudioWaveformGenerator />;
            case "audio-channels": return <StereoMonoConverter />;
            case "audio-noise": return <AudioNoiseGate />;
            case "audio-effects": return <AudioEffects />;
            case "mp3-to-video": return <MP3ToVideo />;
            case "audio-studio": return <AudioStudio />;
            case "bulk-mp3-converter": return <BulkAudioConverter />;
            case "bulk-image-optimizer": return <BulkImageOptimizer />;
            case "bulk-video-to-mp3": return <BulkVideoToMP3 />;
            case "bulk-pdf-to-image": return <BulkPDFToImage />;
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
            <CreditShield slug={slug} requiresMembership={tool.requiresMembership}>
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
