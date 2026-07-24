import { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

export default function MenuCard({ item }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
    <Link to={`/menu/${item._id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-char-800">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl text-ivory-300/20">
            {item.name.charAt(0)}
          </div>
        )}
        <span className="eyebrow absolute left-3 top-3 rounded-full bg-char-950/80 px-2.5 py-1">
          {item.category}
        </span>
        {!item.isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-char-950/70 font-mono text-xs uppercase tracking-widest text-ivory-300/70">
            Sold out for today
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
         <h3 className="text-lg leading-snug">
  <Link to={`/menu/${item._id}`} className="hover:text-turmeric">{item.name}</Link>
</h3>
          <span className="whitespace-nowrap font-mono text-sm text-turmeric">{formatCurrency(item.price)}</span>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-ivory-300/60">{item.description}</p>

        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className={added ? 'btn-secondary' : 'btn-primary'}
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
