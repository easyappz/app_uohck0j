import React, { useEffect, useState } from 'react';
import { getOptions, getModelsByMake } from '../api/meta';
import { createAd, uploadImages } from '../api/ads';

const AddAd = () => {
  const [meta, setMeta] = useState(null);
  const [modelsByMake, setModelsByMake] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', year: '', mileage: '', engine_volume: '', power: '', vin: '',
    condition: 'used', make: '', model: '', body_type: '', fuel_type: '', transmission_type: '', drive_type: '', color: '', city: '', features: [], is_active: true
  });

  useEffect(() => {
    const load = async () => {
      try { const data = await getOptions(); setMeta(data); } catch (e) {}
    };
    load();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!form.make) { setModelsByMake([]); return; }
      try { const data = await getModelsByMake(form.make); setModelsByMake(data || []); } catch (e) {}
    };
    loadModels();
  }, [form.make]);

  const update = (k, v) => setForm({ ...form, [k]: v });
  const toggleFeature = (id) => {
    const exists = form.features.includes(id);
    update('features', exists ? form.features.filter((x) => x !== id) : [...form.features, id]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price || 0), year: Number(form.year || 0), mileage: Number(form.mileage || 0), engine_volume: Number(form.engine_volume || 0), power: Number(form.power || 0) };
      const created = await createAd(payload);
      if (images.length) {
        await uploadImages(created.id, Array.from(images));
      }
      alert('Объявление создано');
      setForm({ ...form, title: '', description: '', price: '', year: '', mileage: '', engine_volume: '', power: '', vin: '', make: '', model: '', body_type: '', fuel_type: '', transmission_type: '', drive_type: '', color: '', city: '', features: [] });
      setImages([]);
    } catch (e) {
      // handled globally
    } finally { setLoading(false); }
  };

  return (
    <form data-easytag="id1-react/src/pages/AddAd.jsx" onSubmit={submit} className="grid grid-cols-1 gap-6">
      <section data-easytag="id2-react/src/pages/AddAd.jsx" className="rounded-xl bg-white border border-border p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div data-easytag="id3-react/src/pages/AddAd.jsx" className="flex flex-col gap-2">
          <label data-easytag="id4-react/src/pages/AddAd.jsx" className="text-xs text-muted">Заголовок</label>
          <input data-easytag="id5-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.title} onChange={(e) => update('title', e.target.value)} required />
          <label data-easytag="id6-react/src/pages/AddAd.jsx" className="text-xs text-muted">Описание</label>
          <textarea data-easytag="id7-react/src/pages/AddAd.jsx" rows="4" className="rounded-lg border border-border px-3 py-2" value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div data-easytag="id8-react/src/pages/AddAd.jsx" className="grid grid-cols-2 gap-3">
          <div data-easytag="id9-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id10-react/src/pages/AddAd.jsx" className="text-xs text-muted">Цена</label><input data-easytag="id11-react/src/pages/AddAd.jsx" type="number" className="h-10 rounded-lg border border-border px-3" value={form.price} onChange={(e) => update('price', e.target.value)} required /></div>
          <div data-easytag="id12-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id13-react/src/pages/AddAd.jsx" className="text-xs text-muted">Год</label><input data-easytag="id14-react/src/pages/AddAd.jsx" type="number" className="h-10 rounded-lg border border-border px-3" value={form.year} onChange={(e) => update('year', e.target.value)} required /></div>
          <div data-easytag="id15-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id16-react/src/pages/AddAd.jsx" className="text-xs text-muted">Пробег, км</label><input data-easytag="id17-react/src/pages/AddAd.jsx" type="number" className="h-10 rounded-lg border border-border px-3" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} required /></div>
          <div data-easytag="id18-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id19-react/src/pages/AddAd.jsx" className="text-xs text-muted">Объём, л</label><input data-easytag="id20-react/src/pages/AddAd.jsx" type="number" step="0.1" className="h-10 rounded-lg border border-border px-3" value={form.engine_volume} onChange={(e) => update('engine_volume', e.target.value)} required /></div>
          <div data-easytag="id21-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id22-react/src/pages/AddAd.jsx" className="text-xs text-muted">Мощность, л.с.</label><input data-easytag="id23-react/src/pages/AddAd.jsx" type="number" className="h-10 rounded-lg border border-border px-3" value={form.power} onChange={(e) => update('power', e.target.value)} required /></div>
          <div data-easytag="id24-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id25-react/src/pages/AddAd.jsx" className="text-xs text-muted">VIN</label><input data-easytag="id26-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.vin} onChange={(e) => update('vin', e.target.value)} /></div>
        </div>
      </section>

      <section data-easytag="id27-react/src/pages/AddAd.jsx" className="rounded-xl bg-white border border-border p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div data-easytag="id28-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id29-react/src/pages/AddAd.jsx" className="text-xs text-muted">Состояние</label><select data-easytag="id30-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.condition} onChange={(e) => update('condition', e.target.value)}><option data-easytag="id31-react/src/pages/AddAd.jsx" value="new">Новый</option><option data-easytag="id32-react/src/pages/AddAd.jsx" value="used">С пробегом</option></select></div>
        <div data-easytag="id33-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id34-react/src/pages/AddAd.jsx" className="text-xs text-muted">Марка</label><select data-easytag="id35-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.make} onChange={(e) => update('make', e.target.value)}>{(meta?.makes || []).map((x) => <option data-easytag="id36-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id37-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id38-react/src/pages/AddAd.jsx" className="text-xs text-muted">Модель</label><select data-easytag="id39-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.model} onChange={(e) => update('model', e.target.value)}>{(modelsByMake || []).map((x) => <option data-easytag="id40-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id41-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id42-react/src/pages/AddAd.jsx" className="text-xs text-muted">Тип кузова</label><select data-easytag="id43-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.body_type} onChange={(e) => update('body_type', e.target.value)}>{(meta?.body_types || []).map((x) => <option data-easytag="id44-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id45-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id46-react/src/pages/AddAd.jsx" className="text-xs text-muted">Топливо</label><select data-easytag="id47-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.fuel_type} onChange={(e) => update('fuel_type', e.target.value)}>{(meta?.fuel_types || []).map((x) => <option data-easytag="id48-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id49-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id50-react/src/pages/AddAd.jsx" className="text-xs text-muted">КПП</label><select data-easytag="id51-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.transmission_type} onChange={(e) => update('transmission_type', e.target.value)}>{(meta?.transmission_types || []).map((x) => <option data-easytag="id52-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id53-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id54-react/src/pages/AddAd.jsx" className="text-xs text-muted">Привод</label><select data-easytag="id55-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.drive_type} onChange={(e) => update('drive_type', e.target.value)}>{(meta?.drive_types || []).map((x) => <option data-easytag="id56-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id57-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id58-react/src/pages/AddAd.jsx" className="text-xs text-muted">Цвет</label><select data-easytag="id59-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.color} onChange={(e) => update('color', e.target.value)}>{(meta?.colors || []).map((x) => <option data-easytag="id60-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div data-easytag="id61-react/src/pages/AddAd.jsx" className="flex flex-col gap-1"><label data-easytag="id62-react/src/pages/AddAd.jsx" className="text-xs text-muted">Город</label><select data-easytag="id63-react/src/pages/AddAd.jsx" className="h-10 rounded-lg border border-border px-3" value={form.city} onChange={(e) => update('city', e.target.value)}>{(meta?.cities || []).map((x) => <option data-easytag="id64-react/src/pages/AddAd.jsx" key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      </section>

      <section data-easytag="id65-react/src/pages/AddAd.jsx" className="rounded-xl bg-white border border-border p-4">
        <label data-easytag="id66-react/src/pages/AddAd.jsx" className="text-xs text-muted">Фотографии</label>
        <input data-easytag="id67-react/src/pages/AddAd.jsx" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="mt-2" />
        <div data-easytag="id68-react/src/pages/AddAd.jsx" className="mt-2 text-xs text-muted">До 10 изображений, каждый файл ≤ 5MB</div>
      </section>

      <section data-easytag="id69-react/src/pages/AddAd.jsx" className="flex items-center gap-2">
        <button data-easytag="id70-react/src/pages/AddAd.jsx" type="submit" className="h-11 px-5 rounded-lg bg-accent text-white" disabled={loading}>{loading ? 'Сохраняем…' : 'Создать объявление'}</button>
        <button data-easytag="id71-react/src/pages/AddAd.jsx" type="button" className="h-11 px-5 rounded-lg border border-border" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>К началу</button>
      </section>
    </form>
  );
};

export default AddAd;
