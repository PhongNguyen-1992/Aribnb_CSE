import { useEffect, useState } from "react";
import { message, Rate, Skeleton, Empty } from "antd";
import axios from "axios";
import type { BinhLuan } from "../../interfaces/room.interface";


interface RoomReviewListProps {
  roomId: number;
}

const RoomReviewList: React.FC<RoomReviewListProps> = ({ roomId }) => {
  const [reviews, setReviews] = useState<BinhLuan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://airbnbnew.cybersoft.edu.vn/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`,
          {
            headers: {
              tokenCybersoft:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
            },
          }
        );
        setReviews(res.data.content || []);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải bình luận");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchReviews();
  }, [roomId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} active paragraph={{ rows: 2 }} />
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <Empty
        description="Chưa có mô tả hoặc bình luận cho phòng này"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Mô tả & Đánh giá</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">
                {review.tenNguoiBinhLuan}
              </span>
              <Rate disabled value={review.saoBinhLuan} />
            </div>

            {/* ✅ Hiển thị mô tả chính */}
            <p className="text-gray-700 leading-relaxed">{review.noiDung}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomReviewList;
