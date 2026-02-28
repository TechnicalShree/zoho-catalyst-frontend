import React from "react";

export interface BadgeProps {
    label: string;
    variant?: "success" | "warning" | "default";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "default" }) => {
    let classes = "bg-slate-100 text-slate-600 border-slate-200";
    if (variant === "success") {
        classes = "bg-emerald-50 text-emerald-600 border-emerald-200";
    } else if (variant === "warning") {
        classes = "bg-amber-50 text-amber-600 border-amber-200";
    }

    return (
        <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${classes}`}
        >
            {label}
        </span>
    );
};
