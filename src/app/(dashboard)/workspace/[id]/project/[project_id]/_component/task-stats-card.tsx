import React from "react";
import {
  ClipboardList,
  UserCheck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export type StatItem = {
  id: string;
  label: string;
  value: number | string;
  Icon?: React.ComponentType<any>;
  variant?: "default" | "muted" | "accent";
};

interface TaskStatsCardsProps {
  items?: StatItem[];
}

export default function TaskStatsCards({
  items = [
    { id: "total", label: "Total tasks", value: 42, Icon: ClipboardList },
    { id: "assigned", label: "Assigned tasks", value: 18, Icon: UserCheck },
    {
      id: "completed",
      label: "Completed tasks",
      value: 20,
      Icon: CheckCircle,
    },
    {
      id: "overdue",
      label: "Overdue tasks",
      value: 2,
      Icon: Clock,
    },
    { id: "incomplete", label: "Incomplete tasks", value: 22, Icon: XCircle },
  ],
}: TaskStatsCardsProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-5 gap-3 py-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-1 shadow-sm transition hover:shadow-md bg-[#1868db]
              border-blue-200`}
            aria-label={item.label}
            title={item.label}
          >
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground text-white">
                {item.label}
              </span>
              <span className="mt-1 text-lg font-semibold text-white">
                {item.value}
              </span>
            </div>

            <div className="flex items-center justify-center rounded-md p-2">
              {item.Icon ? (
                <item.Icon
                  className={`h-6 w-6 text-muted-foreground text-white`}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
