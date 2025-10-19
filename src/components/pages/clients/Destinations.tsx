import { Link } from 'react-router-dom';
import { dataHotel } from '@/mock/dataHotel';

const Destinations = () => {
  // derive unique locations from dataHotel
  const groups: { name: string; hotels: any[] }[] = [];
  const map: Record<string, any[]> = {};
  dataHotel.forEach((h:any) => {
    const name = h.location?.locationName || 'Khác';
    map[name] = map[name] || [];
    map[name].push(h);
  });
  for (const k of Object.keys(map)) groups.push({ name: k, hotels: map[k].slice(0,6) });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Các địa điểm du lịch</h2>

      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex gap-4 items-center">
          <input className="flex-1 border rounded px-4 py-3" placeholder="Thành phố, địa điểm hoặc tên khách sạn" />
          <button className="bg-orange-500 text-white px-6 py-3 rounded">Tìm kiếm</button>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto">
          {['Khách sạn', 'Vé máy bay', 'Tour', 'Trải nghiệm', 'Phương tiện'].map((t,i) => (
            <div key={i} className="flex-shrink-0 px-4 py-2 border rounded-full text-sm">{t}</div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {groups.map(g => (
          <div key={g.name}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">{g.name}</h3>
              <Link to={`/hotels?location=${encodeURIComponent(g.name)}`} className="text-blue-600">Xem tất cả</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {g.hotels.map(h => (
                <Link key={h._id} to={`/hotels/${h._id}`} className="block bg-white rounded-lg shadow overflow-hidden">
                  <img src={h.hotelImages?.[0] || '/placeholder-hotel.jpg'} alt={h.hotelName} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <div className="font-semibold text-sm line-clamp-2">{h.hotelName}</div>
                    <div className="text-xs text-gray-500 mt-1">{h.location?.locationName}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
