import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role === "CLIENT") {
    redirect("/");
  }

  return children;
}
