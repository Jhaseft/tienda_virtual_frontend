interface Props {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center">
      <p className="text-base font-semibold text-zinc-800">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
