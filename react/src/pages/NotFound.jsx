import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div data-easytag="id1-react/src/pages/NotFound.jsx" className="text-center py-16">
      <div data-easytag="id2-react/src/pages/NotFound.jsx" className="text-7xl font-bold mb-2">404</div>
      <div data-easytag="id3-react/src/pages/NotFound.jsx" className="text-muted mb-6">Страница не найдена</div>
      <Link data-easytag="id4-react/src/pages/NotFound.jsx" to="/" className="inline-block h-11 px-5 rounded-lg bg-accent text-white">На главную</Link>
    </div>
  );
};

export default NotFound;
