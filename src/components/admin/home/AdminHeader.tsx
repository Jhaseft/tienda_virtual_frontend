import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function AdminHeader({ title, subtitle, rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 9l1-5h16l1 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="white" strokeWidth="2" />
              <path d="M5 9v11h14V9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-[11px] text-gray-400 leading-tight">{subtitle}</p>}
          </div>
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </header>
  );
}
