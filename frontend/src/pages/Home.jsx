import { useEffect, useState } from 'react';
import { getMenuItems, getCategories } from '../services/menuApi';
import MenuCard from '../components/MenuCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    getMenuItems(params)
      .then((res) => {
        setItems(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(e.target.elements.search.value.trim());
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const min = e.target.elements.minPrice.value.trim();
    const max = e.target.elements.maxPrice.value.trim();
    setMinPrice(min);
    setMaxPrice(max);
  };

  const clearPriceFilter = () => {
    setPage(1);
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div>
      <section className="mb-10 flex flex-col gap-2">
        <p className="eyebrow">Today&rsquo;s pot</p>
        <h1 className="text-4xl sm:text-5xl">What are you craving?</h1>
        <p className="max-w-xl text-ivory-300/60">
          Rice dishes, soups, drinks and desserts — cooked to order and priced fresh from the kitchen.
        </p>
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
          <input
            name="search"
            defaultValue={search}
            type="search"
            placeholder="Search a dish…"
            className="field-input"
          />
          <button type="submit" className="btn-secondary shrink-0">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
            className={category === '' ? 'btn-secondary !px-3 !py-1.5 text-xs' : 'btn-ghost !px-3 !py-1.5 text-xs'}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={category === c ? 'btn-secondary !px-3 !py-1.5 text-xs' : 'btn-ghost !px-3 !py-1.5 text-xs'}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handlePriceSubmit} className="mb-8 flex flex-wrap items-center gap-2">
        <label className="text-xs text-ivory-300/60">Price:</label>
        <input
          name="minPrice"
          type="number"
          min="0"
          step="0.01"
          defaultValue={minPrice}
          placeholder="Min $"
          className="field-input !w-24"
        />
        <span className="text-xs text-ivory-300/60">to</span>
        <input
          name="maxPrice"
          type="number"
          min="0"
          step="0.01"
          defaultValue={maxPrice}
          placeholder="Max $"
          className="field-input !w-24"
        />
        <button type="submit" className="btn-secondary !px-3 !py-1.5 text-xs">
          Apply
        </button>
        {(minPrice || maxPrice) && (
          <button type="button" onClick={clearPriceFilter} className="btn-ghost !px-3 !py-1.5 text-xs">
            Clear
          </button>
        )}
      </form>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState title="Couldn't load the menu" description={error} />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Nothing matches that search"
          description="Try a different dish name or clear your filters."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-ghost !px-3 !py-1.5 text-xs"
              >
                Previous
              </button>
              <span className="font-mono text-xs text-ivory-300/60">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="btn-ghost !px-3 !py-1.5 text-xs"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}