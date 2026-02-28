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
            className={`border border-slate-200 p-2.5 rounded-[20px] bg-white flex flex-col ${href ? 'cursor-pointer hover:border-blue-200 hover:shadow-md transition-all' : 'shadow-sm'}`}
        >
            <div className="flex gap-2.5">
                {/* Date Box */}
                <div className="bg-slate-50 rounded-xl flex flex-col items-center justify-center w-[48px] h-[52px] shrink-0 border border-slate-100">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                        {month}
                    </span>
                    <span className="text-[17px] font-extrabold text-slate-800 mt-0.5 leading-none">{day}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2 h-4">
                        <h3 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
                            {title}
                        </h3>
                        <div className="shrink-0 -mt-0.5 scale-90 origin-top-right">
                            <Badge
                                label={status}
                                variant={isDraft ? "warning" : "success"}
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate -mt-1 w-11/12">{location}</p>

                    <div className="mt-1.5">
                        <div className="flex justify-between text-[10px] font-bold mb-0.5 items-center">
                            <span className="text-slate-500 font-semibold">{metricLabel}</span>
                            <span className="text-slate-800">
                                {Math.round(percentage)}% <span className="text-slate-500 font-semibold tracking-tight">({metricCurrent}/{metricTotal})</span>
                            </span>
                        </div>
                        <ProgressBar percentage={percentage} />
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-100 my-2.5" />

            {/* Buttons */}
            <div className="flex gap-2">
                {isDraft ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); /* draft edit action */ }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[12px] py-1.5 rounded-xl transition-colors shrink-0"
                    >
                        <PenLine className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Edit Details
                    </button>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); /* manage action */ }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[12px] py-1.5 rounded-xl transition-colors shrink-0"
                    >
                        <Settings className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Manage
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); /* checkin action */ }}
                    disabled={isDraft}
                    className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-[12px] py-1.5 rounded-xl transition-colors shrink-0 ${isDraft
                        ? "bg-slate-50/50 text-slate-300 cursor-not-allowed"
                        : "bg-[#f4f7fa] hover:bg-blue-50 text-blue-600"
                        }`}
                >
                    <QrCode className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Check-in
                </button>
            </div>
        </div>
    );
};
