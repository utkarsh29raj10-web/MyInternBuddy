"use client"
import {useState, useEffect} from "react";
import {Plus, Briefcase, Users, Loader2, Calendar, MapPin, ArrowLeft, Edit2, Trash2} from "lucide-react";
import RecruiterInternshipForm from "@/components/profile/RecruiterInternshipForm";
import {useSearchParams} from "next/navigation";

export default function RecruiterListings() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const searchParams = useSearchParams();
    const isCreateAction = searchParams.get("action") === "create";
    const [isCreating, setIsCreating] = useState(isCreateAction);
    const [editing, setEditing] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (isCreateAction)
            setIsCreating(true);
    }, [isCreateAction]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?"))
            return;
        setDeletingId(id);

        try {
            const res = await fetch(
                `/api/internships/native/${id}`,
                {method: "DELETE"}
            );
            if (res.ok)
                setListings(listings.filter(job => job.id !== id));
        }
        catch (error) {
            console.error("Failed to delete", error);
        }
        finally {
            setDeletingId(null);
        }
    };

    const fetchListings = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/internships/native");
            if (!res.ok)
                throw new Error("Failed to fetch");

            const data = await res.json();
            setListings(data);
        }
        catch (error) {
            console.error(error);
            setError(true);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    if (isCreating || editing) {
        return (
            <div className="w-full flex flex-col items-start justify-start animate-fade-in">
                <button
                    onClick={() => {
                        setIsCreating(false);
                        setEditing(null);
                    }}
                    className="mb-4 text-sm font-brand font-bold text-secondary/60 hover:text-primary transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4"/> Go Back
                </button>

                <RecruiterInternshipForm
                    initialData={editing}
                    onSuccess={() => {
                        setIsCreating(false);
                        setEditing(null);
                        fetchListings();
                    }}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='w-full min-h-[400px] flex items-center justify-center'>
                <Loader2 className="w-8 h-8 text-primary animate-spin"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-full min-h-[400px] flex items-center justify-center text-red-400 font-brand font-bold'>
                Something went wrong. Please try again.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full bg-secondary/5 border border-seconday/10 rounded-2xl p-6">
                <div>
                    <h3 className="text-l font-brand font-bold text-secondary mb-1">
                        Active Listings
                    </h3>

                    <p className="text-sm font-sans text-secondary/60">
                        Manage your job listings and track applicants.
                    </p>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-brand font-bold rounded-xl hover:opacity-80 transition-opacity shadow-lg shrink-0"
                >
                    <Plus className="w-4 h-4"/>
                    New Listing
                </button>
            </div>

            {listings.length === 0
                ? (
                    <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 border border-dashed border-secondary/20 rounded-2xl bg-secondary/5">
                        <Briefcase className="w-12 h-12 text-secondary/30"/>
                        <p className="text-secondary/60 font-brand font-bold">
                            No Active Listings Yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {listings.map(job => (
                            <div key={job.id}
                                 className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background/50 border border-secondary/10 hover:border-secondary/30 transition-colors rounded-2xl p-6"
                            >
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-lg font-brand font-bold text-primary flex items-center gap-3">
                                        {job.title}
                                        {job.isActive
                                            ? (
                                                <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-xs bg-secondary/10 text-secondary/60 rounded-full">
                                                    Closed
                                                </span>
                                            )
                                        }
                                    </h4>

                                    <div className="flex items-center gap-4 text-xs font-sans text-secondary/60 font-bold">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5"/>
                                            {job.location}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5"/>
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 text-secondary bg-secondary/5 px-4 py-2 rounded-xl font-brand font-bold text-sm">
                                        <Users className="w-4 h-4 text-primary"/>
                                        {job.applications?.length || 0} Applicants
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() => setEditing(job)}
                                            className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-xs font-brand font-bold text-secondary/60 hover:text-primary hover:bg-primary/10 transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            disabled={deletingId === job.id}
                                            className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-xs font-brand font-bold text-secondary/60 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === job.id
                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                                                : <Trash2 className="w-3.5 h-3.5"/>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}