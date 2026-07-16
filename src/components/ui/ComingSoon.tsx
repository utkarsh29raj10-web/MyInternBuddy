import React from "react";
import {GlassCard} from "./GlassCard";
import {Clock} from "lucide-react";

export function ComingSoon(
    {
        title = "Coming Soon",
        description = "We are working hard to bring you this feature SOON."
    }) {
    return (
        <div className="w-full h-full min-h-[70vh] flex items-center justify-center p-4 animate-fade-in">
            <GlassCard className="max-w-lg w-full flex flex-col items-center text-center gap-4 py-16">
                <Clock className="w-16 h-16 text-primary opacity-50 mb-2 animate-pulse"/>
                <h1 className="font-brand text-xl font-bold text-primary">
                    {title}
                </h1>
                <p className="font-sans text-m text-secondary opacity-80">
                    {description}
                </p>
            </GlassCard>
        </div>
    );
}