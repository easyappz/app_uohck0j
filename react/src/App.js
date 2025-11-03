import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AdPage from './pages/AdPage';
import Profile from './pages/Profile';
import AddAd from './pages/AddAd';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  useEffect(() => {
    const routes = ['/', '/catalog', '/ad/:id', '/profile', '/add', '/404'];
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(routes);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div data-easytag="id1-react/src/App.js" className="min-h-screen bg-surface">
        <BrowserRouter>
          <div data-easytag="id2-react/src/App.js">
            <Layout>
              <div data-easytag="id3-react/src/App.js">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/ad/:id" element={<AdPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/add" element={<PrivateRoute><AddAd /></PrivateRoute>} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </div>
            </Layout>
          </div>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
};

export default App;
