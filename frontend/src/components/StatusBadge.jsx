import { STATUS_STYLES } from '../utils/constants';

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory-300/10 bg-char-800 px-2.5 py-1 text-xs font-medium">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <span className={style.text}>{status}</span>
    </span>
  );
}
