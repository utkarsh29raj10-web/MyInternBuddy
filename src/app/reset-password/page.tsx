"use client";

import {useState, Suspense} from "react";
import {useSearchParams} from "next/navigation";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token, newPassword: password}),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Failed to reset password.");
                return;
            }

            setSuccessMsg("Password reset successfully! You may close this tab and login now");
        }
        catch (err) {
            setErrorMsg("Something went wrong while resetting the password. Please try again.");
        }
    };

    return (
        <div className="glass-panel p-8 rounded-xl max-w-md w-full text-center relative overflow-hidden z-10 shadow-lg border border-secondary border-opacity-10">
            <h1 className="font-brand text-2xl font-bold text-primary mb-2">
                Reset Your Password
            </h1>

            {!token ? (
                <p className="text-alert font-sans text-m mt-4">Invalid or missing reset token. Please request a new link.</p>
            ) : successMsg ? (
                <p className="text-primary font-bold text-m mt-4 animate-fade-in">{successMsg}</p>
            ) : (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 font-sans mt-6 animate-fade-in">
                    {errorMsg && <p className="text-alert font-bold text-s mb-2">{errorMsg}</p>}

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-background text-primary border border-secondary border-opacity-20 rounded-md outline-none focus:border-opacity-50 transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-background text-primary border border-secondary border-opacity-20 rounded-md outline-none focus:border-opacity-50 transition-colors"
                    />

                    <button type="submit" className="w-full p-3 mt-2 bg-primary text-background font-bold rounded-md hover:opacity-90 transition-opacity">
                        Confirm New Password
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)' }}
            />

            <Suspense fallback={<div className="text-primary font-brand text-xl">Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </main>
    );
}