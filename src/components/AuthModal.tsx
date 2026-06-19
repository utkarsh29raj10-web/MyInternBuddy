"use client";

import {signIn} from "next-auth/react";
import {SITE_CONFIG} from "@/constants/config";
import { X } from "lucide-react";

export default function AuthModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all"
            onClick={onClose}
             style={{
                 background: 'radial-gradient(circle, color-mix(in srgb, var(--bg) 100%, transparent) 0%, color-mix(in srgb, var(--bg) 10%, transparent) 100%)'
             }}
        >
            <div className="glass-panel auth-modal-pattern p-10 rounded-xl flex flex-col items-center max-w-md w-full text-center relative overflow-hidden"
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

                <button
                    onClick={() => signIn("google")}
                    className="w-full p-3 mb-4 bg-foreground text-primary font-bold rounded-md shadow hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                    >
                    Login with Google
                </button>

                <div className="flex items-center w-full my-4">
                    <div className="flex-grow border-t border-secondary opacity-20">
                    </div>

                    <span className="mx-4 text-secondary opacity-60 text-s uppercase">
                        or
                    </span>

                    <div className="flex-grow border-t border-secondary opacity-20">
                    </div>
                </div>
                <p className="text-s text-secondary opacity-80 mt-4">
                    Email Login/REgister form
                </p>
            </div>
        </div>
    );
}