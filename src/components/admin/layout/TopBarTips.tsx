"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const TIPS = [
  "Compra un plan superior y accede a ventas ilimitadas con más alcance.",
  "Configura tu tienda para ser más visible al público y atraer más clientes.",
  "Agrega fotos de calidad a tus productos para aumentar tus ventas.",
  "Activa tu método de pago y empieza a recibir pedidos de inmediato.",
  "Comparte el enlace de tu tienda en redes sociales y llega a más personas.",
  "Responde rápido a tus clientes para ganar su confianza y fidelidad.",
  "Mantén tu inventario actualizado para evitar vender productos sin stock.",
  "Usa descripciones detalladas en tus productos para convencer a más compradores.",
  "Revisa tus estadísticas cada semana y ajusta tu estrategia de ventas.",
  "Actualiza el logo y colores de tu tienda para proyectar más profesionalismo.",
];

export default function TopBarTips() {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!wrapperRef.current) return;
      const { animate } = await import("animejs");

      animate(wrapperRef.current, { opacity: [1, 0], translateY: [0, -8], duration: 280, ease: "inQuart" });
      await new Promise((r) => setTimeout(r, 300));

      setIndex((i) => (i + 1) % TIPS.length);

      animate(wrapperRef.current, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 350,
        ease: "outQuart",
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!iconRef.current) return;
    let cancelled = false;
    async function pulse() {
      const { animate } = await import("animejs");
      while (!cancelled) {
        animate(iconRef.current!, { scale: [1, 1.3, 1], opacity: [1, 0.6, 1], duration: 1200, ease: "inOutSine" });
        await new Promise((r) => setTimeout(r, 1200));
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    pulse();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="hidden lg:flex flex-1 items-center justify-center px-6 overflow-hidden">
      <div ref={wrapperRef} className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 max-w-lg">
        <Sparkles ref={iconRef} size={13} className="text-emerald-500 shrink-0" />
        <span className="text-xs text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {TIPS[index]}
        </span>
      </div>
    </div>
  );
}
