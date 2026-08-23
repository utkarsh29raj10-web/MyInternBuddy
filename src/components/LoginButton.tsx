"use client";

import {useState} from "react";
import AuthModal from "@/components/AuthModal";

interface LoginButtonProps {
    className?: string;
    text?: string;
}

export default function LoginButton({ className, text }: LoginButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`px-6 py-3 bg-primary rounded-full text-background font-medium font-sans text-m hover:opacity-80 active:opacity-60 transition-opacity shadow-md ${className || ""}`}
            >
                {text || "Get Started"}
            </button>

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}