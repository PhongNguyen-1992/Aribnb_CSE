import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Users, 
  Wifi, 
  Tv, 
  AirVent, 
  Waves, 
  Car, 
  UtensilsCrossed, 
  WashingMachine, 
  Shirt,
  Wind
} from 'lucide-react';
import { roomApi } from '../../service/detail.api';
import type { Room } from '../../interfaces/detail.interface';
import AppHeaderInto from '../../Component/hearderinto';
import Footer from '../../Component/footer';


const RoomDetail = () => {

  const { id, tenViTri } = useParams<{ id: string; tenViTri: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await roomApi.getRoomById(Number(id));
          setRoom(data);
        }
      } catch (err) {
        setError('Không thể tải thông tin phòng');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error || 'Không tìm thấy phòng'}</div>
      </div>
    );
  }

  const amenities = [
    { icon: Users, label: `${room.khach} khách`, value: room.khach, show: true },
    { icon: Bed, label: `${room.phongNgu} phòng ngủ`, value: room.phongNgu, show: true },
    { icon: Bed, label: `${room.giuong} giường`, value: room.giuong, show: true },
    { icon: Bath, label: `${room.phongTam} phòng tắm`, value: room.phongTam, show: true },
    { icon: Wifi, label: 'Wifi', value: room.wifi, show: room.wifi },
    { icon: Tv, label: 'Tivi', value: room.tivi, show: room.tivi },
    { icon: AirVent, label: 'Điều hòa', value: room.dieuHoa, show: room.dieuHoa },
    { icon: UtensilsCrossed, label: 'Bếp', value: room.bep, show: room.bep },
    { icon: WashingMachine, label: 'Máy giặt', value: room.mayGiat, show: room.mayGiat },
    { icon: Shirt, label: 'Bàn là', value: room.banLa, show: room.banLa },
    { icon: Wind, label: 'Bàn ủi', value: room.banUi, show: room.banUi },
    { icon: Car, label: 'Đỗ xe', value: room.doXe, show: room.doXe },
    { icon: Waves, label: 'Hồ bơi', value: room.hoBoi, show: room.hoBoi },
  ];

  return (
    <div className='space-y-8'>
    <div className="container mx-auto px-4 py-8 max-w-6xl mb-8">
      {/* Header */}
      <div className='m-4'>
      <AppHeaderInto/>
      </div>
      <div className="m-6">
        <h1 className="text-3xl font-bold mb-2">{room.tenPhong}</h1>
        <p className="text-gray-600">{tenViTri || `Mã vị trí: ${room.maViTri}`}</p>
      </div>

      {/* Image */}
      {room.hinhAnh && (
        <div className="mb-8">
          <img
            src={room.hinhAnh}
            alt={room.tenPhong}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Room+Image';
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Room Info */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{room.khach} khách</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed size={20} />
                <span>{room.phongNgu} phòng ngủ</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} />
                <span>{room.phongTam} phòng tắm</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
            <p className="text-gray-700 leading-relaxed">{room.moTa}</p>
          </div>

          {/* Amenities */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Tiện nghi</h2>
            <div className="grid grid-cols-2 gap-4">
              {amenities.filter(a => a.show).map((amenity, index) => {
                const Icon = amenity.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon size={24} className="text-gray-700" />
                    <span className="text-gray-700">{amenity.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow-lg p-6 sticky top-4">
            <div className="mb-4">
              <div className="text-3xl font-bold">
                ${room.giaTien.toLocaleString()}
                <span className="text-base font-normal text-gray-600"> / đêm</span>
              </div>
            </div>
            
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200">
              Đặt phòng
            </button>

            <div className="mt-6 text-center text-sm text-gray-500 italic tracking-wide">
  Giá dự tính <span className="font-medium text-gray-700">5 đêm</span> tại đây 
  <br className="hidden sm:block" />
  <span className="text-gray-400">(Chưa gồm phí phát sinh & thuế)</span>
</div>


            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">${room.giaTien} x 5 đêm</span>
                <span className="text-gray-700">${(room.giaTien * 5).toLocaleString()}</span>
              </div>              
              <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                <span>Tổng</span>
                <span>${(room.giaTien * 5).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
    
  );
};

export default RoomDetail;