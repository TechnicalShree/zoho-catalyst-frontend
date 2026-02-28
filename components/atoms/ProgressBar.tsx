import React from "react";

export const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    return (
        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
            <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
        </div>
    );
};
