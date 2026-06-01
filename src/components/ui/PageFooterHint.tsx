import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface Props {
  message: string;
  Icon?: LucideIcon;
}

export default function PageFooterHint({ message, Icon = Sparkles }: Props) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 select-none">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
        <Icon size={13} className="text-violet-400" strokeWidth={2} />
        <span className="text-sm font-medium text-gray-400">{message}</span>
      </div>
    </div>
  );
}
