// import {ComingSoon} from "@/components/ui/ComingSoon";
import {Search, MapPin, Clock} from "lucide-react";
import TrackApplications from "./TrackApplications";

export default function StudentHome() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-32 px-6 pb-12 animate-fade-in">
            <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none -z-10"/>

                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
                    <h1 className="font-brand text-xl font-bold text-primary mb-4 leading-tight">
                        Find Your Next <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Big Opportunity
                        </span>
                    </h1>

                    <p className="font-sans text-m text-secondary opacity-80 mb-8 max-w-lg">
                        Explore thousands of opportunities aggregated from across the world.
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
                    {/*change here*/}
                    <form action="/internships" method="GET" className="w-full max-w-md glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl border border-secondary/10">
                        <h2 className="font-sans font-semibold text-primary text-m mb-2">
                            Quick Search
                        </h2>

                        <div className="relative w-full">
                            <input
                                type="text"
                                name="q"
                                placeholder="Job title or keywords..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background/50 text-primary font-sans text-r border border-secondary/20 focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50 shadow-inner"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5"/>
                        </div>

                        <div className="relative w-full">
                            <input
                                type="text"
                                name="location"
                                placeholder="Location | Default: Remote)"
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background/50 text-primary font-sans text-r border border-secondary/20 focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50 shadow-inner"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5"/>
                        </div>

                        <button className="w-full h-12 mt-2 bg-primary text-background font-medium font-sans text-m rounded-xl hover:opacity-80 active:opacity-60 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                            Search Opportunities
                        </button>
                    {/*change here*/}
                    </form>
                </div>
            </section>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-10">
                    <section>
                        <h2 className="font-brand text-l font-bold text-primary mb-6">
                            Hot Listings
                        </h2>

                        <div className="w-full h-80 rounded-3xl border border-secondary/10 shadow-sm glass-panel flex flex-col items-center justify-center p-6 text-center">
                            <Clock className="w-12 h-12 text-primary opacity-30 mb-4 animate-pulse"/>
                            <h3 className="font-brand text-m font-bold text-primary mb-1">
                                My Feed
                            </h3>

                            <p className="font-sans text-s text-secondary opacity-70">
                                Hot Opportunities will appear here
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-brand text-l font-bold text-primary mb-6">
                            Recently Viewed
                        </h2>

                        <div className="w-full h-64 rounded-3xl border border-secondary/10 shadow-sm glass-panel flex flex-col items-center justify-center p-6 text-center">
                            <Clock className="w-10 h-10 text-primary opacity-30 mb-4 animate-pulse"/>
                            <h3 className="font-brand text-m font-bold text-primary mb-1">
                                Recently Viewed
                            </h3>
                            <p className="font-sans text-s text-secondary opacity-70">
                                Your recently viewed listings will appear here.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1 flex flex-col gap-10">
                    <TrackApplications/>
                </div>
            </div>
        </div>
    );
}