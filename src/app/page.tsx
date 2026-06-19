import ThemeToggle from "@/components/ThemeToggle";
import {SITE_CONFIG} from "@/constants/config";

export default function Home() {
  return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
          <div className="glass-panel auth-modal-pattern p-10 rounded-xl flex flex-col items-center max-w-md w-full text-center">
              <h1 className="text-xl font-bold text-primary">
                  Sign In to {SITE_CONFIG.brandName}
              </h1>

              <p className="text-m mt-2 text-secondary">
                  Testing glassmorphism + background
              </p>

              <ThemeToggle />
          </div>
      </main>
  );
}