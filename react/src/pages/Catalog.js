import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel';
import { listAds } from '../api/ads';
import AdCard from '../components/AdCard';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Catalog = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const [filters, setFilters] = useState({
    q: query.get('q') || '',
    make: query.get('make') || '',
    model: query.get('model') || '',
    year_min: query.get('year_min') || '',
    year_max: query.get('year_max') || '',
    price_min: query.get('price_min') || '',
    price_max: query.get('price_max') || '',
    body_type: query.get('body_type') || '',
    fuel_type: query.get('fuel_type') || '',
    transmission_type: query.get('transmission_type') || '',
    drive_type: query.get('drive_type') || '',
    color: query.get('color') || '',
    mileage_max: query.get('mileage_max') || '',
    city: query.get('city') || '',
    features: query.get('features') ? query.get('features').split(',').map((x) => Number(x)) : [],
  });

  const [page, setPage] = useState(Number(query.get('page') || 1));
  const [pageSize] = useState(12);
  const [ordering, setOrdering] = useState(query.get('ordering') || '-created_at');
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ordering,
      };
      Object.entries(filters).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          if (v.length) params[k] = v.join(',');
        } else if (v !== '' && v !== null && v !== undefined) {
          params[k] = v;
        }
      });
      const resp = await listAds(params);
      setData(resp);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ordering]);

  function applyFilters() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length) params.set(k, v.join(','));
      else if (!Array.isArray(v) && v) params.set(k, v);
    });
    params.set('page', '1');
    params.set('ordering', ordering);
    navigate(`/catalog?${params.toString()}`);
    setPage(1);
    load();
  }

  function resetFilters() {
    setFilters({ q: '', make: '', model: '', year_min: '', year_max: '', price_min: '', price_max: '', body_type: '', fuel_type: '', transmission_type: '', drive_type: '', color: '', mileage_max: '', city: '', features: [] });
    setPage(1);
    setOrdering('-created_at');
    navigate('/catalog');
    load();
  }

  const totalPages = Math.max(1, Math.ceil((data.count || 0) / pageSize));

  return (
    <div data-easytag="id1-react/src/pages/Catalog.js" className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside data-easytag="id2-react/src/pages/Catalog.js" className="lg:col-span-4 xl:col-span-3">
        <FiltersPanel value={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} />
      </aside>
      <section data-easytag="id3-react/src/pages/Catalog.js" className="lg:col-span-8 xl:col-span-9">
        <div data-easytag="id4-react/src/pages/Catalog.js" className="flex items-center justify-between gap-3 mb-4">
          <div data-easytag="id5-react/src/pages/Catalog.js" className="text-sm text-muted">Найдено: {data.count}</div>
          <div data-easytag="id6-react/src/pages/Catalog.js" className="flex items-center gap-2">
            <label data-easytag="id7-react/src/pages/Catalog.js" className="text-sm text-muted">Сортировка</label>
            <select data-easytag="id8-react/src/pages/Catalog.js" value={ordering} onChange={(e) => setOrdering(e.target.value)} className="px-3 py-2 border border-border rounded-md">
              <option data-easytag="id9-react/src/pages/Catalog.js" value="-created_at">Сначала новые</option>
              <option data-easytag="id10-react/src/pages/Catalog.js" value="created_at">Сначала старые</option>
              <option data-easytag="id11-react/src/pages/Catalog.js" value="price">Цена по возрастанию</option>
              <option data-easytag="id12-react/src/pages/Catalog.js" value="-price">Цена по убыванию</option>
              <option data-easytag="id13-react/src/pages/Catalog.js" value="year">Год по возрастанию</option>
              <option data-easytag="id14-react/src/pages/Catalog.js" value="-year">Год по убыванию</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div data-easytag="id15-react/src/pages/Catalog.js" className="text-muted">Загрузка...</div>
        ) : (
          <div data-easytag="id16-react/src/pages/Catalog.js" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.results?.map((it) => (
              <AdCard key={it.id} item={it} />
            ))}
          </div>
        )}

        <div data-easytag="id17-react/src/pages/Catalog.js" className="flex items-center justify-center gap-2 mt-6">
          <button data-easytag="id18-react/src/pages/Catalog.js" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border border-border rounded disabled:opacity-50">Назад</button>
          <span data-easytag="id19-react/src/pages/Catalog.js" className="text-sm text-muted">Стр. {page} из {totalPages}</span>
          <button data-easytag="id20-react/src/pages/Catalog.js" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 border border-border rounded disabled:opacity-50">Вперёд</button>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
