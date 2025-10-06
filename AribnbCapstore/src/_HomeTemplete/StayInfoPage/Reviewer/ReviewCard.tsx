import { Card, Avatar, Badge } from "antd";
import { Star, ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import type { BinhLuan } from "../../../interfaces/room.interface";

dayjs.locale("vi");
dayjs.extend(relativeTime);

interface CommentCardProps {
  comment: BinhLuan;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < comment.saoBinhLuan);
  const isHighRating = comment.saoBinhLuan >= 4;

  return (
    <Card
      className="group shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-gray-100 hover:border-pink-200 transform hover:-translate-y-1 sm:hover:-translate-y-2 relative"
      bodyStyle={{ padding: "16px" }} // giảm padding mặc định
    >
      {/* Decorative top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          isHighRating
            ? "from-yellow-400 via-orange-400 to-pink-500"
            : "from-gray-300 to-gray-400"
        } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      ></div>

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Badge
            count={
              isHighRating ? (
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              ) : 0
            }
            offset={[-4, 4]}
          >
            <Avatar
              src={comment.avatar}
              alt={comment.tenNguoiBinhLuan}
              size={48}
              className="border-2 border-white shadow-sm ring-1 ring-pink-100 group-hover:ring-pink-300 transition-all duration-300 group-hover:scale-105 sm:size-64"
            />
          </Badge>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start gap-3 sm:gap-4 mb-1 sm:mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-300 truncate">
                {comment.tenNguoiBinhLuan}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
                <Calendar size={12} className="group-hover:text-pink-500 transition-colors" />
                <span>{dayjs(comment.ngayBinhLuan).format("DD/MM/YYYY")}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">
                  {dayjs(comment.ngayBinhLuan).fromNow()}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
              <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50/60 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full group-hover:shadow-sm transition-shadow">
                {stars.map((filled, index) => (
                  <Star
                    key={index}
                    size={14}
                    className={`transition-all duration-300 ${
                      filled
                        ? "text-yellow-500 fill-yellow-400 group-hover:scale-110"
                        : "text-gray-300"
                    }`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                {comment.saoBinhLuan}.0/5
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="mt-2 sm:mt-4 relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-pink-200 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base group-hover:text-gray-900 transition-colors duration-300 line-clamp-4">
              {comment.noiDung}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-100 text-xs sm:text-sm">
            {/* Ẩn ở mobile cho gọn */}
            <div className="hidden sm:flex gap-3">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-pink-600 transition-colors group/btn">
                <ThumbsUp size={14} className="group-hover/btn:scale-110 transition-transform" />
                <span>Hữu ích</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-pink-600 transition-colors group/btn">
                <MessageCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                <span>Trả lời</span>
              </button>
            </div>

            {/* Badge cho review xuất sắc */}
            {comment.saoBinhLuan === 5 && (
              <span className="ml-auto inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md transform group-hover:scale-105 transition-transform">
                <Star size={10} className="fill-white" />
                Xuất sắc
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
    </Card>
  );
};

export default CommentCard;
