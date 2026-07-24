export default function Spinner({ full = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-ivory-300/15" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pepper animate-spin" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-ivory-300/50">simmering…</span>
    </div>
  );

  if (!full) return spinner;

  return <div className="flex min-h-[50vh] w-full items-center justify-center">{spinner}</div>;
}
