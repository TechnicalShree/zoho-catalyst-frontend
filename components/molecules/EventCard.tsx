import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../atoms/Badge";
import { ProgressBar } from "../atoms/ProgressBar";
import { Settings, QrCode, PenLine } from "lucide-react";

export interface EventCardProps {
    month: string;
    day: string;
    title: string;
    status: "Active" | "Draft";
    location: string;
    metricLabel: string;
    metricCurrent: number;
    metricTotal: number;
    href?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
    month,
    day,
    title,
    status,
    location,
    metricLabel,
    metricCurrent,
    metricTotal,
    href,
}) => {
    const isDraft = status === "Draft";
    const percentage = (metricCurrent / metricTotal) * 100;
    const router = useRouter();

    const handleCardClick = () => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`border border-slate-200 px-3 py-2 rounded-2xl bg-white flex flex-col ${href ? 'cursor-pointer hover:border-blue-200 hover:shadow-md transition-all' : 'shadow-sm'}`}
        >
            {/* Top row: date + info + badge */}
            <div className="flex gap-2.5 items-center">
                {/* Date Box */}
                <div className="bg-slate-50 rounded-lg flex flex-col items-center justify-center w-[40px] h-[42px] shrink-0 border border-slate-100">
                    <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                        {month}
                    </span>
                    <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 leading-none">{day}</span>
                </div>

                {/* Title + Location */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                        <h3 className="font-bold text-[13px] text-slate-900 leading-tight truncate">
                            {title}
                        </h3>
                        <div className="shrink-0 scale-[0.85] origin-right">
                            <Badge
                                label={status}
                                variant={isDraft ? "warning" : "success"}
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{location}</p>
                </div>
            </div>

            {/* Progress row */}
            <div className="mt-1.5 mb-1">
                <div className="flex justify-between text-[9px] font-bold mb-0.5 items-center">
                    <span className="text-slate-500 font-semibold">{metricLabel}</span>
                    <span className="text-slate-800">
                        {Math.round(percentage)}% <span className="text-slate-500 font-semibold tracking-tight">({metricCurrent}/{metricTotal})</span>
                    </span>
                </div>
                <ProgressBar percentage={percentage} />
            </div>

            {/* Buttons row */}
            <div className="flex gap-1.5 mt-1 mb-0.5">
                {isDraft ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex-1 flex items-center justify-center gap-1 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[11px] py-1 rounded-lg transition-colors"
                    >
                        <PenLine className="w-3 h-3" strokeWidth={2.5} />
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex-1 flex items-center justify-center gap-1 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[11px] py-1 rounded-lg transition-colors"
                    >
                        <Settings className="w-3 h-3" strokeWidth={2.5} />
                        Manage
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    disabled={isDraft}
                    className={`flex-1 flex items-center justify-center gap-1 font-bold text-[11px] py-1 rounded-lg transition-colors ${isDraft
                        ? "bg-slate-50/50 text-slate-300 cursor-not-allowed"
                        : "bg-blue-50/80 hover:bg-blue-100 text-blue-600"
                        }`}
                >
                    <QrCode className="w-3 h-3" strokeWidth={2.5} />
                    Check-in
                </button>
            </div>
        </div>
    );
};
