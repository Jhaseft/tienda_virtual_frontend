"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  label?: string;
  href?: string;
}

export default function BackButton({ label = "Volver", href }: Props) {
  const router = useRouter();

  function handleClick() {
    if (href) router.push(href);
    else router.back();
  }

  return (
    <div className="hidden md:flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={handleClick}
        className="w-9 h-9 text-black rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={2} />
      </button>
      <h1 className="text-xl font-bold text-gray-900">{label}</h1>
    </div>
  );
}
