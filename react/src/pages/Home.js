import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { listAds } from '../api/ads';
import AdCard from '../components/AdCard';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await listAds({ ordering: '-created_at', page: 1, page_size: 8 });
        if (mounted) setItems(data.results || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div data-easytag="id1-react/src/pages/Home.js">
      <section data-easytag="id2-react/src/pages/Home.js" className="bg-white border-b border-border">
        <div data-easytag="id3-react/src/pages/Home.js" className="max-w-6xl mx-auto px-4 py-10">
          <h1 data-easytag="id4-react/src/pages/Home.js" className="text-2xl md:text-3xl font-semibold mb-4">Найдите идеальный автомобиль</h1>
          <p data-easytag="id5-react/src/pages/Home.js" className="text-muted mb-6">Минималистичная и удобная доска объявлений</p>
          <SearchBar />
        </div>
      </section>

      <section data-easytag="id6-react/src/pages/Home.js" className="max-w-6xl mx-auto px-4 py-10">
        <div data-easytag="id7-react/src/pages/Home.js" className="flex items-center justify-between mb-4">
          <h2 data-easytag="id8-react/src/pages/Home.js" className="text-xl font-semibold">Последние объявления</h2>
        </div>
        {loading ? (
          <div data-easytag="id9-react/src/pages/Home.js" className="text-muted">Загрузка...</div>
        ) : items.length === 0 ? (
          <div data-easytag="id9a-react/src/pages/Home.js" className="text-muted">Пока нет объявлений</div>
        ) : (
          <div data-easytag="id10-react/src/pages/Home.js" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((it) => (
              <AdCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
