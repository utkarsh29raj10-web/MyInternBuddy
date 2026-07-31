import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function ProfileLayout({children}: {children: React.ReactNode}) {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <div className="min-h-screen w-full bg-background pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in">
                {children}
            </div>
        </div>
    );
}