"use client";
import {useState, useEffect} from "react";
import {Clock, CheckCircle2, XCircle, FileText, Loader2} from "lucide-react";
import Link from "next/link";

export default function TrackApplications({hideViewAll = false} : {hideViewAll?: boolean}) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch("/api/applications/student");
                const data = await res.json();
                if (data.success)
                    setApplications(data.applications);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return {
                    icon: CheckCircle2,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    label: "Offered"
                };
            case "REJECTED":
                return {
                    icon: XCircle,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    label: "Rejected"
                };
            case "INTERVIEWING":
                return {
                    icon: Clock,
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    label: "In Progress"
                };
            default:
                return {
                    icon: Clock,
                    color: "text-secondary",
                    bg: "bg-secondary/10",
                    label: "Pending"
                };
        }
    };

    return (
        <section className="flex flex-col h-full animate-fade-in w-full">
            <div className="mb-1 flex flex-col">
                <div className="flex items-center justify-between">
                    <h2 className="font-brand text-l font-bold text-primary leading-none mb-1">
                        Track Applications
                    </h2>
                    {!hideViewAll && (
                        <Link href="/profile?tab=history"
                              className="text-secondary opacity-60 hover:opacity-100 font-sans text-sm font-bold transition-opacity">
                            View All &rarr;
                        </Link>
                    )}
                </div>
                <span className="font-brand font-semibold text-s text-secondary/70 mb-2">
                    Only For Native Applications
                </span>
            </div>

            <div className="w-full h-96 overflow-y-auto rounded-3xl border border-secondary/10 shadow-sm glass-panel p-4 flex flex-col gap-3">
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-60"/>
                    </div>
                ) : applications.length > 0 ? (
                    applications.map((app: any) => {
                        const {icon: StatusIcon, color, bg, label} = getStatusConfig(app.status);
                        return (
                            <div key={app.id}
                                 className="w-full border border-secondary/10 p-4 rounded-2xl flex flex-col gap-2 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex flex-col">
                                        <h4 className="font-brand font-bold text-primary text-m line-clamp-1">
                                            {app.internship.title}
                                        </h4>
                                        <p className="text-s font-sans text-secondary/70">
                                            {app.internship.company.name}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded0lg text-xs font-bold flex items-center gap-1 ${bg} ${color}`}>
                                        <StatusIcon className="w-3 h-3"/>
                                        {label}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-secondary/5 text-xs text-secondary/60 font-bold">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-3 h-3"/>
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </span>
                                    <span>
                                        {app.internship.location}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <FileText className="w-10 h-10 text-primary opacity-30 mb-4"/>
                        <h3 className="font-brand text-m font-bold text-primary mb-1">
                            No applications
                        </h3>
                        <p className="font-sans text-s text-secondary opacity-80">
                            When you apply for native jobs, their statuses will track here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}