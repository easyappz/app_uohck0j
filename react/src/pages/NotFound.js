import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div data-easytag="id1-react/src/pages/NotFound.js" className="min-h-[60vh] flex items-center justify-center">
      <div data-easytag="id2-react/src/pages/NotFound.js" className="text-center">
        <h1 data-easytag="id3-react/src/pages/NotFound.js" className="text-3xl font-semibold mb-2">404 — Страница не найдена</h1>
        <p data-easytag="id4-react/src/pages/NotFound.js" className="text-muted mb-6">Такой страницы не существует</p>
        <Link data-easytag="id5-react/src/pages/NotFound.js" to="/" className="px-5 py-2 rounded-md bg-accent text-white">На главную</Link>
      </div>
    </div>
  );
};

export default NotFound;
