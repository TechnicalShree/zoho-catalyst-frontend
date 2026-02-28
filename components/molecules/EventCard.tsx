import React from "react";
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
}) => {
    const isDraft = status === "Draft";
    const percentage = (metricCurrent / metricTotal) * 100;

    return (
        <div className="border border-slate-200 p-3.5 rounded-3xl bg-white shadow-sm flex flex-col">
            <div className="flex gap-3">
                {/* Date Box */}
                <div className="bg-slate-50 rounded-2xl flex flex-col items-center justify-center w-[60px] h-[64px] shrink-0 border border-slate-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                        {month}
                    </span>
                    <span className="text-[20px] font-extrabold text-slate-800 mt-1 leading-none">{day}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2 h-5">
                        <h3 className="font-bold text-[15px] text-slate-900 leading-tight truncate">
                            {title}
                        </h3>
                        <div className="shrink-0 -mt-0.5">
                            <Badge
                                label={status}
                                variant={isDraft ? "warning" : "success"}
                            />
                        </div>
                    </div>
                    <p className="text-[12px] text-slate-500 truncate -mt-0.5 w-11/12">{location}</p>

                    <div className="mt-2.5">
                        <div className="flex justify-between text-[11px] font-bold mb-1 items-center">
                            <span className="text-slate-500 font-semibold">{metricLabel}</span>
                            <span className="text-slate-800">
                                {Math.round(percentage)}% <span className="text-slate-500 font-semibold tracking-tight">({metricCurrent}/{metricTotal})</span>
                            </span>
                        </div>
                        <ProgressBar percentage={percentage} />
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-100 my-3.5" />

            {/* Buttons */}
            <div className="flex gap-2.5">
                {isDraft ? (
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[13px] py-2 rounded-[14px] transition-colors shrink-0">
                        <PenLine className="w-4 h-4" strokeWidth={2.5} />
                        Edit Details
                    </button>
                ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50/70 hover:bg-slate-100 text-slate-900 font-bold text-[13px] py-2 rounded-[14px] transition-colors shrink-0">
                        <Settings className="w-4 h-4" strokeWidth={2.5} />
                        Manage
                    </button>
                )}
                <button
                    disabled={isDraft}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold text-[13px] py-2 rounded-[14px] transition-colors shrink-0 ${isDraft
                        ? "bg-slate-50/50 text-slate-300 cursor-not-allowed"
                        : "bg-[#f4f7fa] hover:bg-blue-50 text-blue-600"
                        }`}
                >
                    <QrCode className="w-4 h-4" strokeWidth={2.5} />
                    Check-in
                </button>
            </div>
        </div>
    );
};
