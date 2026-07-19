"use client";

import {useSession, signOut} from "next-auth/react";
import Link from "next/link";
import {SITE_CONFIG} from "@/constants/config";
import LoginButton from "@/components/LoginButton";
import ThemeToggle from "@/components/ThemeToggle";
import {LogOut, User, Briefcase, LayoutDashboard, Search} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function Navbar() {
    const {data: session, status} = useSession();
    const userRole = session?.user?.role;

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl rounded-full glass-panel bg-background bg-opacity-60 border border-secondary border-opacity-10 shadow-lg px-6 h-16 flex items-center justify-between">
            <div className="px-8">
                <Link href="/"
                      className="flex items-center gap-2 group cursor-pointer">

                    <img src="/icon-light.svg" alt="Logo" className="w-6 h-6 light-icon transition-transform"/>
                    <img src="/icon-white.svg" alt="Logo" className="w-6 h-6 dark-icon transition-transform"/>

                    <span className="font-brand text-lg font-bold text-primary tracking-wide hidden sm:block">
                        {SITE_CONFIG.brandName}
                    </span>
                </Link>
            </div>

            <div className="flex-1 flex justify-center gap-5 sm:gap-8 font-sans font-bold opacity-80 text-s">
                {session && (
                    <Link href="/dashboard"
                          className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4"/>
                        <span className="hidden md:inline">
                            Dashboard
                        </span>
                    </Link>
                )}

                {(!userRole || userRole === "STUDENT" || userRole === "EXPLORER") && (
                    <Link href="/internships"
                          className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
                    >
                        <Search className="w-5 h-5 sm:w-4 sm:h-4"/>
                        <span className="hidden md:inline">
                            Find Internships
                        </span>
                    </Link>
                )}

                {userRole === "RECRUITER" && (
                    <>
                        <Link href="/post"
                              className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
                        >
                            <Briefcase className="w-5 h-5 sm:w-4 sm:h-4"/>
                            <span className="hidden md:inline">
                                Post Internship
                            </span>
                        </Link>
                        <Link href="/applicants"
                              className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
                        >
                            <User className="w-5 h-5 sm:w-4 sm:h-4"/>
                            <span className="hidden md:inline">
                                Applicants
                            </span>
                        </Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <ThemeToggle/>

                {status === "loading" ? (
                    <div className="w-9 h-9 bg-secondary bg-opacity-10 animate-pulse rounded-full mr-2">
                    </div>
                ) : session ? (
                    <ProfileDropdown session={session} />
                ) : (
                    <div className="scale-90 origin-right pr-2 sm:pr-4">
                        <LoginButton/>
                    </div>
                )}
            </div>
        </nav>
    );
}