import React from "react";
import type { BookingTimelineEvent } from "../../types/booking";
import { User, Shield, Wrench, CheckCircle2, AlertCircle } from "lucide-react";

interface TimelineProps {
  events: BookingTimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (actorType: BookingTimelineEvent["actorType"]) => {
    switch (actorType) {
      case "ADMIN":
        return <Shield className="w-3.5 h-3.5 text-blue-600" />;
      case "PARTNER":
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case "CUSTOMER":
        return <User className="w-3.5 h-3.5 text-indigo-600" />;
      case "SYSTEM":
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event) => (
        <div key={event.id} className="relative group">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-2xs">
            {getIcon(event.actorType)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {event.event}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {event.timestamp}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              By{" "}
              <span className="font-semibold text-slate-800">
                {event.actor}
              </span>{" "}
              ({event.actorType})
            </p>
            {event.note && (
              <div className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{event.note}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
