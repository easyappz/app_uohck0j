import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addFavorite, contactSeller, getAd, removeFavorite } from '../api/ads';
import { useAuth } from '../context/AuthContext';

const AdPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favPending, setFavPending] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const { user } = useAuth();

  async function load() {
    setLoading(true);
    try {
      const data = await getAd(id);
      setAd(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function toggleFav() {
    if (!user) return;
    try {
      setFavPending(true);
      if (ad.is_favorite) {
        await removeFavorite(id);
        setAd({ ...ad, is_favorite: false });
      } else {
        await addFavorite(id);
        setAd({ ...ad, is_favorite: true });
      }
    } finally {
      setFavPending(false);
    }
  }

  async function submitContact(e) {
    e.preventDefault();
    try {
      setContactStatus('');
      const payload = { name: contact.name, phone: contact.phone };
      if (contact.message) payload.message = contact.message;
      await contactSeller(id, payload);
      setContactStatus('Запрос отправлен!');
      setContact({ name: '', phone: '', message: '' });
    } catch (e) {
      setContactStatus('Не удалось отправить. Проверьте данные.');
    }
  }

  if (loading) {
    return (
      <div data-easytag="id1-react/src/pages/AdPage.js" className="max-w-6xl mx-auto px-4 py-10 text-muted">Загрузка...</div>
    );
  }

  if (!ad) {
    return (
      <div data-easytag="id2-react/src/pages/AdPage.js" className="max-w-6xl mx-auto px-4 py-10">Объявление не найдено</div>
    );
  }

  return (
    <div data-easytag="id3-react/src/pages/AdPage.js" className="max-w-6xl mx-auto px-4 py-8">
      <div data-easytag="id4-react/src/pages/AdPage.js" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div data-easytag="id5-react/src/pages/AdPage.js" className="lg:col-span-2 space-y-4">
          <div data-easytag="id6-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <h1 data-easytag="id7-react/src/pages/AdPage.js" className="text-2xl font-semibold mb-2">{ad.title}</h1>
            <div data-easytag="id8-react/src/pages/AdPage.js" className="text-lg font-semibold">{Number(ad.price).toLocaleString('ru-RU')} ₽</div>
          </div>

          <div data-easytag="id9-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <div data-easytag="id10-react/src/pages/AdPage.js" className="aspect-video bg-surface flex items-center justify-center text-muted rounded-lg">Галерея изображений</div>
          </div>

          <div data-easytag="id11-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <h3 data-easytag="id12-react/src/pages/AdPage.js" className="font-semibold mb-3">Характеристики</h3>
            <div data-easytag="id13-react/src/pages/AdPage.js" className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div data-easytag="id14-react/src/pages/AdPage.js">Марка: {ad.make?.name}</div>
              <div data-easytag="id15-react/src/pages/AdPage.js">Модель: {ad.model?.name}</div>
              <div data-easytag="id16-react/src/pages/AdPage.js">Год: {ad.year}</div>
              <div data-easytag="id17-react/src/pages/AdPage.js">Пробег: {ad.mileage?.toLocaleString('ru-RU')} км</div>
              <div data-easytag="id18-react/src/pages/AdPage.js">Двигатель: {ad.engine_volume} л</div>
              <div data-easytag="id19-react/src/pages/AdPage.js">Мощность: {ad.power} л.с.</div>
              <div data-easytag="id20-react/src/pages/AdPage.js">Кузов: {ad.body_type?.name || ad.body_type}</div>
              <div data-easytag="id21-react/src/pages/AdPage.js">Топливо: {ad.fuel_type?.name || ad.fuel_type}</div>
              <div data-easytag="id22-react/src/pages/AdPage.js">КПП: {ad.transmission_type?.name || ad.transmission_type}</div>
              <div data-easytag="id23-react/src/pages/AdPage.js">Привод: {ad.drive_type?.name || ad.drive_type}</div>
              <div data-easytag="id24-react/src/pages/AdPage.js">Цвет: {ad.color?.name || ad.color}</div>
              <div data-easytag="id25-react/src/pages/AdPage.js">Город: {ad.city?.name}</div>
            </div>
          </div>

          <div data-easytag="id26-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <h3 data-easytag="id27-react/src/pages/AdPage.js" className="font-semibold mb-3">Описание</h3>
            <p data-easytag="id28-react/src/pages/AdPage.js" className="text-sm whitespace-pre-wrap">{ad.description || '—'}</p>
          </div>
        </div>

        <div data-easytag="id29-react/src/pages/AdPage.js" className="space-y-4">
          <div data-easytag="id30-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <div data-easytag="id31-react/src/pages/AdPage.js" className="flex items-center justify-between mb-2">
              <div data-easytag="id32-react/src/pages/AdPage.js" className="font-semibold">Продавец: {ad.seller?.username}</div>
              {user && (
                <button data-easytag="id33-react/src/pages/AdPage.js" onClick={toggleFav} disabled={favPending} className={`px-3 py-1 rounded border ${ad.is_favorite ? 'bg-accent text-white border-accent' : 'border-border'}`}>{ad.is_favorite ? 'В избранном' : 'В избранное'}</button>
              )}
            </div>
            <div data-easytag="id34-react/src/pages/AdPage.js" className="text-sm text-muted">Город: {ad.city?.name}</div>
          </div>

          <div data-easytag="id35-react/src/pages/AdPage.js" className="bg-white border border-border rounded-xl p-4">
            <h3 data-easytag="id36-react/src/pages/AdPage.js" className="font-semibold mb-3">Связаться с продавцом</h3>
            <form data-easytag="id37-react/src/pages/AdPage.js" onSubmit={submitContact} className="space-y-3">
              <div data-easytag="id38-react/src/pages/AdPage.js" className="grid gap-1">
                <label data-easytag="id39-react/src/pages/AdPage.js" className="text-xs text-muted">Имя</label>
                <input data-easytag="id40-react/src/pages/AdPage.js" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="px-3 py-2 border border-border rounded-md" required />
              </div>
              <div data-easytag="id41-react/src/pages/AdPage.js" className="grid gap-1">
                <label data-easytag="id42-react/src/pages/AdPage.js" className="text-xs text-muted">Телефон</label>
                <input data-easytag="id43-react/src/pages/AdPage.js" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="px-3 py-2 border border-border rounded-md" required />
              </div>
              <div data-easytag="id44-react/src/pages/AdPage.js" className="grid gap-1">
                <label data-easytag="id45-react/src/pages/AdPage.js" className="text-xs text-muted">Сообщение</label>
                <textarea data-easytag="id46-react/src/pages/AdPage.js" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} className="px-3 py-2 border border-border rounded-md min-h-[100px]" />
              </div>
              <button data-easytag="id47-react/src/pages/AdPage.js" type="submit" className="w-full px-4 py-2 rounded-md bg-accent text-white">Отправить</button>
              {contactStatus && <div data-easytag="id48-react/src/pages/AdPage.js" className="text-sm mt-1">{contactStatus}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPage;
