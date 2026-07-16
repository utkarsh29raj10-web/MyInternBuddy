'use client';

import React from 'react';
import {X, ArrowLeft} from "lucide-react";
import {GlassCard} from "./GlassCard";

interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onBack?: () => void;
    showBack?: boolean;
}

export function GlassModal({isOpen, onClose, children, onBack, showBack}: GlassModalProps) {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all`}
             onClick={onClose}
        >
            <div className={`absolute inset-0 pointer-events-none`}
                 style={{background: "radial-gradient(circle, color-mix(in srgb, var(--bg) 90%, transparent) 0% color-mix(in srgb, var(--bg) 30%, transparent) 100%"}}
            />

            <div className={`absolute inset-0 pointer-events-none backdrop-blur-md`}
                 style={{
                     maskImage: "radial-gradient(circle 350px at center, black 75%, transparent 100%)",
                     WebkitMaskImage: "radial-gradient(circle 350px at center, black 75%, transparent 100%)"
                }}
            />

            <GlassCard
                className={`pt-14 flex flex-col items-center max-w-md w-full text-center`}
                // @ts-ignore
                onClick={(e: React.MouseEvent) => e.stopPropagation()
            }>
                <button onClick={onClose}
                        className={`absolute top-4 right-4 p-2 text-secondary hover:opacity-80 active:scale-[0.98] active:opacity-60 transition-all`}
                        aria-label="Close Modal"
                >
                    <X size="var(--text-l)"/>
                </button>

                {showBack && onBack && (
                    <button onClick={onBack}
                            className={`absolute top-4 left-4 p-2 text-secondary hover:opacity-80 active:scale-95 active:opacity-60 transition-all cursor-pointer`}
                            aria-label="Back"
                    >
                        <ArrowLeft size="var(--text-l)"/>
                    </button>
                )}
                {children}
            </GlassCard>
        </div>
    );
}