import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from '@/components/common/AuthModal';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // expected state: { hotelId, roomTypeId, price, hotelName, roomTypeName }
  const state = (location.state || {}) as any;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touchedFullName, setTouchedFullName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  // validation helpers
  const isValidEmail = (v: string) => {
    if (!v) return false;
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  const isValidPhone = (v: string) => {
    if (!v) return false;
    // allow only digits, and length between 9 and 12
    return /^\d{9,12}$/.test(v);
  };

  const isFormValid = !!(fullName.trim() && isValidEmail(email) && isValidPhone(phone));

  const price = state.price || 0;
  const tax = Math.round(price * 0.13);
  const total = price + tax;

  const handleContinue = () => {
    setTouchedFullName(true);
    setTouchedEmail(true);
    setTouchedPhone(true);
    setSubmittedAttempt(true);

    // Validate before navigating
    if (!isFormValid) return;
    const payload = { ...state, fullName, email, phone, total };
    const current = localStorage.getItem('penstar_current_user');
    if (!current) {
      try { localStorage.setItem('penstar_pending_booking', JSON.stringify(payload)); } catch {}
      // prompt auth modal
      setShowAuthModal(true);
      setAuthNotice('Bạn cần đăng nhập để tiếp tục thanh toán.');
      return;
    }

    // navigate to confirmation
    navigate('/booking/confirm', { state: payload });
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const handleAuthSuccess = () => {
    // after login, if there is a pending booking, navigate to confirm
    try {
      const raw = localStorage.getItem('penstar_pending_booking');
      if (raw) {
        const payload = JSON.parse(raw);
        localStorage.removeItem('penstar_pending_booking');
        navigate('/booking/confirm', { state: payload });
        return;
      }
    } catch (e) {
      // ignore
    }
    // otherwise just close modal
    setShowAuthModal(false);
    setAuthNotice(null);
    // reload to update header / UI
    setTimeout(() => window.location.reload(), 80);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Đặt phòng của bạn</h2>

      {authNotice && <div className="mb-4 text-sm text-red-600">{authNotice}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold mb-3">Thông tin liên hệ (đối với E-voucher)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tên đầy đủ</label>
                <input
                  value={fullName}
                  onChange={(e)=>{ setFullName(e.target.value); setTouchedFullName(true); }}
                  className="w-full border rounded px-3 py-2"
                  placeholder="ví dụ: A"
                  aria-invalid={!!(submittedAttempt && !fullName.trim())}
                />
                {touchedFullName && !fullName.trim() ? (
                  <div className="text-sm text-red-600 mt-1">Vui lòng nhập tên đầy đủ</div>
                ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">E-mail</label>
                  <input
                    value={email}
                    onChange={(e)=>{ setEmail(e.target.value); setTouchedEmail(true); }}
                    className="w-full border rounded px-3 py-2"
                    placeholder="ví dụ: email@example.com"
                    aria-invalid={!!(submittedAttempt && !isValidEmail(email))}
                  />
                  {touchedEmail && !email.trim() ? (
                    <div className="text-sm text-red-600 mt-1">Vui lòng nhập email</div>
                  ) : touchedEmail && !isValidEmail(email) ? (
                    <div className="text-sm text-red-600 mt-1">Email không hợp lệ</div>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    value={phone}
                    onChange={(e)=>{ setPhone(e.target.value); setTouchedPhone(true); }}
                    className="w-full border rounded px-3 py-2"
                    placeholder="ví dụ: 0123456789"
                    aria-invalid={!!(submittedAttempt && !isValidPhone(phone))}
                  />
                  {touchedPhone && !phone.trim() ? (
                    <div className="text-sm text-red-600 mt-1">Vui lòng nhập số điện thoại</div>
                  ) : touchedPhone && !isValidPhone(phone) ? (
                    <div className="text-sm text-red-600 mt-1">Số điện thoại không hợp lệ (chỉ gồm chữ số, 9-12 ký tự)</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center"><input type="radio" name="who" className="mr-2" defaultChecked/> Tôi là khách lưu trú</label>
                <label className="inline-flex items-center ml-6"><input type="radio" name="who" className="mr-2" /> Tôi đang đặt cho người khác</label>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Chi tiết giá</h3>
          <div className="text-sm text-gray-600 mb-2">Giá phòng</div>
          <div className="text-lg font-semibold mb-4">{price.toLocaleString()} VND</div>
          <div className="flex justify-between text-sm text-gray-600 mb-2"><div>Thuế và phí</div><div>{tax.toLocaleString()} VND</div></div>
          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <div className="text-lg font-bold">Tổng giá</div>
            <div className="text-xl text-orange-500 font-bold">{total.toLocaleString()} VND</div>
          </div>

          <button onClick={handleContinue} className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg">Tiếp tục thanh toán</button>
        </aside>
      </div>

      {showAuthModal && (
        <AuthModal initialMode="login" onClose={() => setShowAuthModal(false)} onLoginSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default Booking;
