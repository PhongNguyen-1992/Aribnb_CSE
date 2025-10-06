import { useEffect, useState } from "react";
import { Skeleton, Empty, message } from "antd";
import type { BinhLuan } from "../../../interfaces/room.interface";
import { commentApi } from "../../../service/review.api";
import CommentCard from "./ReviewCard";
import { motion } from "framer-motion";

interface CommentListProps {
  roomId: number;
}

const CommentList: React.FC<CommentListProps> = ({ roomId }) => {
  const [comments, setComments] = useState<BinhLuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // ✅ Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Lấy bình luận
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentApi.getCommentsByRoomId(roomId);
        setComments(data || []);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải bình luận");
      } finally {
        setLoading(false);
      }
    };
    if (roomId) fetchComments();
  }, [roomId]);

  // ✅ Auto slide
  useEffect(() => {
    if (paused || comments.length <= (isMobile ? 1 : 4)) return;
    const timer = setInterval(() => {
      setIndex(
        (prev) => (prev + 1) % Math.ceil(comments.length / (isMobile ? 1 : 4))
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, comments, isMobile]);

  // ✅ Loading
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} active avatar paragraph={{ rows: 2 }} />
        ))}
      </div>
    );

  // ✅ Empty
  if (!comments.length)
    return (
      <Empty
        description="Chưa có bình luận cho phòng này"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );

  // ✅ Chia slide: Mobile = 1 card, Desktop = 4 card (2 hàng × 2 cột)
  const groupSize = isMobile ? 1 : 4;
  const slides: BinhLuan[][] = [];
  for (let i = 0; i < comments.length; i += groupSize) {
    slides.push(comments.slice(i, i + groupSize));
  }

  return (
    <div
      className="relative mt-16 mx-auto max-w-6xl bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tiêu đề */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
        Đánh giá nổi bật
      </h2>

      {/* Carousel */}
      <div className="overflow-hidden px-2">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className={`grid flex-shrink-0 w-full ${
                isMobile
                  ? "grid-cols-1"
                  : "grid-cols-2 grid-rows-2 gap-6" // ✅ 2 cột × 2 hàng
              } gap-6`}
            >
              {slide.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-pink-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
