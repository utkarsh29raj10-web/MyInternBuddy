import {ComingSoon} from "@/components/ui/ComingSoon";
import { Briefcase, Users } from "lucide-react";

export default function RecruiterHome() {
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
                                Need to fill roles faster? Contact our sales team to get priority listings and AI-driven candidate filters.
                            </p>
                            <button className="mt-2 px-5 py-2 bg-background text-primary font-bold font-sans text-s rounded-lg hover:bg-background/80 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-brand text-l font-bold text-primary">
                                Applicant Pipeline
                            </h2>
                            <button className="text-secondary pr-4 opacity-60 hover:opacity-100 active:opacity-60 font-sans text-s font-bold transition-opacity">
                                View All
                            </button>
                        </div>

                        <div className="w-full h-[400px] rounded-3xl border border-secondary/20 shadow-sm glass-panel flex flex-col items-center justify-center p-6 text-center">
                            <Users className="w-12 h-12 text-primary opacity-30 mb-4 animate-pulse"/>
                            <h3 className="font-brand text-m font-bold text-primary mb-1">
                                Pipeline Empty
                            </h3>
                            <p className="font-sans text-s text-secondary opacity-70">
                                Your interactice applicant Kanban board will appear here
                            </p>
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1 flex flex-col gap-10">
                    <section>
                        <h2 className="font-brand text-l font-bold text-primary mb-6">
                            Active Listings
                        </h2>
                        <div className="w-full h-48 rounded-3xl border border-secondary/20 shadow-sm glass-panel flex flex-col items-center justify-center p-6 text-center mb-8">
                            <Briefcase className="w-10 h-10 text-primary opacity-30 mb-4 animate-pulse"/>
                            <p className="font-sans text-s text-secondary opacity-70">
                                Listing performance metrics
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}