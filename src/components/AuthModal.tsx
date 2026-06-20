"use client";

import {signIn} from "next-auth/react";
import {SITE_CONFIG} from "@/constants/config";
import { X } from "lucide-react";

export default function AuthModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all"
            onClick={onClose}
        >
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                     background: 'radial-gradient(circle, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)'
            }}/>

            <div className="absolute inset-0 pointer-events-none backdrop-blur-md"
                 style={{
                     maskImage: 'radial-gradient(circle 500px at center, black 90%, transparent 100%)',
                     WebkitMaskImage: 'radial-gradient(circle 500px at center, black 90%, transparent 100%)'
                 }}
            />

            <div className="glass-panel auth-modal-pattern p-10 rounded-xl flex flex-col items-center max-w-md w-full text-center relative overflow-hidden z-10"
                 onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-secondary hover:opacity-80 transition-opacity" aria-label="Close Modal">
                    <X size="var(--text-l)"/>
                </button>

                <h2 className="text-xl font-bold text-primary mb-2">
                    Join {SITE_CONFIG.brandName}
                </h2>

                <p className="text-m text-secondary mb-8 opacity-80">
                    Login to unlock your career.
                </p>

                <button onClick={() => signIn("google")}
                        className="w-full p-3 mb-3 bg-foreground text-primary font-bold rounded-md shadow hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                >
                    Login with Google
                </button>

                <button onClick={() => {
                    console.log ("Using Email. Going to form");
                }}
                        className="w-full p-3 border border-secondary text-secondary font-bold rounded-md hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2"
                >
                    Login with Email
                </button>

            </div>
        </div>
    );
}