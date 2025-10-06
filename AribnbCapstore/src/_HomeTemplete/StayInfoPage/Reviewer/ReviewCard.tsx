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
      className="group shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-gray-100 hover:border-pink-200 transform hover:-translate-y-2 relative"
      bodyStyle={{ padding: "24px" }}
    >
      {/* Decorative top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isHighRating ? 'from-yellow-400 via-orange-400 to-pink-500' : 'from-gray-300 to-gray-400'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

      <div className="flex items-start gap-4">
        {/* Avatar with badge */}
        <div className="relative flex-shrink-0">
          <Badge 
            count={isHighRating ? <Star size={14} className="fill-yellow-400 text-yellow-400" /> : 0}
            offset={[-5, 5]}
          >
            <Avatar
              src={comment.avatar}
              alt={comment.tenNguoiBinhLuan}
              size={64}
              className="border-4 border-white shadow-lg ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all duration-300 group-hover:scale-110"
            />
          </Badge>
          {/* Pulse effect for high ratings */}
          {isHighRating && (
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-300 truncate">
                {comment.tenNguoiBinhLuan}
              </h3>
              
              {/* Date with icon */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} className="group-hover:text-pink-500 transition-colors" />
                <span>{dayjs(comment.ngayBinhLuan).format("DD/MM/YYYY")}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{dayjs(comment.ngayBinhLuan).fromNow()}</span>
              </div>
            </div>

            {/* Star Rating - Vertical on mobile, horizontal on larger screens */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full group-hover:shadow-md transition-shadow">
                {stars.map((filled, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={`transition-all duration-300 ${
                      filled 
                        ? "text-yellow-500 fill-yellow-400 group-hover:scale-125" 
                        : "text-gray-300"
                    }`}
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      animation: filled ? 'none' : 'none'
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                {comment.saoBinhLuan}.0/5
              </span>
            </div>
          </div>

          {/* Comment Content */}
          <div className="mt-4 relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-pink-200 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <p className="text-gray-700 leading-relaxed text-base group-hover:text-gray-900 transition-colors duration-300">
              {comment.noiDung}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors group/btn flex-shrink-0">
              <ThumbsUp size={16} className="group-hover/btn:scale-125 transition-transform" />
              <span className="font-medium">Hữu ích</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors group/btn flex-shrink-0">
              <MessageCircle size={16} className="group-hover/btn:scale-125 transition-transform" />
              <span className="font-medium">Trả lời</span>
            </button>
            
            {/* Rating badge for excellent reviews */}
            {comment.saoBinhLuan === 5 && (
              <div className="ml-auto flex-shrink-0">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform group-hover:scale-110 transition-transform">
                  <Star size={12} className="fill-white" />
                  Xuất sắc
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </Card>
  );
};

export default CommentCard;