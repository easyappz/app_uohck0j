import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, login, register, authError, setAuthError } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onLoginSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(loginForm);
      setShowLogin(false);
    } catch (e) {
      setAuthError('Не удалось войти. Проверьте данные.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegisterSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(registerForm);
      setShowRegister(false);
    } catch (e) {
      setAuthError('Не удалось зарегистрироваться.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-easytag="id1-react/src/components/Header.js" className="max-w-6xl mx-auto px-4">
      <div data-easytag="id2-react/src/components/Header.js" className="h-16 flex items-center justify-between gap-4">
        <div data-easytag="id3-react/src/components/Header.js" className="flex items-center gap-6">
          <Link data-easytag="id4-react/src/components/Header.js" to="/" className="font-semibold text-lg text-text">Easyappz Авто</Link>
          <nav data-easytag="id5-react/src/components/Header.js" className="hidden md:flex items-center gap-4 text-sm text-muted">
            <Link data-easytag="id6-react/src/components/Header.js" to="/catalog" className="hover:text-text">Каталог</Link>
            <Link data-easytag="id7-react/src/components/Header.js" to="/add" className="hover:text-text">Добавить объявление</Link>
          </nav>
        </div>

        <div data-easytag="id8-react/src/components/Header.js" className="flex items-center gap-2">
          {!user && (
            <>
              <button data-easytag="id9-react/src/components/Header.js" onClick={() => { setShowLogin(true); setShowRegister(false); }} className="px-3 py-2 rounded-md border border-border hover:border-text text-sm">Войти</button>
              <button data-easytag="id10-react/src/components/Header.js" onClick={() => { setShowRegister(true); setShowLogin(false); }} className="px-3 py-2 rounded-md bg-accent text-white text-sm">Регистрация</button>
            </>
          )}
          {user && (
            <div data-easytag="id11-react/src/components/Header.js" className="flex items-center gap-2">
              <span data-easytag="id12-react/src/components/Header.js" className="text-sm text-muted">{user.username}</span>
              <button data-easytag="id13-react/src/components/Header.js" onClick={() => navigate('/profile')} className="px-3 py-2 rounded-md border border-border text-sm hover:border-text">Личный кабинет</button>
              <button data-easytag="id14-react/src/components/Header.js" onClick={logout} className="px-3 py-2 rounded-md text-sm border border-border hover:border-text">Выйти</button>
            </div>
          )}
        </div>
      </div>

      {(showLogin || showRegister) && (
        <div data-easytag="id15-react/src/components/Header.js" className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div data-easytag="id16-react/src/components/Header.js" className="w-full max-w-md bg-white rounded-lg shadow-soft p-6">
            <div data-easytag="id17-react/src/components/Header.js" className="flex items-center justify-between mb-4">
              <h3 data-easytag="id18-react/src/components/Header.js" className="text-lg font-semibold">{showLogin ? 'Вход' : 'Регистрация'}</h3>
              <button data-easytag="id19-react/src/components/Header.js" onClick={() => { setShowLogin(false); setShowRegister(false); }} className="text-muted hover:text-text">✕</button>
            </div>
            {authError && <div data-easytag="id20-react/src/components/Header.js" className="mb-3 text-red-600 text-sm">{authError}</div>}

            {showLogin && (
              <form data-easytag="id21-react/src/components/Header.js" onSubmit={onLoginSubmit} className="space-y-3">
                <div data-easytag="id22-react/src/components/Header.js" className="grid gap-1">
                  <label data-easytag="id23-react/src/components/Header.js" className="text-sm text-muted">Логин или email</label>
                  <input data-easytag="id24-react/src/components/Header.js" value={loginForm.login} onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })} className="px-3 py-2 border border-border rounded-md outline-none focus:border-text" placeholder="username или email" />
                </div>
                <div data-easytag="id25-react/src/components/Header.js" className="grid gap-1">
                  <label data-easytag="id26-react/src/components/Header.js" className="text-sm text-muted">Пароль</label>
                  <input data-easytag="id27-react/src/components/Header.js" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="px-3 py-2 border border-border rounded-md outline-none focus:border-text" placeholder="••••••" />
                </div>
                <button data-easytag="id28-react/src/components/Header.js" type="submit" disabled={submitting} className="w-full px-4 py-2 rounded-md bg-accent text-white hover:opacity-90 disabled:opacity-60">Войти</button>
              </form>
            )}

            {showRegister && (
              <form data-easytag="id29-react/src/components/Header.js" onSubmit={onRegisterSubmit} className="space-y-3">
                <div data-easytag="id30-react/src/components/Header.js" className="grid gap-1">
                  <label data-easytag="id31-react/src/components/Header.js" className="text-sm text-muted">Имя пользователя</label>
                  <input data-easytag="id32-react/src/components/Header.js" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} className="px-3 py-2 border border-border rounded-md outline-none focus:border-text" placeholder="username" />
                </div>
                <div data-easytag="id33-react/src/components/Header.js" className="grid gap-1">
                  <label data-easytag="id34-react/src/components/Header.js" className="text-sm text-muted">Email</label>
                  <input data-easytag="id35-react/src/components/Header.js" type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="px-3 py-2 border border-border rounded-md outline-none focus:border-text" placeholder="you@example.com" />
                </div>
                <div data-easytag="id36-react/src/components/Header.js" className="grid gap-1">
                  <label data-easytag="id37-react/src/components/Header.js" className="text-sm text-muted">Пароль</label>
                  <input data-easytag="id38-react/src/components/Header.js" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="px-3 py-2 border border-border rounded-md outline-none focus:border-text" placeholder="минимум 6 символов" />
                </div>
                <button data-easytag="id39-react/src/components/Header.js" type="submit" disabled={submitting} className="w-full px-4 py-2 rounded-md bg-accent text-white hover:opacity-90 disabled:opacity-60">Зарегистрироваться</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
