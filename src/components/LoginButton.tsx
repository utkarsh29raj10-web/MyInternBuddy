"use client";

import {useState} from "react";
import AuthModal from "@/components/AuthModal";

export default function LoginButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-primary text-background font-medium font-sans text-m rounded-md hover:opacity-90 transition-opacity shadow-md"
            >
                Login/Register
            </button>

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}