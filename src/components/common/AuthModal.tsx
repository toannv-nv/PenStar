import { useState } from 'react';

type Props = {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  initialMode?: 'login' | 'register';
};

const USERS_KEY = 'penstar_users';
const CURRENT_USER_KEY = 'penstar_current_user';

const readUsers = (): { email: string; password: string }[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: { email: string; password: string }[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const AuthModal = ({ onClose, onLoginSuccess, initialMode = 'login' }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleRegister = () => {
    setError(null);
    if (!email.trim() || !isValidEmail(email)) return setError('Vui lòng nhập email hợp lệ');
    if (password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự');

    const users = readUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return setError('Email đã được đăng ký');
    }

    users.push({ email, password });
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, email);
    onLoginSuccess(email);
    onClose();
  };

  const handleLogin = () => {
    setError(null);
    if (!email.trim() || !isValidEmail(email)) return setError('Vui lòng nhập email hợp lệ');
    if (!password) return setError('Vui lòng nhập mật khẩu');

    const users = readUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return setError('Email hoặc mật khẩu không đúng');

    localStorage.setItem(CURRENT_USER_KEY, email);
    onLoginSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 z-60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h3>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Email (Gmail)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="you@gmail.com" />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Mật khẩu" />
        </div>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="flex gap-3">
          {mode === 'login' ? (
            <>
              <button onClick={handleLogin} className="flex-1 bg-blue-600 text-white py-2 rounded">Tiếp tục</button>
              <button onClick={() => { setMode('register'); setError(null); }} className="flex-1 border rounded py-2">Đăng ký</button>
            </>
          ) : (
            <>
              <button onClick={handleRegister} className="flex-1 bg-orange-500 text-white py-2 rounded">Đăng ký</button>
              <button onClick={() => { setMode('login'); setError(null); }} className="flex-1 border rounded py-2">Đã có tài khoản</button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-3">Bằng cách tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật của chúng tôi.</div>
      </div>
    </div>
  );
};

export default AuthModal;
