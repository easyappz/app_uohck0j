import React, { useEffect, useState } from 'react';

const initialState = {
  q: '',
  make: '',
  model: '',
  year_min: '',
  year_max: '',
  price_min: '',
  price_max: '',
  mileage_max: '',
  transmission_type: '',
  fuel_type: '',
  body_type: '',
  drive_type: '',
  color: '',
  city: '',
  features: []
};

const Filters = ({ meta, value, onChange, onSubmit }) => {
  const [form, setForm] = useState({ ...initialState, ...(value || {}) });

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...(value || {}) }));
  }, [value]);

  const handleChange = (field, val) => {
    const updated = { ...form, [field]: val };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleMultiToggle = (id) => {
    const exists = form.features.includes(id);
    const updated = { ...form, features: exists ? form.features.filter((x) => x !== id) : [...form.features, id] };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleReset = () => {
    setForm(initialState);
    onChange && onChange(initialState);
  };

  return (
    <form data-easytag="id1-react/src/components/Filters.jsx" className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(form); }}>
      <div data-easytag="id2-react/src/components/Filters.jsx" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div data-easytag="id3-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id4-react/src/components/Filters.jsx" className="text-xs text-muted">Поиск</label>
          <input data-easytag="id5-react/src/components/Filters.jsx" type="text" value={form.q} onChange={(e) => handleChange('q', e.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="Марка, модель, описание" />
        </div>
        <div data-easytag="id6-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id7-react/src/components/Filters.jsx" className="text-xs text-muted">Марка</label>
          <select data-easytag="id8-react/src/components/Filters.jsx" value={form.make} onChange={(e) => handleChange('make', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id9-react/src/components/Filters.jsx" value="">Любая</option>
            {(meta?.makes || []).map((m) => (
              <option data-easytag="id10-react/src/components/Filters.jsx" key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id11-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id12-react/src/components/Filters.jsx" className="text-xs text-muted">Модель</label>
          <select data-easytag="id13-react/src/components/Filters.jsx" value={form.model} onChange={(e) => handleChange('model', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id14-react/src/components/Filters.jsx" value="">Любая</option>
            {(meta?.models || []).filter((md) => !form.make || md?.make?.id === Number(form.make)).map((md) => (
              <option data-easytag="id15-react/src/components/Filters.jsx" key={md.id} value={md.id}>{md.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id16-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id17-react/src/components/Filters.jsx" className="text-xs text-muted">Год от</label>
          <input data-easytag="id18-react/src/components/Filters.jsx" type="number" value={form.year_min} onChange={(e) => handleChange('year_min', e.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="1950" />
        </div>
        <div data-easytag="id19-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id20-react/src/components/Filters.jsx" className="text-xs text-muted">Год до</label>
          <input data-easytag="id21-react/src/components/Filters.jsx" type="number" value={form.year_max} onChange={(e) => handleChange('year_max', e.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="2025" />
        </div>
        <div data-easytag="id22-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id23-react/src/components/Filters.jsx" className="text-xs text-muted">Цена от</label>
          <input data-easytag="id24-react/src/components/Filters.jsx" type="number" value={form.price_min} onChange={(e) => handleChange('price_min', e.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="0" />
        </div>
        <div data-easytag="id25-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id26-react/src/components/Filters.jsx" className="text-xs text-muted">Цена до</label>
          <input data-easytag="id27-react/src/components/Filters.jsx" type="number" value={form.price_max} onChange={(e) => handleChange('price_max', e.target.value)} className="h-10 rounded-lg border border-border px-3" placeholder="10000000" />
        </div>
        <div data-easytag="id28-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id29-react/src/components/Filters.jsx" className="text-xs text-muted">КПП</label>
          <select data-easytag="id30-react/src/components/Filters.jsx" value={form.transmission_type} onChange={(e) => handleChange('transmission_type', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id31-react/src/components/Filters.jsx" value="">Любая</option>
            {(meta?.transmission_types || []).map((x) => (
              <option data-easytag="id32-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id33-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id34-react/src/components/Filters.jsx" className="text-xs text-muted">Топливо</label>
          <select data-easytag="id35-react/src/components/Filters.jsx" value={form.fuel_type} onChange={(e) => handleChange('fuel_type', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id36-react/src/components/Filters.jsx" value="">Любой</option>
            {(meta?.fuel_types || []).map((x) => (
              <option data-easytag="id37-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id38-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id39-react/src/components/Filters.jsx" className="text-xs text-muted">Кузов</label>
          <select data-easytag="id40-react/src/components/Filters.jsx" value={form.body_type} onChange={(e) => handleChange('body_type', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id41-react/src/components/Filters.jsx" value="">Любой</option>
            {(meta?.body_types || []).map((x) => (
              <option data-easytag="id42-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id43-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id44-react/src/components/Filters.jsx" className="text-xs text-muted">Привод</label>
          <select data-easytag="id45-react/src/components/Filters.jsx" value={form.drive_type} onChange={(e) => handleChange('drive_type', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id46-react/src/components/Filters.jsx" value="">Любой</option>
            {(meta?.drive_types || []).map((x) => (
              <option data-easytag="id47-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id48-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id49-react/src/components/Filters.jsx" className="text-xs text-muted">Цвет</label>
          <select data-easytag="id50-react/src/components/Filters.jsx" value={form.color} onChange={(e) => handleChange('color', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id51-react/src/components/Filters.jsx" value="">Любой</option>
            {(meta?.colors || []).map((x) => (
              <option data-easytag="id52-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id53-react/src/components/Filters.jsx" className="flex flex-col gap-1">
          <label data-easytag="id54-react/src/components/Filters.jsx" className="text-xs text-muted">Город</label>
          <select data-easytag="id55-react/src/components/Filters.jsx" value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="h-10 rounded-lg border border-border px-3">
            <option data-easytag="id56-react/src/components/Filters.jsx" value="">Любой</option>
            {(meta?.cities || []).map((x) => (
              <option data-easytag="id57-react/src/components/Filters.jsx" key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id58-react/src/components/Filters.jsx" className="flex flex-col gap-1 sm:col-span-2">
          <label data-easytag="id59-react/src/components/Filters.jsx" className="text-xs text-muted">Опции</label>
          <div data-easytag="id60-react/src/components/Filters.jsx" className="flex flex-wrap gap-2">
            {(meta?.features || []).map((x) => (
              <button data-easytag="id61-react/src/components/Filters.jsx" type="button" key={x.id} className={`text-xs px-3 py-1.5 rounded-full border ${form.features.includes(x.id) ? 'border-accent text-accent bg-accent/5' : 'border-border text-slate-700'}`} onClick={() => handleMultiToggle(x.id)}>{x.name}</button>
            ))}
          </div>
        </div>
      </div>
      <div data-easytag="id62-react/src/components/Filters.jsx" className="flex items-center gap-2">
        <button data-easytag="id63-react/src/components/Filters.jsx" type="submit" className="h-10 px-4 rounded-lg bg-accent text-white">Показать</button>
        <button data-easytag="id64-react/src/components/Filters.jsx" type="button" onClick={handleReset} className="h-10 px-4 rounded-lg border border-border">Сбросить</button>
      </div>
    </form>
  );
};

export default Filters;
