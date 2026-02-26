import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
    title: 'About Us — AI Speaking Object | SaaS Video Creation Platform',
    description: 'AI Speaking Object is a SaaS video creation platform that helps content creators, marketing agencies, and local businesses generate viral talking-object videos using Google Gemini, Imagen 3, and Veo 3.1.',
    keywords: ['AI video generator', 'talking object', 'viral reels', 'SaaS', 'Google Veo', 'Imagen 3', 'Gemini', 'lip sync video', 'scroll-stopper ads'],
};

// Schema.org JSON-LD
const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Speaking Object",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web, Android",
    "description": "A SaaS video creation platform that helps content creators, marketing agencies, and local businesses generate viral talking-object videos and scroll-stopping ads using AI (Google Gemini, Imagen 3, and Veo 3.1).",
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "29.00",
        "highPrice": "299.00",
        "priceCurrency": "BRL",
        "offerCount": "3"
    },
    "featureList": [
        "AI Script Generation (Google Gemini)",
        "3D Character Generation (Google Imagen 3)",
        "Lip-Sync Video Animation (Google Veo 3.1)",
        "Dynamic Background Scenarios",
        "Automated Logo Insertion"
    ],
    "url": "https://talkingobjects-android.vercel.app"
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is AI Speaking Object?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI Speaking Object is a SaaS platform that uses Google's AI stack (Gemini, Imagen 3, and Veo 3.1) to generate viral talking-object videos for Instagram Reels, TikTok, and YouTube Shorts."
            }
        },
        {
            "@type": "Question",
            "name": "Which AIs does the application use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The platform uses three core Google AI models: Gemini 2.0 Flash for script writing, Imagen 3.0 for photorealistic 3D character generation, and Veo 3.1 for lip-synced video animation."
            }
        },
        {
            "@type": "Question",
            "name": "How much does it cost to generate an animated video?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Video generation costs depend on quality and duration. Fast Mode costs 15 credits (6s) or 25 credits (8s). High Quality mode costs 40 credits (6s) or 60 credits (8s). Credit packages start at R$29 for 35 credits."
            }
        }
    ]
};

export default function AboutPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <AboutContent />
        </>
    );
}
