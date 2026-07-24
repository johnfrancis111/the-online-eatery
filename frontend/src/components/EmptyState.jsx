export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <h3 className="text-xl">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ivory-300/60">{description}</p>}
      {action}
    </div>
  );
}
