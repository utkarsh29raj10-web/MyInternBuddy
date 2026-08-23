"use client";
import {useState, useEffect} from "react";
import { Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import ApplicantBoard from "@/components/profile/ApplicantBoard";

export default function RecruiterHome() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/applications/native");
                const result = await res.json();

                if (result.success) {
                    const activeListings = result.internships.filter((i: any) => i.isActive);
                    const recentApplicants = result.internships
                        .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                        .slice(0, 4);

                    setStats({activeListings, recentApplicants});
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-32 px-6 pb-12 animate-fade-in">
            <div className="fixed top-0 right-0 w-[800px] h-[600px] bg-secondary opacity-5 blur-[120px] rounded-full pointer-events-none -z-10"/>

            <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 mb-48 relative">
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
                    <h1 className="font-brand text-xl font-bold text-primary mb-2 leading-tight">
                        Recruiter Workspace
                    </h1>
                    <p className="font-sans text-m text-secondary opacity-80 max-w-md">
                        Manage your active listings, track applicants and hire top-tier talent!
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
                    <div className="w-full max-w-md bg-gradient-to-br from-primary to-secondary p-[1px] rounded-2xl shadow-xl hover:-translate-y-1 transition-transform">
                        <div className="w-full h-full bg-primary/95 backdrop-blur-md p-6 rounded-2xl flex flex-col items-start text-left gap-3 relative overflow-hidden">
                            <h2 className="font-sans font-bold text-background text-m flex items-center gap-2">
                                Unlock Premium Matching
                            </h2>
                            <p className="font-sans text-s text-foreground opacity-80">
                                Need to fill roles faster? Upgrade now to get priority featurings and AI-driven candidate filters.
                            </p>
                            <div className="mt-2 group relative w-max">
                                <Link className="px-5 py-2 inline-block bg-background text-primary font-bold font-sans text-s rounded-lg hover:bg-background/90 hover:scale-105 transition-all shadow-lg"
                                      href="/subscription"
                                >
                                    Go Premium
                                </Link>
                                {/*<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background text-primary font-bold text-xs px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg">*/}
                                {/*    Coming Soon!*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-brand text-l font-bold text-primary">
                            Applicant Pipeline
                        </h2>
                        <Link href="/profile?tab=applicants"
                              className="text-secondary pr-4 opacity-60 hover:opacity-100 active:opacity-60 font-sans text-s font-bold transition-opacity">
                            View All &rarr;
                        </Link>
                    </div>
                    <div className="w-full h-110 overflow-y-auto rounded-3xl border border-secondary/20 shadow-sm bg-background p-4 relative">
                        <ApplicantBoard/>
                    </div>
                </div>

                <div className="md:col-span-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-brand text-l font-bold text-primary">
                            Active Listings
                        </h2>
                        <Link href="/profile?tab=listings"
                              className="text-secondary pr-4 opacity-60 hover:opacity-100 active:opacity-60 font-sans text-s font-bold transition-opacity">
                            View All &rarr;
                        </Link>
                    </div>

                    <div className="w-full h-110 rounded-3xl border border-secondary/20 shadow-sm bg-background flex flex-col p-4">
                        {loading ? (
                            <div className="flex-1 flex justify-center items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50"/>
                            </div>
                        ) : stats?.activeListings?.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.activeListings.slice(0, 3).map((job: any) => (
                                    <div key={job.id}
                                         className="w-full bg-background border border-secondary/10 bg-secondary/5 p-4 rounded-xl flex flex-col gap-1 hover:border-primary/40 transition-colors">
                                        <h4 className="font-brand font-bold text-primary text-md truncate">
                                            {job.title}
                                        </h4>
                                        <p className="text-xs font-sans text-secondary/80">
                                            {job.location}
                                        </p>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-secondary/5">
                                            <span className="text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-bold">
                                                Active
                                            </span>
                                            <span className="text-xs text-secondary/60 font-bold">
                                                {job.applications?.length || 0} Applicants
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                <Briefcase className="w-10 h-10 text-primary opacity-30 mb-4"/>
                                <p className="font-sans text-sm text-secondary opacity-80">
                                    No Active Listings yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}