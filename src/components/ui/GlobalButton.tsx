import React, {ButtonHTMLAttributes} from 'react';

interface GlobalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export function GlobalButton({
    children,
    variant = 'primary',
    fullWidth = false,
    icon,
    className = '',
    ...props
 }: GlobalButtonProps) {
    const baseStyles = "p-3 font-medium rounded-md transition-all active:scale-[0.98] active:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-sm";

    const variants = {
        primary: "bg-primary text-background hover:opacity-80",
        secondary: "bg-secondary text-foreground hover:opacity-80",
        ghost: "bg-transparent text-primary shadow-none hover:bg-black/5 dark:hover:bg-white/5",
        danger: "bg-alert text-white hover:opacity-80",
        glass: "glass-panel text-primary hover:bg-white/30 dark:hover:bg-white/20"
    };

    const widthStyle = fullWidth ? "w-full" : "w-auto";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {icon
                && <span
                    className="flex items-center justify-center"
                >
                    {icon}
                </span>
            }
            {children}
        </button>
    )
}