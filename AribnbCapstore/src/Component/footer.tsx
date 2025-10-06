import { Globe, Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Divider, Input, Button } from "antd";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-12 pb-6 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === Bố cục chính === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* --- Cột Logo + Góp ý --- */}
          <div>
            <Logo />
            <p className="text-sm text-gray-600 mt-3 mb-4 max-w-xs">
              Cảm ơn bạn đã đồng hành cùng AirStay. Hãy chia sẻ ý kiến để chúng tôi phục vụ tốt hơn.
            </p>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Nhập email của bạn"
                className="rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <Button
                type="primary"
                icon={<Send size={16} />}
                className="rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                Gửi
              </Button>
            </div>
          </div>

          {/* --- Các cột liên kết --- */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>Trung tâm trợ giúp</li>
                <li>AirCover</li>
                <li>Hỗ trợ người khuyết tật</li>
                <li>Các tùy chọn hủy</li>
                <li>Báo cáo lo ngại</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Đón tiếp khách</h3>
              <ul className="space-y-2">
                <li>Đưa trải nghiệm lên AirStay</li>
                <li>Tài nguyên về đón tiếp khách</li>
                <li>Diễn đàn cộng đồng</li>
                <li>Đón tiếp khách có trách nhiệm</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-900">AirStay</h3>
              <ul className="space-y-2">
                <li>Giới thiệu</li>
                <li>Tin tức</li>
                <li>Cơ hội nghề nghiệp</li>
                <li>Nhà đầu tư</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Đường kẻ chia --- */}
        <Divider className="my-8" />

        {/* --- Dòng cuối --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="text-center sm:text-left">
            © 2025 AirStay, Inc. • Quyền riêng tư • Điều khoản • Sơ đồ trang web
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 hover:text-gray-700 transition">
              <Globe size={16} />
              <span>Tiếng Việt (VN)</span>
            </div>
            <div className="flex items-center gap-1 hover:text-gray-700 transition">
              <span>₫</span> <span>VND</span>
            </div>
            <div className="flex gap-3">
              <Facebook className="cursor-pointer hover:text-gray-700" size={18} />
              <Instagram className="cursor-pointer hover:text-gray-700" size={18} />
              <Twitter className="cursor-pointer hover:text-gray-700" size={18} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
