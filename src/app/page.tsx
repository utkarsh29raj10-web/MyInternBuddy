import ThemeToggle from "@/components/ThemeToggle";
import {SITE_CONFIG} from "@/constants/config";

export default function Home() {
  return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-primary">
          Welcome to {SITE_CONFIG.brandName}
        </h1>
        <p className="text-m mt-2 opacity-80 text-secondary">
          Testing Theme Toggle
        </p>

        <ThemeToggle />
      </main>
  );
}