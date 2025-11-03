import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div data-easytag="id1-react/src/components/Layout.js" className="min-h-screen flex flex-col bg-surface">
      <header data-easytag="id2-react/src/components/Layout.js" className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
        <Header />
      </header>
      <main data-easytag="id3-react/src/components/Layout.js" className="flex-1">
        {children}
      </main>
      <footer data-easytag="id4-react/src/components/Layout.js" className="border-t border-border text-sm text-muted py-8">
        <div data-easytag="id5-react/src/components/Layout.js" className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div data-easytag="id6-react/src/components/Layout.js">© {new Date().getFullYear()} Easyappz Авто</div>
          <nav data-easytag="id7-react/src/components/Layout.js" className="flex gap-4">
            <a data-easytag="id8-react/src/components/Layout.js" href="/" className="hover:text-text">Главная</a>
            <a data-easytag="id9-react/src/components/Layout.js" href="/catalog" className="hover:text-text">Каталог</a>
            <a data-easytag="id10-react/src/components/Layout.js" href="/add" className="hover:text-text">Добавить объявление</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
