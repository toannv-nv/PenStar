import { useLocation, Link } from 'react-router-dom';

const BookingConfirm = () => {
  const { state } = useLocation() as any;

  // generate a mock booking reference if none provided
  const bookingRef = state?.bookingRef || `BK-${Math.random().toString(36).slice(2,9).toUpperCase()}`;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold">Xác nhận đặt phòng</h1>
              <p className="text-sm text-gray-600">Cảm ơn {state?.fullName || 'khách hàng'}, yêu cầu đặt phòng của bạn đã được ghi nhận.</p>
            </div>
          </div>

          <div className="mt-6 border rounded-md p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Khách sạn</div>
                <div className="font-medium">{state?.hotelName || 'N/A'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Phòng</div>
                <div className="font-medium">{state?.roomTypeName || 'N/A'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Mã đặt chỗ</div>
                <div className="font-medium">{bookingRef}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Tổng</div>
                <div className="font-bold text-orange-500">{(state?.total || state?.price || 0).toLocaleString()} VND</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link to="/" className="text-blue-600 underline">Quay về trang chủ</Link>
            <Link to="/booking" className="bg-blue-600 text-white px-4 py-2 rounded">Quay lại</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
