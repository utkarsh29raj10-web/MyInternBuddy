import React, {InputHTMLAttributes} from "react";

interface GlobalInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function GlobalInput({
    label,
    error,
    icon,
    className='',
    ...props
}: GlobalInputProps) {
    return (
        <div className="w-full flex flex-col gap-1 font-sans text-left">
            {label && (
                <label className="text-s text-secondary font-bold opacity-70 uppercase tracking-wider mt-1">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <input className={`appearance-none w-full p-3 min-h-[50px] bg-background border rounded-md outline-none transition-colors
                    ${icon ? 'pr-10' : ''}
                    ${error ? 'border-alert focus: border-alert' : 'border-secondary border-opacity-10 focus:border-opacity-50'}
                    ${className}
                `}
                    {...props}
                />

                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none opacity-70">
                        {icon}
                    </div>
                )}
            </div>

            {error && <span className="text-xs text-alert font-bold mt-1 animate-fade-in">
                {error}
                </span>
            }
        </div>
    );
}