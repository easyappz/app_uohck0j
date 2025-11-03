import React, { useEffect, useMemo, useState } from 'react';
import { getMetaOptions, getModelsByMake } from '../api/meta';

const initialState = {
  q: '',
  make: '',
  model: '',
  year_min: '',
  year_max: '',
  price_min: '',
  price_max: '',
  body_type: '',
  fuel_type: '',
  transmission_type: '',
  drive_type: '',
  color: '',
  mileage_max: '',
  city: '',
  features: [],
};

const FiltersPanel = ({ value, onChange, onApply, onReset }) => {
  const [meta, setMeta] = useState(null);
  const [models, setModels] = useState([]);
  const filters = value || initialState;

  useEffect(() => {
    let mounted = true;
    getMetaOptions().then((data) => { if (mounted) setMeta(data); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    async function load() {
      if (filters.make) {
        const data = await getModelsByMake(filters.make);
        setModels(data);
      } else {
        setModels([]);
      }
    }
    load();
  }, [filters.make]);

  const makes = useMemo(() => meta?.makes || [], [meta]);
  const bodyTypes = useMemo(() => meta?.body_types || [], [meta]);
  const fuelTypes = useMemo(() => meta?.fuel_types || [], [meta]);
  const transmissions = useMemo(() => meta?.transmission_types || [], [meta]);
  const drives = useMemo(() => meta?.drive_types || [], [meta]);
  const colors = useMemo(() => meta?.colors || [], [meta]);
  const cities = useMemo(() => meta?.cities || [], [meta]);
  const features = useMemo(() => meta?.features || [], [meta]);

  function update(key, val) {
    const next = { ...filters, [key]: val };
    onChange(next);
  }

  function toggleFeature(id) {
    const set = new Set(filters.features);
    if (set.has(id)) set.delete(id); else set.add(id);
    update('features', Array.from(set));
  }

  return (
    <div data-easytag="id1-react/src/components/FiltersPanel.js" className="bg-white border border-border rounded-xl p-4 space-y-3">
      <div data-easytag="id2-react/src/components/FiltersPanel.js" className="grid gap-2">
        <label data-easytag="id3-react/src/components/FiltersPanel.js" className="text-xs text-muted">Поиск</label>
        <input data-easytag="id4-react/src/components/FiltersPanel.js" value={filters.q} onChange={(e) => update('q', e.target.value)} className="px-3 py-2 border border-border rounded-md" placeholder="слово в названии или описании" />
      </div>

      <div data-easytag="id5-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id6-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id7-react/src/components/FiltersPanel.js" className="text-xs text-muted">Марка</label>
          <select data-easytag="id8-react/src/components/FiltersPanel.js" value={filters.make} onChange={(e) => { update('make', e.target.value); update('model', ''); }} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id9-react/src/components/FiltersPanel.js" value="">Любая</option>
            {makes.map((m) => (
              <option data-easytag="id10-react/src/components/FiltersPanel.js" key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id11-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id12-react/src/components/FiltersPanel.js" className="text-xs text-muted">Модель</label>
          <select data-easytag="id13-react/src/components/FiltersPanel.js" value={filters.model} onChange={(e) => update('model', e.target.value)} className="px-3 py-2 border border-border rounded-md" disabled={!filters.make}>
            <option data-easytag="id14-react/src/components/FiltersPanel.js" value="">Любая</option>
            {models.map((m) => (
              <option data-easytag="id15-react/src/components/FiltersPanel.js" key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div data-easytag="id16-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id17-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id18-react/src/components/FiltersPanel.js" className="text-xs text-muted">Год от</label>
          <input data-easytag="id19-react/src/components/FiltersPanel.js" type="number" value={filters.year_min} onChange={(e) => update('year_min', e.target.value)} className="px-3 py-2 border border-border rounded-md" />
        </div>
        <div data-easytag="id20-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id21-react/src/components/FiltersPanel.js" className="text-xs text-muted">Год до</label>
          <input data-easytag="id22-react/src/components/FiltersPanel.js" type="number" value={filters.year_max} onChange={(e) => update('year_max', e.target.value)} className="px-3 py-2 border border-border rounded-md" />
        </div>
      </div>

      <div data-easytag="id23-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id24-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id25-react/src/components/FiltersPanel.js" className="text-xs text-muted">Цена от</label>
          <input data-easytag="id26-react/src/components/FiltersPanel.js" type="number" value={filters.price_min} onChange={(e) => update('price_min', e.target.value)} className="px-3 py-2 border border-border rounded-md" />
        </div>
        <div data-easytag="id27-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id28-react/src/components/FiltersPanel.js" className="text-xs text-muted">Цена до</label>
          <input data-easytag="id29-react/src/components/FiltersPanel.js" type="number" value={filters.price_max} onChange={(e) => update('price_max', e.target.value)} className="px-3 py-2 border border-border rounded-md" />
        </div>
      </div>

      <div data-easytag="id30-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id31-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id32-react/src/components/FiltersPanel.js" className="text-xs text-muted">Кузов</label>
          <select data-easytag="id33-react/src/components/FiltersPanel.js" value={filters.body_type} onChange={(e) => update('body_type', e.target.value)} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id34-react/src/components/FiltersPanel.js" value="">Любой</option>
            {bodyTypes.map((x) => <option data-easytag="id35-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div data-easytag="id36-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id37-react/src/components/FiltersPanel.js" className="text-xs text-muted">Топливо</label>
          <select data-easytag="id38-react/src/components/FiltersPanel.js" value={filters.fuel_type} onChange={(e) => update('fuel_type', e.target.value)} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id39-react/src/components/FiltersPanel.js" value="">Любое</option>
            {fuelTypes.map((x) => <option data-easytag="id40-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
      </div>

      <div data-easytag="id41-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id42-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id43-react/src/components/FiltersPanel.js" className="text-xs text-muted">Трансмиссия</label>
          <select data-easytag="id44-react/src/components/FiltersPanel.js" value={filters.transmission_type} onChange={(e) => update('transmission_type', e.target.value)} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id45-react/src/components/FiltersPanel.js" value="">Любая</option>
            {transmissions.map((x) => <option data-easytag="id46-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div data-easytag="id47-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id48-react/src/components/FiltersPanel.js" className="text-xs text-muted">Привод</label>
          <select data-easytag="id49-react/src/components/FiltersPanel.js" value={filters.drive_type} onChange={(e) => update('drive_type', e.target.value)} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id50-react/src/components/FiltersPanel.js" value="">Любой</option>
            {drives.map((x) => <option data-easytag="id51-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
      </div>

      <div data-easytag="id52-react/src/components/FiltersPanel.js" className="grid grid-cols-2 gap-3">
        <div data-easytag="id53-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id54-react/src/components/FiltersPanel.js" className="text-xs text-muted">Цвет</label>
          <select data-easytag="id55-react/src/components/FiltersPanel.js" value={filters.color} onChange={(e) => update('color', e.target.value)} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id56-react/src/components/FiltersPanel.js" value="">Любой</option>
            {colors.map((x) => <option data-easytag="id57-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div data-easytag="id58-react/src/components/FiltersPanel.js" className="grid gap-1">
          <label data-easytag="id59-react/src/components/FiltersPanel.js" className="text-xs text-muted">Пробег до</label>
          <input data-easytag="id60-react/src/components/FiltersPanel.js" type="number" value={filters.mileage_max} onChange={(e) => update('mileage_max', e.target.value)} className="px-3 py-2 border border-border rounded-md" />
        </div>
      </div>

      <div data-easytag="id61-react/src/components/FiltersPanel.js" className="grid gap-1">
        <label data-easytag="id62-react/src/components/FiltersPanel.js" className="text-xs text-muted">Город</label>
        <select data-easytag="id63-react/src/components/FiltersPanel.js" value={filters.city} onChange={(e) => update('city', e.target.value)} className="px-3 py-2 border border-border rounded-md">
          <option data-easytag="id64-react/src/components/FiltersPanel.js" value="">Любой</option>
          {cities.map((x) => <option data-easytag="id65-react/src/components/FiltersPanel.js" key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>

      <div data-easytag="id66-react/src/components/FiltersPanel.js" className="grid gap-2">
        <div data-easytag="id67-react/src/components/FiltersPanel.js" className="text-xs text-muted">Опции</div>
        <div data-easytag="id68-react/src/components/FiltersPanel.js" className="flex flex-wrap gap-2">
          {features.map((f) => (
            <label data-easytag="id69-react/src/components/FiltersPanel.js" key={f.id} className="inline-flex items-center gap-2 text-sm">
              <input data-easytag="id70-react/src/components/FiltersPanel.js" type="checkbox" checked={filters.features.includes(f.id)} onChange={() => toggleFeature(f.id)} />
              <span data-easytag="id71-react/src/components/FiltersPanel.js">{f.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div data-easytag="id72-react/src/components/FiltersPanel.js" className="pt-2 flex gap-2">
        <button data-easytag="id73-react/src/components/FiltersPanel.js" onClick={onApply} className="px-4 py-2 rounded-md bg-accent text-white">Применить</button>
        <button data-easytag="id74-react/src/components/FiltersPanel.js" onClick={onReset} className="px-4 py-2 rounded-md border border-border">Сбросить</button>
      </div>
    </div>
  );
};

export default FiltersPanel;
