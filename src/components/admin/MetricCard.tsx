interface Props {
  title: string;
  value: string;
  hint?: string;
}

export default function MetricCard({ title, value, hint }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <p className="text-xs text-zinc-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-zinc-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </article>
  );
}
