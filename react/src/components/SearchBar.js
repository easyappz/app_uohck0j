import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMetaOptions, getModelsByMake } from '../api/meta';

const SearchBar = () => {
  const [meta, setMeta] = useState(null);
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ q: '', make: '', model: '', city: '', price_min: '', price_max: '' });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getMetaOptions().then((data) => { if (mounted) setMeta(data); });
    return () => { mounted = false; };
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

  const makes = useMemo(() => meta?.makes || [], [meta]);
  const cities = useMemo(() => meta?.cities || [], [meta]);

  function applySearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.q) params.set('q', form.q);
    if (form.make) params.set('make', form.make);
    if (form.model) params.set('model', form.model);
    if (form.city) params.set('city', form.city);
    if (form.price_min) params.set('price_min', form.price_min);
    if (form.price_max) params.set('price_max', form.price_max);
    navigate(`/catalog?${params.toString()}`);
  }

  return (
    <form data-easytag="id1-react/src/components/SearchBar.js" onSubmit={applySearch} className="w-full bg-white border border-border rounded-xl shadow-soft p-4 flex flex-col gap-3">
      <div data-easytag="id2-react/src/components/SearchBar.js" className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div data-easytag="id3-react/src/components/SearchBar.js" className="md:col-span-4 grid">
          <label data-easytag="id4-react/src/components/SearchBar.js" className="text-xs text-muted">Поиск</label>
          <input data-easytag="id5-react/src/components/SearchBar.js" type="text" value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} className="px-3 py-2 border border-border rounded-md" placeholder="Марка, модель или ключевое слово" />
        </div>
        <div data-easytag="id6-react/src/components/SearchBar.js" className="md:col-span-2 grid">
          <label data-easytag="id7-react/src/components/SearchBar.js" className="text-xs text-muted">Марка</label>
          <select data-easytag="id8-react/src/components/SearchBar.js" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value, model: '' })} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id9-react/src/components/SearchBar.js" value="">Любая</option>
            {makes.map((m) => (
              <option data-easytag="id10-react/src/components/SearchBar.js" key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id11-react/src/components/SearchBar.js" className="md:col-span-2 grid">
          <label data-easytag="id12-react/src/components/SearchBar.js" className="text-xs text-muted">Модель</label>
          <select data-easytag="id13-react/src/components/SearchBar.js" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="px-3 py-2 border border-border rounded-md" disabled={!form.make}>
            <option data-easytag="id14-react/src/components/SearchBar.js" value="">Любая</option>
            {models.map((m) => (
              <option data-easytag="id15-react/src/components/SearchBar.js" key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id16-react/src/components/SearchBar.js" className="md:col-span-2 grid">
          <label data-easytag="id17-react/src/components/SearchBar.js" className="text-xs text-muted">Город</label>
          <select data-easytag="id18-react/src/components/SearchBar.js" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3 py-2 border border-border rounded-md">
            <option data-easytag="id19-react/src/components/SearchBar.js" value="">Любой</option>
            {cities.map((c) => (
              <option data-easytag="id20-react/src/components/SearchBar.js" key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div data-easytag="id21-react/src/components/SearchBar.js" className="md:col-span-1 grid">
          <label data-easytag="id22-react/src/components/SearchBar.js" className="text-xs text-muted">Цена от</label>
          <input data-easytag="id23-react/src/components/SearchBar.js" type="number" inputMode="decimal" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} className="px-3 py-2 border border-border rounded-md" placeholder="от" />
        </div>
        <div data-easytag="id24-react/src/components/SearchBar.js" className="md:col-span-1 grid">
          <label data-easytag="id25-react/src/components/SearchBar.js" className="text-xs text-muted">Цена до</label>
          <input data-easytag="id26-react/src/components/SearchBar.js" type="number" inputMode="decimal" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} className="px-3 py-2 border border-border rounded-md" placeholder="до" />
        </div>
      </div>
      <div data-easytag="id27-react/src/components/SearchBar.js" className="flex items-end">
        <button data-easytag="id28-react/src/components/SearchBar.js" type="submit" className="w-full md:w-auto px-5 py-2.5 rounded-md bg-accent text-white">Найти</button>
      </div>
    </form>
  );
};

export default SearchBar;
