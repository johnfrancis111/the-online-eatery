import { ACTIVE_STATUSES } from '../utils/constants';

const STAGE_LABEL = {
  Pending: 'Order placed',
  Preparing: 'On the stove',
  'Out for Delivery': 'On the way',
  Delivered: 'Delivered',
};

export default function StatusTracker({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-full border border-ivory-300/15 bg-char-900 px-4 py-2 text-sm text-ivory-300/60">
        <span className="h-2 w-2 rounded-full bg-ivory-300/40" />
        Order cancelled
      </div>
    );
  }

  const currentIndex = ACTIVE_STATUSES.indexOf(status);

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={4}>
      <div className="relative flex items-center justify-between">
        {/* the "burner ring" track */}
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-char-800" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-turmeric to-pepper transition-all duration-500"
          style={{ width: `${(currentIndex / (ACTIVE_STATUSES.length - 1)) * 100}%` }}
        />

        {ACTIVE_STATUSES.map((stage, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-mono transition-colors ${
                  reached
                    ? 'border-turmeric bg-turmeric text-char-950'
                    : 'border-ivory-300/20 bg-char-950 text-ivory-300/40'
                } ${isCurrent ? 'ring-4 ring-pepper/25' : ''}`}
              >
                {i + 1}
              </div>
              <span
                className={`hidden text-center text-[11px] font-medium sm:block ${
                  reached ? 'text-ivory' : 'text-ivory-300/40'
                }`}
              >
                {STAGE_LABEL[stage]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
