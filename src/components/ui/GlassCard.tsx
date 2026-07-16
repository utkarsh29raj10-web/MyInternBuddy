import React, { HTMLAttributes } from 'react';

export function GlassCard({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`glass-panel p-6 rounded-xl relative overflow-hidden z-10 ${className}`} {...props}>
            {children}
        </div>
    );
}