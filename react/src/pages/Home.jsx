import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const goSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div data-easytag="id1-react/src/pages/Home.jsx" className="grid gap-8">
      <section data-easytag="id2-react/src/pages/Home.jsx" className="rounded-2xl bg-white border border-border p-8 shadow-soft">
        <div data-easytag="id3-react/src/pages/Home.jsx" className="max-w-3xl">
          <h1 data-easytag="id4-react/src/pages/Home.jsx" className="text-3xl sm:text-4xl font-bold leading-tight mb-3">Найдите свой автомобиль</h1>
          <p data-easytag="id5-react/src/pages/Home.jsx" className="text-muted mb-6">Минималистичная доска объявлений: поиск, фильтрация, добавление и управление объявлениями.</p>
          <form data-easytag="id6-react/src/pages/Home.jsx" onSubmit={goSearch} className="flex gap-2">
            <input data-easytag="id7-react/src/pages/Home.jsx" type="text" className="h-12 flex-1 rounded-lg border border-border px-4" placeholder="Марка, модель или ключевое слово" value={q} onChange={(e) => setQ(e.target.value)} />
            <button data-easytag="id8-react/src/pages/Home.jsx" type="submit" className="h-12 px-5 rounded-lg bg-accent text-white">Искать</button>
          </form>
        </div>
      </section>
      <section data-easytag="id9-react/src/pages/Home.jsx" className="rounded-2xl bg-white border border-border p-8">
        <div data-easytag="id10-react/src/pages/Home.jsx" className="h-40 w-full rounded-lg bg-surface border border-border"></div>
      </section>
    </div>
  );
};

export default Home;
