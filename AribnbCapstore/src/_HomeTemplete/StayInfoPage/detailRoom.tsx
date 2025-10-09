import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Wind,
  MapPin,
  Star,
  Check,
  Sparkles,
} from "lucide-react";
import { Card, Button, Tag, Divider, Spin, Alert,Modal } from "antd";
import { roomApi } from "../../service/AdminPageAPI/room.api";
import type { Room } from "../../interfaces/room.interface";
import Footer from "../../Component/footer";
import BookingModal from "./ModalBooking";
import CommentList from "./Reviewer/ListReview";
import AppHeader from "../../Component/hearder";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import FloatingContact from "../../Component/FloatingContact";

const RoomDetail = () => {
  const { id, tenViTri } = useParams<{ id: string; tenViTri: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [openBooking, setOpenBooking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await roomApi.getById(Number(id));
          setRoom(data);
        }
      } catch (err) {
        setError("Không thể tải thông tin phòng");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  useEffect(() => {
    if (!loading && room) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading, room]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spin size="large" tip="Đang tải thông tin phòng..." />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Alert
          message="Lỗi"
          description={error || "Không tìm thấy phòng"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const amenities = [
    { icon: Users, label: `${room.khach} khách`, show: true },
    { icon: Bed, label: `${room.phongNgu} phòng ngủ`, show: true },
    { icon: Bed, label: `${room.giuong} giường`, show: true },
    { icon: Bath, label: `${room.phongTam} phòng tắm`, show: true },
    { icon: Wifi, label: "Wifi", show: room.wifi },
    { icon: Tv, label: "Tivi", show: room.tivi },
    { icon: AirVent, label: "Điều hòa", show: room.dieuHoa },
    { icon: UtensilsCrossed, label: "Bếp", show: room.bep },
    { icon: WashingMachine, label: "Máy giặt", show: room.mayGiat },
    { icon: Shirt, label: "Bàn là", show: room.banLa },
    { icon: Wind, label: "Bàn ủi", show: room.banUi },
    { icon: Car, label: "Đỗ xe", show: room.doXe },
    { icon: Waves, label: "Hồ bơi", show: room.hoBoi },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        
          <AppHeader />
        
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title Section */}
        <div className={`mb-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-2 text-gray-500 mb-3 animate-pulse">
            <MapPin size={18} className="animate-bounce" />
            <span className="text-sm font-medium">
              {tenViTri || `Mã vị trí: ${room.maViTri}`}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 hover:text-pink-600 transition-colors duration-300">
            {room.tenPhong}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 group cursor-pointer">
              <Star size={18} className="fill-yellow-400 text-yellow-400 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-semibold">4.8</span>
              <span className="text-gray-500">(128 đánh giá)</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
       {room.hinhAnh && (
  <div className={`mb-8 rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
    <div className="relative group">
      <Zoom>
        <img
          src={room.hinhAnh}
          alt={room.tenPhong}
          className={`w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover group-hover:scale-110 transition-all duration-700 cursor-pointer ${imageLoaded ? 'blur-0' : 'blur-sm'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1200x500?text=Room+Image";
          }}
        />
      </Zoom>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-500">
        <span className="font-semibold text-pink-600 flex items-center gap-2">
          <Sparkles size={18} className="animate-pulse" />
          Phòng cao cấp
        </span>
      </div>
    </div>
  </div>
)}

        {/* Modal ảnh lớn */}
        <Modal
          open={isImageModalOpen}
          onCancel={() => setIsImageModalOpen(false)}
          footer={null}
          centered
          bodyStyle={{ padding: 0, backgroundColor: "transparent" }}
          width="90%"
        >
          <img
            src={room.hinhAnh}
            alt={room.tenPhong}
            className="w-full h-auto object-contain rounded-2xl"
          />
        </Modal>
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Card */}
            <Card className={`shadow-md hover:shadow-2xl transition-all duration-500 transform ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="bg-pink-50 p-3 rounded-full group-hover:bg-pink-100 group-hover:rotate-12 transition-all duration-300">
                    <Users size={24} className="text-pink-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số khách</p>
                    <p className="font-semibold text-lg group-hover:text-pink-600 transition-colors">{room.khach} khách</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 group-hover:rotate-12 transition-all duration-300">
                    <Bed size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phòng ngủ</p>
                    <p className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{room.phongNgu} phòng</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="bg-purple-50 p-3 rounded-full group-hover:bg-purple-100 group-hover:rotate-12 transition-all duration-300">
                    <Bath size={24} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phòng tắm</p>
                    <p className="font-semibold text-lg group-hover:text-purple-600 transition-colors">{room.phongTam} phòng</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card 
              title={<h2 className="text-2xl font-bold">Mô tả</h2>} 
              className={`shadow-md hover:shadow-xl transition-all duration-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} delay-100`}
            >
              <p className="text-gray-700 leading-relaxed text-base">
                {room.moTa}
              </p>
            </Card>

            {/* Amenities */}
            <Card
              title={<h2 className="text-2xl font-bold">Tiện nghi phòng</h2>}
              className={`shadow-md hover:shadow-xl transition-all duration-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} delay-200`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities
                  .filter((a) => a.show)
                  .map((amenity, index) => {
                    const Icon = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md group-hover:rotate-6 transition-all duration-300">
                          <Icon size={22} className="text-gray-700 group-hover:text-pink-600 group-hover:scale-110 transition-all" />
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-pink-700 transition-colors">
                          {amenity.label}
                        </span>
                        <Check size={18} className="text-green-500 ml-auto group-hover:scale-125 transition-transform" />
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className={`shadow-xl border-2 border-gray-100 sticky top-24 hover:border-pink-200 transition-all duration-500 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="space-y-6">
                {/* Price */}
                <div className="text-center pb-4 border-b">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900 animate-pulse">
                      ${room.giaTien.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500">/ đêm</span>
                  </div>
                  <Tag color="green" className="mt-2 animate-bounce">
                    Giá tốt nhất
                  </Tag>
                </div>

                {/* Booking Button */}
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setOpenBooking(true)}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    Đặt phòng ngay
                    <Sparkles size={18} className="animate-pulse" />
                  </span>
                </Button>

                <Divider className="my-4" />

                {/* Estimate */}
                <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-600">
                    Giá ước tính cho{" "}
                    <span className="font-semibold text-gray-900">5 đêm</span>
                  </p>
                  <p className="text-2xl font-bold text-pink-600 animate-pulse">
                    ${(room.giaTien * 5).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Chưa bao gồm phí dịch vụ & thuế
                  </p>
                </div>

                {/* Features */}
                <div className="bg-gradient-to-br from-gray-50 to-pink-50 p-4 rounded-lg space-y-2">
                  {[
                    "Hủy miễn phí trong 48h",
                    "Xác nhận ngay lập tức",
                    "Hỗ trợ 24/7"
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm transform hover:translate-x-2 transition-transform duration-300 cursor-pointer group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Check size={16} className="text-green-500 group-hover:scale-125 transition-transform" />
                      <span className="text-gray-700 group-hover:text-pink-700 transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {room && (
        <BookingModal
          visible={openBooking}
          onClose={() => setOpenBooking(false)}
          roomId={room.id}
          roomName={room.tenPhong}
          roomPrice={Number(room.giaTien) || 0}
        />
      )}

      {/* Comments Section */}
      {room && (
        <div className="bg-gradient-to-b from-gray-50 to-white animate-fadeIn">
          <div className="container mx-auto px-4 max-w-7xl">
            <CommentList roomId={room.id} />
          </div>
        </div>
      )}
<FloatingContact/>
      {/* Footer */}
      <div style={{ marginTop: '24px' }}>
      <Footer /></div>
    </div>
  );
};

export default RoomDetail;