"use client";

import Link from "next/link";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  expanded: boolean;
}

export default function NavItem({ href, label, Icon, active, expanded }: Props) {
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  async function handleMouseEnter() {
    const { animate } = await import("animejs");
    if (iconRef.current) animate(iconRef.current, { scale: [1, 1.18, 1], duration: 300, ease: "outElastic(1,.5)" });
    if (!expanded && tooltipRef.current) animate(tooltipRef.current, { opacity: [0, 1], duration: 180, ease: "linear" });
  }

  async function handleMouseLeave() {
    if (!expanded && tooltipRef.current) {
      const { animate } = await import("animejs");
      animate(tooltipRef.current, { opacity: [1, 0], duration: 120, ease: "linear" });
    }
  }

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${!expanded ? "justify-center" : ""}`}
    >
      <div ref={iconRef} className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        active ? "bg-blue-100" : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
      }`}>
        <Icon
          size={15}
          strokeWidth={active ? 2.25 : 1.75}
          className={active ? "text-blue-600" : "text-gray-800"}
        />
      </div>

      {expanded && <span className="flex-1 truncate">{label}</span>}

      {!expanded && (
        <span
          ref={tooltipRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          {label}
        </span>
      )}
    </Link>
  );
}
