import React, { useEffect, useState } from 'react';
import { me } from '../api/auth';
import { getFavorites } from '../api/favorites';
import AdCard from '../components/AdCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const load = async () => {
    try {
      const u = await me();
      setUser(u);
      const fav = await getFavorites({ page: 1, page_size: 12 });
      setFavorites(fav?.results || []);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  return (
    <div data-easytag="id1-react/src/pages/Profile.jsx" className="grid gap-6">
      <section data-easytag="id2-react/src/pages/Profile.jsx" className="rounded-xl bg-white border border-border p-4">
        <h1 data-easytag="id3-react/src/pages/Profile.jsx" className="text-2xl font-bold mb-2">Личный кабинет</h1>
        {user ? (
          <div data-easytag="id4-react/src/pages/Profile.jsx" className="text-sm text-muted">{user.username} ({user.email}) • Роль: {user.role}</div>
        ) : (
          <div data-easytag="id5-react/src/pages/Profile.jsx" className="text-sm text-muted">Необходимо войти, чтобы видеть профиль</div>
        )}
      </section>
      <section data-easytag="id6-react/src/pages/Profile.jsx" className="rounded-xl bg-white border border-border p-4">
        <h2 data-easytag="id7-react/src/pages/Profile.jsx" className="text-lg font-semibold mb-3">Избранные объявления</h2>
        <div data-easytag="id8-react/src/pages/Profile.jsx" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.length === 0 ? (
            <div data-easytag="id9-react/src/pages/Profile.jsx" className="text-muted">Пусто</div>
          ) : favorites.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
