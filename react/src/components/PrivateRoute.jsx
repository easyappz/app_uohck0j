import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = useMemo(() => Boolean(localStorage.getItem('token')), [location.pathname]);
  const [show, setShow] = useState(!authed);
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authed) return children;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.login, form.password);
      if (res?.access) {
        localStorage.setItem('token', res.access);
        setShow(false);
        navigate(location.pathname, { replace: true });
      }
    } catch (err) {
      setError('Неверные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-react/src/components/PrivateRoute.jsx" className="relative">
      <div data-easytag="id2-react/src/components/PrivateRoute.jsx">{children}</div>
      {show && (
        <div data-easytag="id3-react/src/components/PrivateRoute.jsx" className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form data-easytag="id4-react/src/components/PrivateRoute.jsx" onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-5 shadow-soft">
            <h3 data-easytag="id5-react/src/components/PrivateRoute.jsx" className="text-lg font-semibold mb-3">Требуется авторизация</h3>
            <div data-easytag="id6-react/src/components/PrivateRoute.jsx" className="flex flex-col gap-2">
              <label data-easytag="id7-react/src/components/PrivateRoute.jsx" className="text-xs text-muted">Логин или email</label>
              <input data-easytag="id8-react/src/components/PrivateRoute.jsx" type="text" className="h-10 rounded-lg border border-border px-3" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} />
              <label data-easytag="id9-react/src/components/PrivateRoute.jsx" className="text-xs text-muted">Пароль</label>
              <input data-easytag="id10-react/src/components/PrivateRoute.jsx" type="password" className="h-10 rounded-lg border border-border px-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {error ? <div data-easytag="id11-react/src/components/PrivateRoute.jsx" className="text-sm text-red-600 mt-2">{error}</div> : null}
            <div data-easytag="id12-react/src/components/PrivateRoute.jsx" className="mt-4 flex items-center gap-2">
              <button data-easytag="id13-react/src/components/PrivateRoute.jsx" type="submit" className="h-10 px-4 rounded-lg bg-accent text-white" disabled={loading}>{loading ? 'Входим…' : 'Войти'}</button>
              <button data-easytag="id14-react/src/components/PrivateRoute.jsx" type="button" className="h-10 px-4 rounded-lg border border-border" onClick={() => setShow(false)}>Закрыть</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrivateRoute;
