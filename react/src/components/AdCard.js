import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../api/ads';
import { useAuth } from '../context/AuthContext';

const AdCard = ({ item, onFavorChanged }) => {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);
  const isFav = item.is_favorite;

  async function toggleFav(e) {
    e.preventDefault();
    if (!user) return;
    try {
      setPending(true);
      if (isFav) {
        await removeFavorite(item.id);
        onFavorChanged && onFavorChanged(false);
      } else {
        await addFavorite(item.id);
        onFavorChanged && onFavorChanged(true);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Link data-easytag="id1-react/src/components/AdCard.js" to={`/ad/${item.id}`} className="block bg-white border border-border rounded-xl overflow-hidden hover:shadow-soft transition-shadow">
      <div data-easytag="id2-react/src/components/AdCard.js" className="aspect-video bg-surface flex items-center justify-center text-muted">
        {item.thumbnail ? (
          <img data-easytag="id3-react/src/components/AdCard.js" src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div data-easytag="id4-react/src/components/AdCard.js" className="text-xs">Изображение</div>
        )}
      </div>
      <div data-easytag="id5-react/src/components/AdCard.js" className="p-4 space-y-2">
        <div data-easytag="id6-react/src/components/AdCard.js" className="flex items-start justify-between gap-2">
          <h3 data-easytag="id7-react/src/components/AdCard.js" className="font-semibold line-clamp-2">{item.title}</h3>
          {user && (
            <button data-easytag="id8-react/src/components/AdCard.js" onClick={toggleFav} disabled={pending} className={`text-sm px-2 py-1 rounded border ${isFav ? 'bg-accent text-white border-accent' : 'border-border'}`}>{isFav ? '★' : '☆'}</button>
          )}
        </div>
        <div data-easytag="id9-react/src/components/AdCard.js" className="text-lg font-semibold">{Number(item.price).toLocaleString('ru-RU')} ₽</div>
        <div data-easytag="id10-react/src/components/AdCard.js" className="text-sm text-muted flex gap-2 flex-wrap">
          <span data-easytag="id11-react/src/components/AdCard.js">{item.make?.name}</span>
          <span data-easytag="id12-react/src/components/AdCard.js">{item.model?.name}</span>
          <span data-easytag="id13-react/src/components/AdCard.js">{item.year} г.</span>
          <span data-easytag="id14-react/src/components/AdCard.js">{item.mileage?.toLocaleString('ru-RU')} км</span>
          {item.city?.name ? <span data-easytag="id15-react/src/components/AdCard.js">{item.city?.name}</span> : null}
        </div>
      </div>
    </Link>
  );
};

export default AdCard;
