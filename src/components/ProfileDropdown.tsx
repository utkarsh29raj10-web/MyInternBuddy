"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, Settings, CreditCard, Bookmark, LogOut, Building} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

interface ProfileDropdownProps {
    session: any;
}

export default function ProfileDropdown({ session }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userRole = session?.user?.role;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative pr-2 sm:pr-4 flex items-center" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center hover:opacity-80 active:opacity-60 focus:outline-none"
            >
                <User className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-4 top-12 w-64 z-50">
                    <GlassCard className="p-2 flex flex-col gap-1 bg-opacity-60 border-secondary/20 backdrop-blur-3xl">
                        <div className="px-3 py-3 border-b border-secondary/20 mb-1">
                            <p className="font-bold text-primary font-brand truncate">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs text-secondary opacity-70 truncate mb-2">
                                {session?.user?.email}
                            </p>
                            <span className="inline-block text-[10px] uppercase tracking-wider font-bold border border-secondary text-secondary px-2 py-0.5 rounded-full">
                                {userRole || "User"}
                            </span>
                        </div>

                        <Link href="/profile"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary"
                        >
                            <User className="w-4 h-4" />
                            My Profile
                        </Link>

                        {userRole === "RECRUITER" ? (
                            <>
                                <Link href="/company"
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary"
                                >
                                    <Building className="w-4 h-4" />
                                    Company Settings
                                </Link>
                                <Link href="/subscription"
                                      onClick={() => setIsOpen(false)}
                                      className="flex flex-1 justify-between items-center px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary"
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4" />
                                        Subscription
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <Link href="/profile?tab=saved"
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary"
                            >
                                <Bookmark className="w-4 h-4" />
                                Saved Internships
                            </Link>
                        )}

                        <Link href="/settings"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary"
                        >
                            <Settings className="w-4 h-4" />
                            Account Settings
                        </Link>

                        <div className="border-t border-secondary/20 mt-1 pt-1">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-sans text-secondary hover:text-primary">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        signOut({ callbackUrl: '/' });
                                    }}
                                    className="flex items-center gap-3"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}