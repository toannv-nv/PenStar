import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataHotel } from '@/mock/dataHotel';
import { useState } from 'react';
import AuthModal from '@/components/common/AuthModal';

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = dataHotel.find((h: any) => h._id === id);

  if (!hotel) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold">Khách sạn không tồn tại</h2>
        <Link to="/hotels" className="text-blue-600 underline">Quay về danh sách</Link>
      </div>
    );
  }

  // helper: format price
  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p);

  // modal state for room detail
  const [modalRoom, setModalRoom] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [lastAttemptedBooking, setLastAttemptedBooking] = useState<any | null>(null);
  const navigate = useNavigate();

  return (
    <>
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Những phòng còn trống tại {hotel.hotelName}</h2>

      {authNotice && (
        <div className="mb-4 text-sm text-red-600">{authNotice}</div>
      )}

      <div className="mb-6">
       
      </div>

      {/* Filters removed as requested */}

      {/* Room list */}
      <div className="space-y-6">
        {hotel.roomTypes?.map((room: any) => (
          <div key={room._id} className="bg-white rounded-lg shadow p-4 flex flex-col lg:flex-row gap-4">
            {/* Left image & brief */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="relative">
                <img src={hotel.hotelImages?.[0] || '/placeholder-hotel.jpg'} alt={room.typeName} className="w-full h-48 object-cover rounded-lg" />
                <div className="absolute -bottom-4 left-4 bg-white rounded-lg shadow px-3 py-2 text-sm">25.0 m²</div>
              </div>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div>Vòi tắm đứng</div>
                  <div>Máy lạnh</div>
      <button onClick={() => { setModalRoom({ room, images: hotel.hotelImages || [], hotelId: hotel._id, hotelName: hotel.hotelName }); }} className="text-blue-600 underline inline-block mt-2">Xem chi tiết phòng</button>
                </div>
            </div>

            {/* Right - options table */}
            <div className="flex-1">
              <div className="bg-gray-50 rounded-t-lg border-b p-3 font-semibold">Lựa chọn phòng</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="py-3 px-4 w-1/2">Lựa chọn phòng</th>
                      <th className="py-3 px-4 w-1/6">Khách</th>
                      <th className="py-3 px-4 w-1/6">Giá/phòng/đêm</th>
                      <th className="py-3 px-4 w-1/6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* For demo show 2 rate rows per room type */}
                    {[0,1,2].map((_,i) => (
                      <tr key={i} className="border-t">
                        <td className="py-4 px-4 align-top">
                          <div className="text-sm font-semibold">{room.typeName} - Best Available Rate</div>
                          <div className="text-sm text-gray-700 mt-2">Không bao gồm bữa sáng</div>
                          <ul className="text-xs text-gray-500 mt-2 space-y-1">
                            <li>1 giường đôi</li>
                            <li>Miễn phí hủy phòng trước 30 thg 10 12:59</li>
                          </ul>
                        </td>
                        <td className="py-4 px-4 align-top text-gray-700">👥 {room.maxOccupancy}</td>
                        <td className="py-4 px-4 align-top">
                          <div className="text-sm text-gray-400 line-through">{formatPrice(room.basePrice)} VND</div>
                          <div className="text-lg text-orange-500 font-bold">{formatPrice(room.finalPrice)} VND</div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <button onClick={() => {
                              const payload = { hotelId: hotel._id, roomTypeId: room._id, price: room.finalPrice || room.basePrice || 0, hotelName: hotel.hotelName, roomTypeName: room.typeName };
                              const current = localStorage.getItem('penstar_current_user');
                              if (!current) {
                                // store pending booking and prompt auth
                                setLastAttemptedBooking(payload);
                                try { localStorage.setItem('penstar_pending_booking', JSON.stringify(payload)); } catch {}
                                setAuthNotice('Bạn chưa đăng nhập. Vui lòng đăng nhập hoặc đăng ký để đặt phòng.');
                                setAuthMode('login');
                                setShowAuthModal(true);
                                return;
                              }
                              navigate('/booking', { state: payload });
                            }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Chọn</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Các lựa chọn phổ biến khác */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-2">Các lựa chọn phổ biến khác</h3>
        <p className="text-gray-500 mb-4">Dưới đây là một số khách sạn tương tự với khoảng giá và khu vực giống như khách sạn bạn đang xem.</p>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {dataHotel.filter((h:any) => h._id !== hotel._id).slice(0,4).map((h:any) => {
              const minPrice = h.roomTypes && h.roomTypes.length ? Math.min(...h.roomTypes.map((r:any)=> r.finalPrice || r.basePrice || 0)) : 0;
              return (
                <div key={h._id} className="bg-white rounded-lg shadow-lg w-64 flex-shrink-0">
                  <Link to={`/hotels/${h._id}`} className="block">
                    <img src={h.hotelImages?.[0] || '/placeholder-hotel.jpg'} alt={h.hotelName} className="w-full h-36 object-cover rounded-t-lg" />
                    <div className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-2">{h.hotelName}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <div className="text-yellow-400">{'★'.repeat(Math.max(0, Math.round(h.starRating || 0)))}</div>
                        <div className="text-blue-600 font-semibold">{h.averageRating ? h.averageRating.toFixed(1) : '—'}</div>
                        <div className="text-gray-400">({h.totalReviews || 0})</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{h.location?.locationName}</div>

                      <div className="mt-3 border-t pt-3 flex items-end justify-between">
                        <div className="text-sm text-gray-500">Chưa bao gồm thuế và phí</div>
                        <div className="text-right">
                          <div className="text-xs line-through text-gray-400">{minPrice ? (minPrice + 100000).toLocaleString() : ''} VND</div>
                          <div className="text-lg text-orange-500 font-bold">{minPrice ? minPrice.toLocaleString() : 'Liên hệ'} VND</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <Link to={`/hotels?location=${encodeURIComponent(hotel.location?.locationName || '')}`} className="inline-flex items-center gap-2 text-blue-600 font-medium">
              Xem cơ sở lưu trú khác tại {hotel.location?.locationName} ({dataHotel.filter((h:any)=>h.location?.locationName === hotel.location?.locationName).length})
              <span className="ml-1">›</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    {/* Room detail modal */}
    <RoomDetailModalWrapper modalRoom={modalRoom} onClose={() => setModalRoom(null)} onRequireAuth={() => { setAuthMode('login'); setShowAuthModal(true); setAuthNotice('Bạn chưa đăng nhập. Vui lòng đăng nhập hoặc đăng ký để đặt phòng.'); }} />

    {/* Auth modal */}
    {showAuthModal && (
      <AuthModal initialMode={authMode} onClose={() => setShowAuthModal(false)} onLoginSuccess={() => {
        setShowAuthModal(false);
        setAuthNotice(null);
        // if there is a pending booking it will be handled by header; otherwise reload to update UI
        setTimeout(() => window.location.reload(), 80);
      }} />
    )}
    </>
  );
};

// --- Room detail modal component ---
type ModalRoom = { room: any; images: string[]; hotelId?: string; hotelName?: string } | null;

const RoomDetailModalWrapper = ({ modalRoom, onClose, onRequireAuth }: { modalRoom: ModalRoom; onClose: () => void; onRequireAuth?: () => void }) => {
  if (!modalRoom) return null;
  const { room, images, hotelId, hotelName } = modalRoom;

  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const prev = () => setIndex(i => (i <= 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-[90%] max-w-5xl rounded-lg shadow-lg overflow-hidden z-60">
        <div className="flex">
          {/* Left - images */}
          <div className="w-2/3 bg-gray-100 p-4">
            <div className="relative">
              <h3 className="text-lg font-semibold mb-2">{room.typeName}</h3>
              <img src={images[index] || '/placeholder-hotel.jpg'} alt={room.typeName} className="w-full h-72 object-cover rounded-md" />
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow">‹</button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow">›</button>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`rounded-md overflow-hidden border ${i === index ? 'ring-2 ring-blue-500' : ''}`}>
                  <img src={img} alt={`thumb-${i}`} className="w-20 h-14 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right - info */}
          <div className="w-1/3 p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold mb-2">Thông tin phòng</h4>
              <div className="text-sm text-gray-600 mb-2">📐 {room.size || '25.0 m²'}</div>
              <div className="text-sm text-gray-600 mb-2">👥 {room.maxOccupancy || 2} khách</div>

              <div className="mt-4">
                <h5 className="font-medium mb-1">Về phòng này</h5>
                <div className="text-sm text-gray-700">{room.bedType || '1 queen bed'}</div>
              </div>
            </div>

            <div>
              <div className="border-t pt-3">
                <div className="text-xs text-gray-500">Khởi điểm từ:</div>
                <div className="text-xl text-orange-500 font-bold">{room.finalPrice ? room.finalPrice.toLocaleString() : 'Liên hệ'} VND / phòng / đêm</div>
                <button onClick={() => {
                    const price = room.finalPrice || room.basePrice || 0;
                    const current = localStorage.getItem('penstar_current_user');
                    if (!current) {
                      if (onRequireAuth) onRequireAuth();
                      return;
                    }
                    navigate('/booking', { state: { hotelId: hotelId, roomTypeId: room._id, price, hotelName: hotelName, roomTypeName: room.typeName } });
                  }} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg">Thêm lựa chọn phòng</button>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600">✕</button>
      </div>
    </div>
  );
};

export default HotelDetail;
