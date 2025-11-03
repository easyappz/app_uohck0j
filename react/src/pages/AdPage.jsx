import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAd } from '../api/ads';
import { addFavorite, removeFavorite } from '../api/favorites';
import { sendContact } from '../api/contact';

const AdPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const fetchAd = async () => {
    setLoading(true);
    try {
      const data = await getAd(id);
      setAd(data);
    } catch (e) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAd(); }, [id]);

  const toggleFav = async () => {
    if (!ad) return;
    try {
      if (ad.is_favorite) await removeFavorite(ad.id);
      else await addFavorite(ad.id);
      setAd({ ...ad, is_favorite: !ad.is_favorite });
    } catch (e) {
      // handled globally
    }
  };

  const submitContact = async (e) => {
    e.preventDefault();
    try {
      await sendContact(id, contact);
      setSent(true);
    } catch (e) {}
  };

  if (loading) {
    return <div data-easytag="id1-react/src/pages/AdPage.jsx" className="text-center text-muted">Загрузка…</div>;
  }

  if (!ad) {
    return <div data-easytag="id2-react/src/pages/AdPage.jsx" className="text-center text-muted">Объявление не найдено</div>;
  }

  return (
    <div data-easytag="id3-react/src/pages/AdPage.jsx" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section data-easytag="id4-react/src/pages/AdPage.jsx" className="lg:col-span-2 rounded-xl bg-white border border-border p-4">
        <div data-easytag="id5-react/src/pages/AdPage.jsx" className="aspect-video w-full rounded-lg bg-surface border border-border mb-4"></div>
        <h1 data-easytag="id6-react/src/pages/AdPage.jsx" className="text-2xl font-bold mb-2">{ad.title}</h1>
        <div data-easytag="id7-react/src/pages/AdPage.jsx" className="text-muted mb-4">{ad.make?.name} {ad.model?.name} • {ad.year} • {ad.mileage?.toLocaleString?.('ru-RU')} км</div>
        <div data-easytag="id8-react/src/pages/AdPage.jsx" className="prose max-w-none text-slate-800"><p data-easytag="id9-react/src/pages/AdPage.jsx">{ad.description || 'Описание отсутствует'}</p></div>
      </section>
      <aside data-easytag="id10-react/src/pages/AdPage.jsx" className="lg:col-span-1">
        <div data-easytag="id11-react/src/pages/AdPage.jsx" className="rounded-xl bg-white border border-border p-4 flex flex-col gap-3">
          <div data-easytag="id12-react/src/pages/AdPage.jsx" className="text-2xl font-bold">{ad.price != null ? `${ad.price.toLocaleString('ru-RU')} ₽` : '—'}</div>
          <button data-easytag="id13-react/src/pages/AdPage.jsx" type="button" onClick={toggleFav} className={`h-10 px-4 rounded-lg border ${ad.is_favorite ? 'border-accent text-accent bg-accent/5' : 'border-border'}`}>{ad.is_favorite ? 'В избранном' : 'В избранное'}</button>
        </div>
        <form data-easytag="id14-react/src/pages/AdPage.jsx" onSubmit={submitContact} className="mt-4 rounded-xl bg-white border border-border p-4 flex flex-col gap-2">
          <h3 data-easytag="id15-react/src/pages/AdPage.jsx" className="font-semibold">Связаться с продавцом</h3>
          {sent ? (
            <div data-easytag="id16-react/src/pages/AdPage.jsx" className="text-sm text-accent">Заявка отправлена</div>
          ) : (
            <>
              <label data-easytag="id17-react/src/pages/AdPage.jsx" className="text-xs text-muted">Ваше имя</label>
              <input data-easytag="id18-react/src/pages/AdPage.jsx" type="text" required className="h-10 rounded-lg border border-border px-3" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              <label data-easytag="id19-react/src/pages/AdPage.jsx" className="text-xs text-muted">Телефон</label>
              <input data-easytag="id20-react/src/pages/AdPage.jsx" type="text" required className="h-10 rounded-lg border border-border px-3" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              <label data-easytag="id21-react/src/pages/AdPage.jsx" className="text-xs text-muted">Сообщение</label>
              <textarea data-easytag="id22-react/src/pages/AdPage.jsx" rows="3" className="rounded-lg border border-border px-3 py-2" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
              <button data-easytag="id23-react/src/pages/AdPage.jsx" type="submit" className="h-10 mt-2 px-4 rounded-lg bg-accent text-white">Отправить</button>
            </>
          )}
        </form>
      </aside>
    </div>
  );
};

export default AdPage;
