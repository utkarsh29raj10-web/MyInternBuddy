import InternshipFeed from "@/components/home/InternshipFeed";
import {Suspense} from "react";

export default function InternshipPage() {
    return (
        <div className="w-full flex flex-col items-center pt-24 px-4 min-h-screen bg-background">
            <div className="text-center max-w-3xl mb-12 animate-fade-in">
                <h1 className="font-brand font-bold text-xl leading-tight mb-4 text-primary">
                    Live
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
                        Opportunities
                    </span>
                </h1>
                <p className="font-sans text-secondary text-m leading-relaxed max-w-2xl mx-auto">
                    From across the world wide web.
                </p>
            </div>

            <Suspense fallback={
                <div className="w-full text-center text-secondary py-10 font-sans font-bold">
                    Loading Opportunites
                </div>
            }>
                <InternshipFeed/>
            </Suspense>
        </div>
    );
}