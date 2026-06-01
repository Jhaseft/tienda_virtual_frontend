import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function AdminHeader({ title, subtitle, rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-violet-200 bg-violet-700 px-4 py-3 text-white">
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle ? <p className="text-xs text-violet-100">{subtitle}</p> : null}
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>
    </header>
  );
}
