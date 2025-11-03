import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import AdCard from '../components/AdCard';
import { getAds } from '../api/ads';
import { getOptions } from '../api/meta';
import { addFavorite, removeFavorite } from '../api/favorites';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const Catalog = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(Number(query.get('page') || 1));
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const buildQuery = (src) => {
    const params = new URLSearchParams();
    Object.entries(src || {}).forEach(([k, v]) => {
      if (v === '' || v == null) return;
      if (Array.isArray(v)) {
        if (v.length) params.set(k, v.join(','));
      } else {
        params.set(k, String(v));
      }
    });
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    return params.toString();
  };

  const fetchMeta = async () => {
    try {
      const data = await getOptions();
      setMeta(data);
    } catch (e) {
      // handled globally
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const paramsObj = { ...filters, page, page_size: pageSize };
      const data = await getAds(paramsObj);
      setItems(data?.results || []);
      setCount(data?.count || 0);
    } catch (e) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeta(); }, []);

  useEffect(() => {
    // initialize from URL once
    const init = {};
    query.forEach((v, k) => { init[k] = v; });
    setFilters((f) => ({ ...f, ...init }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchItems();
    const qs = buildQuery(filters);
    navigate(`/catalog?${qs}`, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  const pagesTotal = Math.max(1, Math.ceil(count / pageSize));

  const toggleFav = async (ad) => {
    const id = ad.id;
    const isFav = !!ad.is_favorite;
    try {
      if (isFav) await removeFavorite(id);
      else await addFavorite(id);
      setItems((prev) => prev.map((x) => x.id === id ? { ...x, is_favorite: !isFav } : x));
    } catch (e) {
      // handled globally
    }
  };

  return (
    <div data-easytag="id1-react/src/pages/Catalog.jsx" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside data-easytag="id2-react/src/pages/Catalog.jsx" className="lg:col-span-1">
        <Filters meta={meta} value={filters} onChange={(v) => { setPage(1); setFilters(v); }} onSubmit={() => fetchItems()} />
      </aside>
      <section data-easytag="id3-react/src/pages/Catalog.jsx" className="lg:col-span-3">
        <div data-easytag="id4-react/src/pages/Catalog.jsx" className="flex items-center justify-between mb-3">
          <h2 data-easytag="id5-react/src/pages/Catalog.jsx" className="text-xl font-semibold">Найдено: {count}</h2>
          <div data-easytag="id6-react/src/pages/Catalog.jsx" className="text-sm text-muted">Стр. {page} из {pagesTotal}</div>
        </div>
        <div data-easytag="id7-react/src/pages/Catalog.jsx" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div data-easytag="id8-react/src/pages/Catalog.jsx" className="col-span-full text-center text-muted">Загрузка…</div>
          ) : items.length === 0 ? (
            <div data-easytag="id9-react/src/pages/Catalog.jsx" className="col-span-full text-center text-muted">Ничего не найдено</div>
          ) : (
            items.map((ad) => (
              <AdCard key={ad.id} ad={ad} onToggleFavorite={toggleFav} />
            ))
          )}
        </div>
        <div data-easytag="id10-react/src/pages/Catalog.jsx" className="mt-4 flex items-center justify-center gap-2">
          <button data-easytag="id11-react/src/pages/Catalog.jsx" type="button" className="h-10 px-4 rounded-lg border border-border" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Назад</button>
          <button data-easytag="id12-react/src/pages/Catalog.jsx" type="button" className="h-10 px-4 rounded-lg border border-border" disabled={page >= pagesTotal} onClick={() => setPage((p) => Math.min(pagesTotal, p + 1))}>Вперёд</button>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
