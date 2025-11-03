import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteAd, getAd, listAds, updateAd } from '../api/ads';
import { listFavorites } from '../api/favorites';
import AdCard from '../components/AdCard';

const MyAds = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadMine() {
      try {
        // Load first page and then filter by seller via detail endpoints
        const list = await listAds({ page: 1, page_size: 24, ordering: '-created_at' });
        const details = await Promise.all((list.results || []).map((it) => getAd(it.id).catch(() => null)));
        const mine = details.filter(Boolean).filter((d) => d.seller?.id === user?.id);
        if (mounted) setItems(mine);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (user) loadMine();
    return () => { mounted = false; };
  }, [user]);

  async function startEdit(id, price) {
    setEditingId(id);
    setEditPrice(String(price || ''));
  }

  async function saveEdit(id) {
    const priceNum = Number(editPrice);
    await updateAd(id, { price: priceNum });
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, price: priceNum } : x)));
    setEditingId(null);
  }

  async function remove(id) {
    await deleteAd(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) return <div data-easytag="id1-react/src/pages/Profile.js" className="text-muted">Загрузка...</div>;

  return (
    <div data-easytag="id2-react/src/pages/Profile.js" className="space-y-3">
      {items.length === 0 && <div data-easytag="id3-react/src/pages/Profile.js" className="text-muted">Пока нет ваших объявлений</div>}
      {items.map((it) => (
        <div data-easytag="id4-react/src/pages/Profile.js" key={it.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between gap-4">
          <div data-easytag="id5-react/src/pages/Profile.js" className="flex-1">
            <div data-easytag="id6-react/src/pages/Profile.js" className="font-semibold">{it.title}</div>
            <div data-easytag="id7-react/src/pages/Profile.js" className="text-sm text-muted">ID: {it.id}</div>
          </div>
          <div data-easytag="id8-react/src/pages/Profile.js" className="flex items-center gap-2">
            {editingId === it.id ? (
              <>
                <input data-easytag="id9-react/src/pages/Profile.js" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="px-3 py-2 border border-border rounded-md w-32" />
                <button data-easytag="id10-react/src/pages/Profile.js" onClick={() => saveEdit(it.id)} className="px-3 py-2 rounded-md bg-accent text-white">Сохранить</button>
                <button data-easytag="id11-react/src/pages/Profile.js" onClick={() => setEditingId(null)} className="px-3 py-2 rounded-md border border-border">Отмена</button>
              </>
            ) : (
              <>
                <div data-easytag="id12-react/src/pages/Profile.js" className="w-32 text-right font-semibold">{Number(it.price).toLocaleString('ru-RU')} ₽</div>
                <button data-easytag="id13-react/src/pages/Profile.js" onClick={() => startEdit(it.id, it.price)} className="px-3 py-2 rounded-md border border-border">Редактировать</button>
                <button data-easytag="id14-react/src/pages/Profile.js" onClick={() => remove(it.id)} className="px-3 py-2 rounded-md border border-red-200 text-red-600">Удалить</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Favorites = () => {
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const resp = await listFavorites({ page: 1, page_size: 24, ordering: '-created_at' });
        if (mounted) setData(resp);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div data-easytag="id15-react/src/pages/Profile.js" className="text-muted">Загрузка...</div>;

  return (
    <div data-easytag="id16-react/src/pages/Profile.js" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.results.map((it) => (
        <AdCard key={it.id} item={it} />
      ))}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('ads');

  return (
    <div data-easytag="id17-react/src/pages/Profile.js" className="max-w-6xl mx-auto px-4 py-8">
      <div data-easytag="id18-react/src/pages/Profile.js" className="mb-6">
        <h1 data-easytag="id19-react/src/pages/Profile.js" className="text-2xl font-semibold">Личный кабинет</h1>
        <div data-easytag="id20-react/src/pages/Profile.js" className="text-muted">{user?.username} · {user?.email} · роль: {user?.role}</div>
      </div>

      <div data-easytag="id21-react/src/pages/Profile.js" className="flex items-center gap-2 border-b border-border mb-4">
        <button data-easytag="id22-react/src/pages/Profile.js" onClick={() => setTab('ads')} className={`px-4 py-2 ${tab === 'ads' ? 'border-b-2 border-accent text-text' : 'text-muted'}`}>Мои объявления</button>
        <button data-easytag="id23-react/src/pages/Profile.js" onClick={() => setTab('fav')} className={`px-4 py-2 ${tab === 'fav' ? 'border-b-2 border-accent text-text' : 'text-muted'}`}>Избранное</button>
      </div>

      {tab === 'ads' ? <MyAds /> : <Favorites />}
    </div>
  );
};

export default Profile;
