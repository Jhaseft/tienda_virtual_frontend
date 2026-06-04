"use client";

import { useRef } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface Props {
  expanded: boolean;
  onClick: () => void;
}

export default function ToggleButton({ expanded, onClick }: Props) {
  const btnRef  = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClick = async () => {
    const { animate } = await import("animejs");

    animate(btnRef.current!, {
      scale: [1, 0.82, 1.15, 1],
      duration: 420,
      ease: "outElastic(1, .6)",
    });

    animate(iconRef.current!, {
      rotate:  [0, expanded ? 180 : -180],
      opacity: [1, 0, 1],
      scale:   [1, 0.4, 1],
      duration: 380,
      ease: "inOutBack",
    });

    onClick();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      title={expanded ? "Encoger menú" : "Expandir menú"}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-200 transition-all ${expanded ? "w-full" : "w-9 h-9"}`}
    >
      <span ref={iconRef} className="flex items-center justify-center">
        {expanded
          ? <PanelLeftOpen size={13} strokeWidth={2.25} />
          : <PanelLeftClose size={13} strokeWidth={2.25} />}
      </span>
      {expanded && <span>{expanded ? "Encoger" : "Expandir"}</span>}
    </button>
  );
}
