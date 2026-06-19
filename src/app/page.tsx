import ThemeToggle from "@/components/ThemeToggle";
import {SITE_CONFIG} from "@/constants/config";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center relative">
          <div className="absolute top-6 right-8">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center text-center max-w-2xl">
              <h1 className="text-xl font-bold text-primary mb-4">
                  Welcome to {SITE_CONFIG.brandName}
              </h1>

              <p className="text-l text-secondary mb-8 opacity-80">
                  From Campus to Career, Your Journey Starts With Us!
              </p>

              <LoginButton />
          </div>
      </main>
  );
}