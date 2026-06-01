import type { ReactNode } from "react";
import AdminBottomNav from "./AdminBottomNav";
import AdminHeader from "./AdminHeader";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export default function AdminShell({
  title,
  subtitle,
  children,
  rightSlot,
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-zinc-50 shadow-sm">
        <AdminHeader title={title} subtitle={subtitle} rightSlot={rightSlot} />
        <main className="flex-1 px-4 py-4">{children}</main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
