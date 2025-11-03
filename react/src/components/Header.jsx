import React, { useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAuthed = useMemo(() => Boolean(localStorage.getItem('token')), [location.pathname]);

  return (
    <div data-easytag="id1-react/src/components/Header.jsx" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      <div data-easytag="id2-react/src/components/Header.jsx" className="flex items-center gap-3">
        <Link data-easytag="id3-react/src/components/Header.jsx" to="/" className="inline-flex items-center gap-2">
          <span data-easytag="id4-react/src/components/Header.jsx" className="h-8 w-8 rounded-lg bg-accent/15 inline-flex items-center justify-center text-accent font-bold">C</span>
          <span data-easytag="id5-react/src/components/Header.jsx" className="font-semibold text-lg">Easyappz Cars</span>
        </Link>
      </div>
      <nav data-easytag="id6-react/src/components/Header.jsx" className="hidden md:flex items-center gap-6 text-sm">
        <NavLink data-easytag="id7-react/src/components/Header.jsx" to="/catalog" className={({ isActive }) => `hover:text-accent ${isActive ? 'text-accent' : ''}`}>Каталог</NavLink>
        <NavLink data-easytag="id8-react/src/components/Header.jsx" to="/add" className={({ isActive }) => `hover:text-accent ${isActive ? 'text-accent' : ''}`}>Добавить объявление</NavLink>
        <NavLink data-easytag="id9-react/src/components/Header.jsx" to="/profile" className={({ isActive }) => `hover:text-accent ${isActive ? 'text-accent' : ''}`}>Личный кабинет</NavLink>
      </nav>
      <div data-easytag="id10-react/src/components/Header.jsx" className="flex items-center gap-3">
        {isAuthed ? (
          <span data-easytag="id11-react/src/components/Header.jsx" className="text-sm text-muted">Вы вошли</span>
        ) : (
          <span data-easytag="id12-react/src/components/Header.jsx" className="text-sm text-muted">Гость</span>
        )}
      </div>
    </div>
  );
};

export default Header;
