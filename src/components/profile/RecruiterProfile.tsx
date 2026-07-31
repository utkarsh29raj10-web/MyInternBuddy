"use client"

import {useState} from "react";
import {Building2, Briefcase, Users} from "lucide-react";

export default function RecruiterProfile() {
    const [activeTab, setActiveTab] = useState<"company" | "listings" | "applicants">("company");

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="w-full flex items-center justify-start gap-2 bg-background/40 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-x-auto">
                <button
                    onClick={() => setActiveTab("company")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duraiton-300 
                        ${activeTab === "company" 
                            ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                            : "text-secondary/60 hover:text-primary hover:bg-white/5" 
                        }
                    `}
                >
                    <Building2 className="w-4 h-4"/>
                    Company Profile
                </button>
                <button
                    onClick={() => setActiveTab("listings")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300 
                        ${activeTab === "listings"
                        ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                        : "text-secondary/60 hover:text-primary hover:bg-white/5"
                    }
                    `}
                >
                    <Building2 className="w-4 h-4"/>
                    Active Postings
                </button>

                <button
                    onClick={() => setActiveTab("applicants")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duraiton-300 
                        ${activeTab === "applicants"
                        ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                        : "text-secondary/60 hover:text-primary hover:bg-white/5"
                    }
                    `}
                >
                    <Building2 className="w-4 h-4"/>
                    Manage Applicants
                </button>
            </div>

            <div className="w-full bg-background/40 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] min-h-[500px] flex items-center justify-center">
                {activeTab === "company" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Company Settings
                    </h2>
                }
                {activeTab === "listings" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Active Postings
                    </h2>
                }
                {activeTab === "applicants" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Applicant Board
                    </h2>
                }
            </div>
        </div>
    );
}
