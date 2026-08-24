"use client"
import {useState, useEffect} from "react";
import InternshipCard from "@/components/home/InternshipCard";
import {Loader2, BookmarkX} from "lucide-react";

export default function SavedInternshipFeed() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/internships/saved")
            .then(res => {
                if (!res.ok)
                    throw new Error("Unable to fetch");
                return res.json();
            })
            .then(data => {
                setInternships(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center text-red-400 font-brand font-bold">
                Failed to load saved opportunities. Try again later.
            </div>
        );
    }

    if (internships.length === 0) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4 animate-fade-in opacity-80">
                <BookmarkX className="w-16 h-16 text-secondary opacity-60"/>
                <h3 className="text-l font-brand font-bold text-secondary">
                    Hmm.. Still Lazy?
                </h3>
                <p className="text-sm font-sans text-secondary/60 text-center max-w-sm">
                    It looks like you have no saved opportunities yet. Hurry before your time runs out!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
            <h3 className="text-l font-brand font-bold text-secondary mb-2">
                Saved Opportunities ({internships.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {internships.map((job) => (
                    <InternshipCard
                        key={job.id}
                        job={job}
                        isInitiallySaved={true}
                    />
                ))}
            </div>
        </div>
    );
}