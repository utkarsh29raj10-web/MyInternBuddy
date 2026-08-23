import React from 'react';
import Link from 'next/link';
import LoginButton from "@/components/LoginButton";

export default function LandingPage() {
    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">

            {/* The background glow MUST be self-closing (/>) so it doesn't wrap the text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none -z-10" />

            <h1 className="font-brand text-xl font-bold text-primary mb-6 max-w-3xl leading-tight mt-10">
                Launch Your Career with
                <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-secondary">
                    MyInternBuddy
                </span>
            </h1>

            <p className="font-sans text-l text-secondary opacity-80 mb-10 max-w-2xl">
                The ultimate platform for the workforce of tomorrow. Find your perfect internship or intern today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 z-10">
                <Link href="/internships"
                      className="px-8 py-4 bg-primary text-background font-medium font-sans text-m rounded-md hover:opacity-80 active:opacity-60 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Find Opportunities
                </Link>

                <LoginButton
                    text="Hire Talent"
                    className="!px-8 !py-4 !bg-transparent !border-2 border-primary text-primary font-medium font-sans text-m rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md !hover:-translate-y-1"
                />
            </div>
        </div>
    );
}