import React from 'react';
import { Link } from 'react-router-dom';

const AdCard = ({ ad, onToggleFavorite }) => {
  return (
    <div data-easytag="id1-react/src/components/AdCard.jsx" className="group rounded-xl border border-border bg-white shadow-soft hover:shadow-md transition p-3 flex flex-col">
      <div data-easytag="id2-react/src/components/AdCard.jsx" className="aspect-video w-full rounded-lg bg-surface border border-border mb-3"></div>
      <div data-easytag="id3-react/src/components/AdCard.jsx" className="flex-1 flex flex-col gap-2">
        <Link data-easytag="id4-react/src/components/AdCard.jsx" to={`/ad/${ad?.id}`} className="text-base font-semibold leading-tight hover:text-accent">
          <span data-easytag="id5-react/src/components/AdCard.jsx">{ad?.title || 'Объявление'}</span>
        </Link>
        <div data-easytag="id6-react/src/components/AdCard.jsx" className="text-sm text-muted flex items-center gap-2">
          <span data-easytag="id7-react/src/components/AdCard.jsx">{ad?.make?.name} {ad?.model?.name}</span>
          <span data-easytag="id8-react/src/components/AdCard.jsx">•</span>
          <span data-easytag="id9-react/src/components/AdCard.jsx">{ad?.year}</span>
          <span data-easytag="id10-react/src/components/AdCard.jsx">•</span>
          <span data-easytag="id11-react/src/components/AdCard.jsx">{ad?.mileage?.toLocaleString?.('ru-RU')} км</span>
        </div>
        <div data-easytag="id12-react/src/components/AdCard.jsx" className="mt-auto flex items-center justify-between">
          <span data-easytag="id13-react/src/components/AdCard.jsx" className="text-lg font-bold">{ad?.price != null ? `${ad.price.toLocaleString('ru-RU')} ₽` : '—'}</span>
          <button data-easytag="id14-react/src/components/AdCard.jsx" type="button" onClick={() => onToggleFavorite && onToggleFavorite(ad)} className={`text-sm px-3 py-1.5 rounded-md border ${ad?.is_favorite ? 'border-accent text-accent bg-accent/5' : 'border-border text-slate-700 hover:bg-surface'}`}>
            {ad?.is_favorite ? 'В избранном' : 'В избранное'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
