interface Props {
  text?: string;
}

export default function LoadingState({ text = "Cargando..." }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
      {text}
    </div>
  );
}
