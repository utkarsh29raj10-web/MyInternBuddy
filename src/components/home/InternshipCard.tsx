"use client";

import {useState} from "react";
import {Bookmark, MapPin, Banknote, Clock, ExternalLink} from "lucide-react";

interface InternshipCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        stipend?: string | null;
        duration?: string | null;
        applyLink: string;
        sourcePlatform?: string | null;
        postedAt?: Date | null;
    };
    isInitiallySaved?: boolean;
}

export default function InternshipCard({job, isInitiallySaved = false}: InternshipCardProps) {
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [isSaving, setIsSaving] = useState(false);

    const toggleSave = async () => {
        if (isSaving)
            return;
        setIsSaving(true);

        const previousState = isSaved;
        setIsSaved(!isSaved);

        try {
            const method = previousState ? "DELETE" : "POST";
            const url = previousState
                ? `/api/internships/save?internshipId=${job.id}`
                : `/api/internships/save`;

            const res = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: previousState ? undefined : JSON.stringify({internshipId: job.id})
            });

            if (!res.ok) {
                setIsSaved(previousState);
                if (res.status === 401) alert("Please login before proceeding.");
            }
        }
        catch (error) {
            setIsSaving(previousState);
        }
        finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-background/60 backdrop-blur-md border border-secondary/20 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-brand font-bold text-primary text-m leading-tight mb-1">
                        {job.title}
                    </h3>
                    <p className="font-sans text-secondary font-bold text-s opacity-90">
                        {job.company}
                    </p>
                </div>
                <button
                    onClick={toggleSave}
                    disabled={isSaving}
                    className="p-2 bg-secondary/5 rounded-full hover:bg-secondary/10 transition-colors text-primary"
                    title={isSaved? "Unsave" : "Save Internship"}
                >
                    {isSaved
                        ? <Bookmark className="w-5 h-5 text-primary" fill="currentColor"/>
                        : <Bookmark className="w-5 h-5 opacity-60"/>
                    }
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/5 rounded-lg text-primary text-xs font-sans font-bold">
                    <MapPin className="w-3.5 h-3.5 opacity-60"/>
                    {job.location}
                </div>
                {job.stipend && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-xs font-sans font-bold">
                        <Banknote className="w-3.5 h-3.5 opacity-60"/>
                        {job.stipend}
                    </div>
                )}
                {job.duration && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/5 rounded-lg text-primary text-xs font-sans font-bold">
                        <Clock className="w-3.5 h-3.5 opacity-60"/>
                        {job.duration}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-secondary/10 flex justify-between items-center">
                <span className="text-xs font-sans text-secondary opacity-60">
                    via {job.sourcePlatform || "Google Jobs"}
                </span>
                <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-background font-sans font-bold text-s rounded-xl hover:opacity-90 transition-opacity shadow-md"
                >
                    Apply Now
                    <ExternalLink className="w-4 h-4"/>
                </a>
            </div>
        </div>
    );
}
