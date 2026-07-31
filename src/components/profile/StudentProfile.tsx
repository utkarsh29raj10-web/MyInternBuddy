"use client"
import {useState} from "react";
import {User, Bookmark, History} from "lucide-react";

export default function StudentProfile() {
    const [activeTab, setActiveTab] = useState<"details" | "saved" | "history">("details");

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="w-full flex items-center justify-start gap-2 bg-background/40 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-x-auto">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300 
                        ${activeTab === "details" 
                            ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                            : "text-secondry/60 hover:text-primary hover:bg-white/5"
                        }
                    `}
                >
                    <User className="w-4 h-4"/>
                    Personal Details
                </button>

                <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300
                        ${activeTab === "saved"
                            ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                            : "text-secondry/60 hover:text-primary hover:bg-white/5"
                        }
                    `}
                >
                    <Bookmark className="w-4 h-4"/>
                    Saved internships
                </button>

                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-brand font-bold text-sm transition-all duration-300
                        ${activeTab === "history"
                            ? "bg-primary text-background shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                            : "text-secondary/6- hover:text-primary hover:bg-white/5"
                        }
                    `}
                >
                    <History className="w-4 h-4"/>
                    Applications
                </button>
            </div>

            <div className="w-full bg-background/40 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] min-h-[500px] flex items-center justify-center">
                {activeTab === "details" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Profile Details Form
                    </h2>
                }

                {activeTab === "saved" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Saved Internships Feed
                    </h2>
                }

                {activeTab === "history" &&
                    <h2 className="text-2xl font-brand font-bold text-primary opacity-50">
                        Application History
                    </h2>
                }
            </div>
        </div>
    );
}
