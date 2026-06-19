"use client";

import {useState, useEffect} from "react";
import {Sun, Moon} from "lucide-react";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const nextMode = !prev;
            if (nextMode) {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
            }

            return nextMode;
        });
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-primary rounded-md m-4 transition-colors hover:opacity-80 flex active:opacity-50 items-center justify-center"
                aria-label="Toggle Theme"
        >
            {isDarkMode ? <Sun size="var(--text-l)"/> : <Moon size="var(--text-l)"/>}
        </button>
    );
}