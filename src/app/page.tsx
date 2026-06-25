import ThemeToggle from "@/components/ThemeToggle";
import {SITE_CONFIG} from "@/constants/config";
import LoginButton from "@/components/LoginButton";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if(session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
            where: {email: session.user.email}
        });

        if (dbUser && !dbUser.dateofBirth)
            redirect("/onboarding");
    }

    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center relative">
          <div className="absolute top-4 right-6">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center text-center max-w-2xl">
              <h1 className="text-xl text-primary font-light font-brand">
                  Welcome to {SITE_CONFIG.brandName}
              </h1>

              <p className="text-l font-medium text-secondary font-subtitle mb-4 opacity-80">
                  From Campus to Career, Your Journey Starts With Us!
              </p>

              <LoginButton />
          </div>
      </main>
  );
}