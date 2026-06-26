"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Calendar, ChevronDown} from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [dob, setDob] = useState("");
    const [role, setRole] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch("/api/auth/onboarding", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({dateofBirth: dob, role}),
            });

            if (!res.ok) {
                setErrorMsg("Something went wrong while trying to save profile.");
                return;
            }

            router.push("/");
            router.refresh();
        }
        catch (err) {
            setErrorMsg("Something went wrong. Please try again later.");
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)' }}
            />

            <div className="glass-panel p-8 rounded-xl max-w-md w-full text-center relative overflow-hidden z-10 shadow-lg border border-secondary border-opacity-10">
                <h1 className="font-brand text-2xl font-bold text-primary mb-2">Almost there!</h1>
                <p className="font-sans text-m text-secondary mb-6 opacity-80">
                    We just need two more details to complete your profile.
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 font-sans mt-6">
                    {errorMsg && <p className="text-alert font-bold text-s mb-2">{errorMsg}</p>}

                    <p className="text-s text-secondary text-left font-bold opacity-70 uppercase tracking-wider mb-1">
                        Date of Birth
                    </p>

                    <div className="relative w-full">
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            className={`appearance-none w-full p-3 min-h-[50px] pr-10 bg-background border border-secondary border-opacity-10 rounded-md outline-none focus:border-opacity-50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-primary ${!dob ? "text-secondary opacity-60" : "text-primary"}`}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none opacity-70"/>
                    </div>

                    <p className="text-s text-secondary text-left font-bold opacity-70 uppercase tracking-wider mt-2 mb-1">
                        I am a...
                    </p>

                    <div className="relative w-full">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={`appearance-none w-full p-3 min-h-[50px] pr-10 bg-background border border-secondary border-opacity-10 rounded-md outline-none focus:border-opacity-50 transition-colors ${!role ? "text-secondary opacity-60" : "text-primary"}`}
                        >
                            <option value="" disabled hidden>Role</option>
                            <option value="EXPLORER">Explorer (Just browsing)</option>
                            <option value="STUDENT">Student (Looking for opportunities)</option>
                            <option value="RECRUITER">Recruiter (Hiring Talent)</option>
                        </select>

                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none opacity-70"/>
                    </div>

                    <button type="submit" className="w-full p-3 mt-4 bg-primary text-background font-bold rounded-md hover:opacity-90 transition-opacity">
                        Complete Setup
                    </button>
                </form>
            </div>
        </main>
    );
}