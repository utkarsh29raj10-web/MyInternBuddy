"use client";

import {useState} from "react";
import {Bookmark, MapPin, Banknote, Clock, ExternalLink, Send, X, Loader2} from "lucide-react";

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
        isNative?: boolean;
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

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [applyError, setApplyError] = useState("");
    const [applySuccess, setApplySuccess] = useState(false);

    const handleNativeApply = async () => {
        setIsApplying(true);
        setApplyError("");

        try {
            const res = await fetch("/api/applications/native", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({internshipId: job.id, coverLetter})
            });
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.error || "Failed to apply");

            setApplySuccess(true);
            setTimeout(() => {
                setShowApplyModal(false);
                setApplySuccess(false);
            }, 3000);
        }
        catch (error: any) {
            setApplyError(error.message);
        }
        finally {
            setIsApplying(false);
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
                {job.isNative ? (
                    <button
                        onClick={() => setShowApplyModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-primary text-background font-sans font-bold text-s rounded-xl hover:opacity-80 transition-opacity shadow-md"
                    >
                        Easy Apply
                        <Send className="w-4 h-4"/>
                    </button>
                ) : (
                    <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 bg-primary text-background font-sans font-bold text-s rounded-xl hover:opacity-80 transition-opacity shadow-md"
                    >
                        Apply Now
                        <ExternalLink className="w-4 h-4"/>
                    </a>
                )}
            </div>

            {showApplyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
                     onClick={() => setShowApplyModal(false)}
                >
                    <div className="w-full max-w-lg bg-background border border-secondary/20 rounded-3xl p-8 shadow-2xl relative"
                         onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setShowApplyModal(false)}
                                className="absolute top-6 right-6 text-secondary/50 hover:text-primary transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>

                        {applySuccess ? (
                            <div className="py-8 text-center animate-fade-in">
                                <h3 className="text-2xl font-brand font-bold text-primary mb-2">
                                    Applied Successfully!
                                </h3>
                                <p className="text-secondary/80 font-sans">
                                    Your application will be reviewed shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-brand font-bold text-primary mb-2">
                                    Apply to {job.company}
                                </h3>
                                <p className="text-secondary/80 text-sm font-sans mb-6">
                                    Your profile & resume will be attached automatically.
                                </p>

                                {applyError &&
                                    <p className="text-red-500 text-sm mb-4 font-bold bg-red-500/10 p-3 rounded-xl">
                                        {applyError}
                                    </p>
                                }

                                <label className="text-sm font-brand font-bold text-secondary/80 mb-2 block">
                                    Why should we hire you? (Optional)
                                </label>

                                <textarea
                                    rows={5}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary transition-all resize-none mb-6"
                                    placeholder="I'm a great fit because..."
                                />

                                <button
                                    onClick={handleNativeApply}
                                    disabled={isApplying}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-background font-brand font-bold text-lg rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 shadow-xl"
                                >
                                    {isApplying
                                        ? <Loader2 className="w-5 h-5 animate-spin"/>
                                        : "Submit Application"
                                    }
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
