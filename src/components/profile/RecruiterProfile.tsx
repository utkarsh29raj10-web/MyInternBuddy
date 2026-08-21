"use client"

import {useState, useEffect} from "react";
import {Building2} from "lucide-react";
import CompanyProfileForm from "./CompanyProfileForm";
import RecruiterListings from "@/components/profile/RecruiterListings";
import {useSearchParams} from "next/navigation";

export default function RecruiterProfile() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as "company" | "listings" | "applicants" | null;
    const [activeTab, setActiveTab] = useState<"company" | "listings" | "applicants">(tabParam|| "company");

    useEffect(() => {
        if (tabParam)
            setActiveTab(tabParam);
    }, [tabParam]);

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="w-full pl-4 flex items-center justify-start gap-2 bg-background/40 backdrop-blur-2xl border border-white/10 px-4 py-3 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-x-auto">
                <button
                    onClick={() => setActiveTab("company")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300 
                        ${activeTab === "company" 
                            ? "bg-primary text-background scale-105"
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
                            ? "bg-primary text-background scale-105"
                            : "text-secondary/60 hover:text-primary hover:bg-white/5"
                        }
                    `}
                >
                    <Building2 className="w-4 h-4"/>
                    Active Postings
                </button>

                <button
                    onClick={() => setActiveTab("applicants")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300 
                        ${activeTab === "applicants"
                        ? "bg-primary text-background scale-105"
                        : "text-secondary/60 hover:text-primary hover:bg-secondary/5"
                    }
                    `}
                >
                    <Building2 className="w-4 h-4"/>
                    Manage Applicants
                </button>
            </div>

            <div className="w-full bg-background/40 backdrop-blur-2xl border border-secondary/10 p-8 rounded-3xl min-h-[125]">
                {activeTab === "company" && (
                    <div className="w-full flex flex-col items-start justify-start animate-fade-in">
                        <CompanyProfileForm/>
                    </div>
                )}

                {activeTab === "listings" && (
                    <div className="w-full flex flex-col items-start justify-start animate-fade-in">
                        <RecruiterListings/>
                    </div>
                )}
                {activeTab === "applicants" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Applicant Board
                    </h2>
                }
            </div>
        </div>
    );
}
