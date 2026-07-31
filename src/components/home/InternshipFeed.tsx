"use client"

import {useState, useEffect, useRef, useCallback} from "react";
import InternshipCard from "./InternshipCard";
import {useSearchParams} from "next/navigation";
import {Search, MapPin, Loader2} from "lucide-react";

export default function InternshipFeed() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [internships, setInternships] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    const fetchInternships = async (pageNum: number, isNewSearch = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append("q", query);
            if (location) params.append("location", location);
            params.append("page", pageNum.toString());

            if (nextPageToken && !isNewSearch) {
                params.append("token", nextPageToken);
            }

            const res = await fetch(`/api/internships?${params.toString()}`);
            const data = await res.json();

            if (data.success && data.data) {
                if (data.nextPageToken !== undefined) {
                    setNextPageToken(data.nextPageToken);
                }

                if (isNewSearch) {
                    setInternships(data.data);
                    setHasMore(data.data.length === 10);
                }
                else {
                    setInternships((prev) => {
                        const newUniqueJobs = data.data.filter(
                            (newJob: any) => !prev.some((prevJob) => prevJob.id === newJob.id)
                        );

                        return [...prev, ...newUniqueJobs];
                    });

                    if (data.data.length < 10) setHasMore(false);
                }
            }
        }
        catch (error) {
            console.error("Failed to fetch internships:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setHasMore(true);
        setNextPageToken(null);
        fetchInternships(1, true);
    };

    useEffect(() => {
        fetchInternships(1, true);
    }, []);

    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchInternships(nextPage, false);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, query, location, page]
    );

    return (
        <div className="w-full flex flex-col items-center gap-12 animate-fade-in pb-24">
            <form
                onSubmit={handleSearch}
                className="w-full max-w-4xl bg-background/80 backdrop-blur-md border border-secondary/20 p-1 rounded-full flex flex-col md:flex-row gap-2 sticky top-24 z-30 shadow-xl"
            >
                <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-6 w-5 h-5 text-secondary opacity-60"/>
                    <input
                        type="text"
                        placeholder="Job Title (e.g. Frontend)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent pl-14 pr-4 py-1 outline-none text-primary font-sans text-m placeholder-secondary/60"
                    />
                </div>

                <div className="w-px bg-secondary/20 hidden md:block my-2"/>

                <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-6 w-5 h-5 text-secondary opacity-60"/>
                    <input
                        type="text"
                        placeholder="Location (e.g. Remote)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-transparent pl-14 pr-4 py-2 outline-none text-primary font-sans text-m placeholder-secondary/60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-primary text-background font-brand font-bold text-m rounded-full hover:opacity-80 transition-opacity w-full md:w-auto disabled:opacity-50"
                >
                    {loading && page === 1 ? "Searching..." : "Search"}
                </button>
            </form>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                {internships.map((job, index) => {
                    if (internships.length === index + 1) {
                        return (
                            <div ref={lastElementRef} key={job.id}>
                                <InternshipCard job={job}/>
                            </div>
                        );
                    }
                    else return <InternshipCard key={job.id} job={job}/>;
                })}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-60"/>
                </div>
            )}

            {!hasMore && internships.length > 0 && (
                <p className="text-secondary opacity-60 font-sans font-bold py-8">
                    You've reached the end of the list
                </p>
            )}

            {!loading && internships.length === 0 && (
                <p className="text-secondary opacity-60 font-sans font-bold py-8 text-center max-w-md">
                    No internships . Please try again with different keywords or location.
                </p>
            )}
        </div>
    );
}
