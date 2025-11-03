import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div data-easytag="id1-react/src/components/Layout.jsx" className="flex min-h-screen flex-col text-slate-900">
      <header data-easytag="id2-react/src/components/Layout.jsx" className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
        <Header />
      </header>
      <main data-easytag="id3-react/src/components/Layout.jsx" className="container mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer data-easytag="id4-react/src/components/Layout.jsx" className="border-t border-border bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
