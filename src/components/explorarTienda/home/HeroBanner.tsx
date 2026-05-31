export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 to-violet-800 px-8 py-10 md:py-14 shadow-lg">
      <div className="relative z-10 max-w-lg">
        <p className="text-violet-200 text-sm font-medium mb-2 uppercase tracking-wide">
          Bienvenido
        </p>
        <h2 className="text-white text-3xl md:text-4xl font-bold leading-snug">
          Apoya a los emprendedores<br />de tu ciudad{" "}
          <span aria-hidden="true">❤️</span>
        </h2>
        <p className="text-violet-200 text-sm mt-3">
          Descubre tiendas locales, productos únicos y más.
        </p>
      </div>
      <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
      <div className="absolute right-10 bottom-0 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute right-40 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
    </div>
  )
}
