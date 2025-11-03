import React, { useEffect, useMemo, useState } from 'react';
import { createAd, uploadImages } from '../api/ads';
import { getMetaOptions, getModelsByMake } from '../api/meta';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  title: '',
  description: '',
  price: '',
  year: '',
  mileage: '',
  engine_volume: '',
  power: '',
  vin: '',
  condition: 'used',
  make: '',
  model: '',
  body_type: '',
  fuel_type: '',
  transmission_type: '',
  drive_type: '',
  color: '',
  city: '',
  features: [],
  is_active: true,
};

const AddAd = () => {
  const [form, setForm] = useState(initialForm);
  const [meta, setMeta] = useState(null);
  const [models, setModels] = useState([]);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMetaOptions().then(setMeta);
  }, []);

  useEffect(() => {
    async function load() {
      if (form.make) {
        const data = await getModelsByMake(form.make);
        setModels(data);
      } else {
        setModels([]);
      }
    }
    load();
  }, [form.make]);

  const features = useMemo(() => meta?.features || [], [meta]);

  function updateField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function toggleFeature(id) {
    setForm((prev) => {
      const set = new Set(prev.features);
      if (set.has(id)) set.delete(id); else set.add(id);
      return { ...prev, features: Array.from(set) };
    });
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      // Convert numeric fields
      const numericFields = ['price', 'year', 'mileage', 'engine_volume', 'power', 'make', 'model', 'body_type', 'fuel_type', 'transmission_type', 'drive_type', 'color', 'city'];
      numericFields.forEach((f) => { if (payload[f] !== '') payload[f] = Number(payload[f]); });

      const created = await createAd(payload);

      if (files && files.length) {
        await uploadImages(created.id, Array.from(files));
      }
      navigate(`/ad/${created.id}`);
    } catch (e) {
      // handled globally
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-easytag="id1-react/src/pages/AddAd.js" className="max-w-4xl mx-auto px-4 py-8">
      <h1 data-easytag="id2-react/src/pages/AddAd.js" className="text-2xl font-semibold mb-4">Добавить объявление</h1>
      <form data-easytag="id3-react/src/pages/AddAd.js" onSubmit={submit} className="bg-white border border-border rounded-xl p-6 space-y-4">
        <div data-easytag="id4-react/src/pages/AddAd.js" className="grid gap-1">
          <label data-easytag="id5-react/src/pages/AddAd.js" className="text-xs text-muted">Заголовок</label>
          <input data-easytag="id6-react/src/pages/AddAd.js" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
        </div>

        <div data-easytag="id7-react/src/pages/AddAd.js" className="grid gap-1">
          <label data-easytag="id8-react/src/pages/AddAd.js" className="text-xs text-muted">Описание</label>
          <textarea data-easytag="id9-react/src/pages/AddAd.js" value={form.description} onChange={(e) => updateField('description', e.target.value)} className="px-3 py-2 border border-border rounded-md min-h-[120px]" />
        </div>

        <div data-easytag="id10-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id11-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id12-react/src/pages/AddAd.js" className="text-xs text-muted">Цена (₽)</label>
            <input data-easytag="id13-react/src/pages/AddAd.js" type="number" inputMode="decimal" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
          </div>
          <div data-easytag="id14-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id15-react/src/pages/AddAd.js" className="text-xs text-muted">Год</label>
            <input data-easytag="id16-react/src/pages/AddAd.js" type="number" value={form.year} onChange={(e) => updateField('year', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
          </div>
        </div>

        <div data-easytag="id17-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id18-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id19-react/src/pages/AddAd.js" className="text-xs text-muted">Пробег (км)</label>
            <input data-easytag="id20-react/src/pages/AddAd.js" type="number" value={form.mileage} onChange={(e) => updateField('mileage', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
          </div>
          <div data-easytag="id21-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id22-react/src/pages/AddAd.js" className="text-xs text-muted">Объем двигателя (л)</label>
            <input data-easytag="id23-react/src/pages/AddAd.js" type="number" step="0.1" value={form.engine_volume} onChange={(e) => updateField('engine_volume', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
          </div>
        </div>

        <div data-easytag="id24-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id25-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id26-react/src/pages/AddAd.js" className="text-xs text-muted">Мощность (л.с.)</label>
            <input data-easytag="id27-react/src/pages/AddAd.js" type="number" value={form.power} onChange={(e) => updateField('power', e.target.value)} className="px-3 py-2 border border-border rounded-md" required />
          </div>
          <div data-easytag="id28-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id29-react/src/pages/AddAd.js" className="text-xs text-muted">VIN</label>
            <input data-easytag="id30-react/src/pages/AddAd.js" value={form.vin} onChange={(e) => updateField('vin', e.target.value)} className="px-3 py-2 border border-border rounded-md" maxLength={17} />
          </div>
        </div>

        <div data-easytag="id31-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id32-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id33-react/src/pages/AddAd.js" className="text-xs text-muted">Состояние</label>
            <select data-easytag="id34-react/src/pages/AddAd.js" value={form.condition} onChange={(e) => updateField('condition', e.target.value)} className="px-3 py-2 border border-border rounded-md">
              <option data-easytag="id35-react/src/pages/AddAd.js" value="used">Б/у</option>
              <option data-easytag="id36-react/src/pages/AddAd.js" value="new">Новый</option>
            </select>
          </div>
          <div data-easytag="id37-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id38-react/src/pages/AddAd.js" className="text-xs text-muted">Марка</label>
            <select data-easytag="id39-react/src/pages/AddAd.js" value={form.make} onChange={(e) => { updateField('make', e.target.value); updateField('model', ''); }} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id40-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.makes?.map((x) => <option data-easytag="id41-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        </div>

        <div data-easytag="id42-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id43-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id44-react/src/pages/AddAd.js" className="text-xs text-muted">Модель</label>
            <select data-easytag="id45-react/src/pages/AddAd.js" value={form.model} onChange={(e) => updateField('model', e.target.value)} className="px-3 py-2 border border-border rounded-md" required disabled={!form.make}>
              <option data-easytag="id46-react/src/pages/AddAd.js" value="">Выберите</option>
              {models.map((x) => <option data-easytag="id47-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div data-easytag="id48-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id49-react/src/pages/AddAd.js" className="text-xs text-muted">Кузов</label>
            <select data-easytag="id50-react/src/pages/AddAd.js" value={form.body_type} onChange={(e) => updateField('body_type', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id51-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.body_types?.map((x) => <option data-easytag="id52-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        </div>

        <div data-easytag="id53-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id54-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id55-react/src/pages/AddAd.js" className="text-xs text-muted">Топливо</label>
            <select data-easytag="id56-react/src/pages/AddAd.js" value={form.fuel_type} onChange={(e) => updateField('fuel_type', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id57-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.fuel_types?.map((x) => <option data-easytag="id58-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div data-easytag="id59-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id60-react/src/pages/AddAd.js" className="text-xs text-muted">КПП</label>
            <select data-easytag="id61-react/src/pages/AddAd.js" value={form.transmission_type} onChange={(e) => updateField('transmission_type', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id62-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.transmission_types?.map((x) => <option data-easytag="id63-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        </div>

        <div data-easytag="id64-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id65-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id66-react/src/pages/AddAd.js" className="text-xs text-muted">Привод</label>
            <select data-easytag="id67-react/src/pages/AddAd.js" value={form.drive_type} onChange={(e) => updateField('drive_type', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id68-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.drive_types?.map((x) => <option data-easytag="id69-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div data-easytag="id70-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id71-react/src/pages/AddAd.js" className="text-xs text-muted">Цвет</label>
            <select data-easytag="id72-react/src/pages/AddAd.js" value={form.color} onChange={(e) => updateField('color', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id73-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.colors?.map((x) => <option data-easytag="id74-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        </div>

        <div data-easytag="id75-react/src/pages/AddAd.js" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-easytag="id76-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id77-react/src/pages/AddAd.js" className="text-xs text-muted">Город</label>
            <select data-easytag="id78-react/src/pages/AddAd.js" value={form.city} onChange={(e) => updateField('city', e.target.value)} className="px-3 py-2 border border-border rounded-md" required>
              <option data-easytag="id79-react/src/pages/AddAd.js" value="">Выберите</option>
              {meta?.cities?.map((x) => <option data-easytag="id80-react/src/pages/AddAd.js" key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div data-easytag="id81-react/src/pages/AddAd.js" className="grid gap-1">
            <label data-easytag="id82-react/src/pages/AddAd.js" className="text-xs text-muted">Опции</label>
            <div data-easytag="id83-react/src/pages/AddAd.js" className="flex flex-wrap gap-2">
              {features.map((f) => (
                <label data-easytag="id84-react/src/pages/AddAd.js" key={f.id} className="inline-flex items-center gap-2 text-sm">
                  <input data-easytag="id85-react/src/pages/AddAd.js" type="checkbox" checked={form.features.includes(f.id)} onChange={() => toggleFeature(f.id)} />
                  <span data-easytag="id86-react/src/pages/AddAd.js">{f.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div data-easytag="id87-react/src/pages/AddAd.js" className="grid gap-1">
          <label data-easytag="id88-react/src/pages/AddAd.js" className="text-xs text-muted">Изображения (1–10)</label>
          <input data-easytag="id89-react/src/pages/AddAd.js" type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="px-3 py-2 border border-border rounded-md" />
        </div>

        <div data-easytag="id90-react/src/pages/AddAd.js" className="pt-2">
          <button data-easytag="id91-react/src/pages/AddAd.js" type="submit" disabled={submitting} className="px-5 py-2 rounded-md bg-accent text-white disabled:opacity-60">Создать объявление</button>
        </div>
      </form>
    </div>
  );
};

export default AddAd;
