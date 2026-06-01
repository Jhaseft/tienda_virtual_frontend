interface Props {
  text?: string;
}

export default function LoadingState({ text = "Cargando..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-100 border-t-violet-600" />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
