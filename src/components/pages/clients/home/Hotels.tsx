import { Link } from 'react-router-dom';
import { dataHotel } from '@/mock/dataHotel';

const Hotels = () => {
  const hotels = dataHotel;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Danh sách khách sạn</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: any) => (
            <div key={hotel._id} className="bg-white rounded-lg shadow p-4">
              <Link to={`/hotels/${hotel._id}`} className="block hover:opacity-90">
                <img src={hotel.hotelImages?.[0] || '/placeholder-hotel.jpg'} alt={hotel.hotelName} className="w-full h-40 object-cover rounded-md mb-3" />
                <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
                <p className="text-sm text-gray-500">{hotel.location?.locationName}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hotels;
