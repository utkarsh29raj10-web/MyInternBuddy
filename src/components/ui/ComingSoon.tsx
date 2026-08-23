import React from "react";
import {Hammer, Sparkles} from "lucide-react";
import Link from "next/link";

export function ComingSoon(
    {
        title = "Working Hard for you",
        description = "We are in the foundry to bring more of this very soon."
    }) {
    return (
        <div className="w-full h-min flex items-center justify-center px-6 animate-fade-in">
            <div className="max-w-md w-full bg-gradient-to-br from-secondary to-background p-[1px] rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="w-full h-full bg-background/70 backdrop-blur-xl p-10 rounded-3xl flex flex-col items-center text-center gap-4 relative z-10">
                    <div className="relative mt-2">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"/>
                        <div className="w-24 h-24 bg-secondary/80 border border-secondary/20 rounded-2xl flex items-center justify-center relative z-10 rotate-3 hover:-rotate-3 transition-transform duration-500 shadow-inner">
                            <Hammer className="w-12 h-12 text-background"/>
                        </div>
                    </div>

                    <h1 className="font-brand text-2xl font-bold text-primary mt-4">
                        {title}
                    </h1>

                    <p className="font-sans text-sm text-secondary opacity-80 leading-related max-w-[250px]">
                        {description}
                    </p>

                    <Link
                        href="/"
                        className="mt-6 px-6 py-2.5 bg-background/40 border border-primary text-primary font-bold font-sans text-sm rounded-xl hover:bg-primary/20 hover:-translate-y-0.5 transition-all"
                    >
                        &larr; Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}