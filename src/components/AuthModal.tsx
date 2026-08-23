"use client";

import {useState, useEffect} from "react";
import {signIn} from "next-auth/react";
import {SITE_CONFIG} from "@/constants/config";
import {Mail, Calendar, ChevronDown} from "lucide-react";
import {GlassModal} from "@/components/ui/GlassModal";
import {GlobalInput} from "@/components/ui/GlobalInput";
import {GlobalButton} from "@/components/ui/GlobalButton";

export default function AuthModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setIsForgotPassword(false);
            setIsRegistering(false);
            setErrorMsg("");
            setSuccessMsg("");
            setEmail("");
            setPassword("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });
            const data = await res.json();

            if (data.exists) {
                const signInResult = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (signInResult?.error) {
                    setErrorMsg("Invalid email or password.");
                } else {
                    window.location.reload();
                }
            }
            else setIsRegistering(true);
        }
        catch (err) {
            setErrorMsg("Something went wrong. Please try again.");
        }
    };

    const handleRegsitrationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, name, dateofBirth: dob, role}),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Registration Failed.")
                return;
            }

            const signInResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (signInResult?.error) {
                setErrorMsg("Invalid email or password.");
            } else {
                window.location.reload();
            }
        }
        catch (err) {
            setErrorMsg("Something went wrong. Please try again.");
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Failed to send reset link.");
                return;
            }

            setSuccessMsg(data.message || "We have sent a reset link to your email.");
        }
        catch (err) {
            setErrorMsg("Something went wrong. Please try again.");
        }
    };

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            showBack={isForgotPassword}
            onBack={() => {
                setIsForgotPassword(false);
                setErrorMsg("");
                setSuccessMsg("");
            }}
        >

            {!isRegistering ? (
                <div className="flex items-center justify-center gap-3 mb-0">
                    <img src="/icon-light.svg" alt="Logo" className="w-8 h-8 light-icon" />
                    <img src="/icon-white.svg" alt="Logo" className="w-8 h-8 dark-icon" />
                    <h2 className="font-brand text-xl font-bold text-primary">
                        {SITE_CONFIG.brandName}
                    </h2>
                </div>
            ) : (
                <h1 className="font-brand text-2xl font-bold text-primary mb-2">Almost there!</h1>
            )}

            <p className="font-sans text-m text-secondary mb-6 opacity-80">
                {isForgotPassword
                    ? "Reset Your Password Securely."
                    : isRegistering
                        ? "We just need a few more details to complete your profile."
                        : "Unlock Your True Career Potential Today."
                }
            </p>

            {errorMsg && (
                <p className="text-alert font-bold text-s mb-4 animate-fade-in">{errorMsg}</p>
            )}

            {successMsg && (
                <p className="text-secondary font-bold text-s mb-4 animate-fade-in">{successMsg}</p>
            )}

            {isForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="w-full flex flex-col gap-3 font-sans animate-fade-in">
                    <GlobalInput
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <GlobalButton type="submit" variant="primary" fullWidth className="mt-1">
                        Send Reset Link
                    </GlobalButton>
                </form>
            ) : !isRegistering ? (
                <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-3 font-sans animate-fade-in">
                    <GlobalInput
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <GlobalInput
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <GlobalButton type="submit" variant="primary" fullWidth icon={<Mail className="w-5 h-5"/>} className="mt-1">
                        Continue with Email
                    </GlobalButton>

                    <div className="group relative self-end mt-1">
                        <button type="button"
                                disabled
                                onClick={() => {
                                    setIsForgotPassword(true);
                                    setErrorMsg("");
                                    setSuccessMsg("");
                                }}
                                className="self-end text-secondary opacity-80 hover:opacity-100 active:opacity-60 text-right text-s mt-1 transition-all cursor-pointer">
                            Forgot Password?
                        </button>
                        <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-secondary/70 text-background text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Coming Soon!
                        </span>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegsitrationSubmit} className="w-full flex flex-col gap-3 font-sans animate-fade-in">
                    <GlobalInput
                        label="People call me"
                        type="text"
                        placeholder="Enter Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <GlobalInput
                        label="Date of Birth"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        icon={<Calendar className="w-5 h-5 pointer-events-none"/>}
                        className={`[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-primary ${!dob ? "text-secondary opacity-60" : "text-primary"}`}
                    />
                    <div className="w-full flex flex-col gap-1 font-sans text-left mt-2">
                        <label className="text-s text-secondary font-bold opacity-70 uppercase tracking-wider">
                            I am a...
                        </label>
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
                    </div>

                    <GlobalButton type="submit" variant="primary" fullWidth className="mt-2">
                        Create Account
                    </GlobalButton>
                </form>
            )}

            {!isRegistering && !isForgotPassword && (
                <>
                    <div className="flex items-center w-full mt-2 mb-5">
                        <div className="flex-grow border-t border-secondary opacity-20"></div>
                        <span className="font-sans mx-4 text-secondary opacity-100 font-light text-s">OR</span>
                        <div className="flex-grow border-t border-secondary opacity-20"></div>
                    </div>

                    <GlobalButton
                        type="button"
                        variant="primary"
                        fullWidth
                        onClick={() => signIn("google")}
                        icon={
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        }
                    >
                        Continue with Google
                    </GlobalButton>
                </>
            )}
        </GlassModal>
    );
}