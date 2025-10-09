import { useState, useEffect, useRef } from "react";
import { Phone, MessageCircle, X, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ButtonItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  link?: string;
  onClick?: () => void;
}


export default function FloatingContact() {
  const phoneNumber = "0339990014";
  const zaloLink = "https://zalo.me/339990014";

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buttons: ButtonItem[] = [
    {
      id: "zalo",
      label: "Chat trực tiếp",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400",
      link: zaloLink,
    },
    {
      id: "bot",
      label: "AI Chatbot",
      icon: <Bot className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      onClick: () => setShowChat((prev) => !prev),
    },
    {
      id: "phone",
      label: "Hotline",
      icon: <Phone className="w-6 h-6" />,
      color: "from-green-500 to-emerald-400",
      link: `tel:${phoneNumber}`,
    },
  ];

  // Smart mock responses
  const getSmartResponse = (message: string): string => {
    const msg = message.toLowerCase();

    // Greetings
    if (msg.match(/^(hi|hello|xin chào|chào|hey|Ben|Chào Ben)/)) {
      return "Xin chào! 👋 Tôi là Ben Ngố – trợ lý AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?";
    }

    // Help/Service questions
    if (msg.includes("giúp") || msg.includes("help") || msg.includes("hỗ trợ")|| msg.includes("cần hỗ trợ")) {
      return "Tôi có thể hỗ trợ bạn về:\n• Thông tin sản phẩm/dịch vụ\n• Giá cả và khuyến mãi\n• Liên hệ tư vấn\n• Câu hỏi thường gặp\n\nBạn cần biết thêm điều gì? 😊";
    }

    // Product/Service
    if (msg.includes("sản phẩm") || msg.includes("dịch vụ") || msg.includes("product")|| msg.includes("tour") || msg.includes("service")|| msg.includes("đăt phòng")|| msg.includes("đăt tour")|| msg.includes("thuê phòng")) {
      return "Chúng tôi cung cấp nhiều sản phẩm/dịch vụ thuê phòng chất lượng cao. Để tôi kết nối bạn với chuyên viên tư vấn để được hỗ trợ tốt nhất nhé!\n📞 Hotline: 0339990014\n💬 Chat Zalo: zalo.me/339990014";
    }

    // Pricing
    if (msg.includes("giá") || msg.includes("price") || msg.includes("bao nhiêu") || msg.includes("cost")) {
      return "Giá cả của chúng tôi rất cạnh tranh! 💰\n\nĐể biết báo giá chi tiết cho nhu cầu cụ thể của bạn, vui lòng:\n📞 Gọi: 0339990014\n💬 Zalo: zalo.me/339990014";
    }

    // Contact/Consultation
    if (msg.includes("liên hệ") || msg.includes("tư vấn") || msg.includes("contact") || msg.includes("gặp")) {
      return "Bạn có thể liên hệ với chúng tôi qua:\n\n📞 Hotline: 0339990014\n💬 Zalo: zalo.me/339990014\n\nBen Ngố luôn sẵn sàng hỗ trợ bạn 24/7! ⚡";
    }

    // Hours
    if (msg.includes("ngày làm việc") || msg.includes("time") || msg.includes("hours") || msg.includes("mở cửa")) {
      return "⏰ Giờ làm việc:\nThứ 2 - Thứ 6: 8:00 - 18:00\nThứ 7: 8:00 - 17:00\nChủ nhật: Nghỉ\n\nHotline hỗ trợ 24/7: 0339990014";
    }

    // Location
    if (msg.includes("địa chỉ") || msg.includes("ở đâu") || msg.includes("location") || msg.includes("address")) {
      return "📍 Địa chỉ của chúng tôi:\n[Thêm địa chỉ cụ thể tại đây]\n\nLiên hệ hotline: 0339990014 để được hướng dẫn chi tiết!";
    }

    // Thanks
    if (msg.match(/cảm ơn|thanks|thank you|cám ơn/)) {
      return "Rất vui được hỗ trợ bạn! 🌟 Nếu cần thêm thông tin, đừng ngại liên hệ:\n📞 0339990014\n💬 zalo.me/339990014\n\n– Ben Ngố 🤖";
    }

    // Goodbye
    if (msg.match(/bye|tạm biệt|goodbye|hẹn gặp lại/)) {
      return "Tạm biệt nhé! 👋 Ben Ngố chúc bạn một ngày tốt lành! 😊";
    }

    // Default
    return "Cảm ơn bạn đã nhắn tin! 😊\n\nĐể được tư vấn chính xác nhất, vui lòng liên hệ:\n📞 0339990014\n💬 zalo.me/339990014\n\nBen Ngố sẽ phản hồi ngay khi có thể ⚡";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getSmartResponse(input);
      const botMsg: Message = { role: "assistant", content: botResponse };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[9999]">
        {buttons.map((btn) => (
          <div key={btn.id} className="group flex items-center gap-2 relative">
            {/* Tooltip */}
            <span className="absolute right-16 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
              {btn.label}
            </span>

            {/* Button */}
            {btn.link ? (
              <a
                href={btn.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${btn.color} text-white shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all duration-200`}
              >
                {btn.icon}
              </a>
            ) : (
              <button
                onClick={btn.onClick}
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${btn.color} text-white shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all duration-200`}
              >
                {btn.icon}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Chatbot Popup */}
      {showChat && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col z-[9999] overflow-hidden border border-purple-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="text-sm font-bold">Ben Ngố Chatbot</div>
                <div className="text-xs opacity-90">Đang hoạt động</div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 text-sm overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-8 h-8 text-purple-500" />
                </div>
                <p className="font-semibold text-gray-700">
                  Xin chào! Tôi là <span className="text-purple-600">Ben Ngố 🤖</span>
                </p>
                <p className="text-xs mt-2 px-4">
                  Hỏi tôi về sản phẩm, dịch vụ, giá cả hoặc bất cứ điều gì bạn cần nhé!
                </p>

                <div className="mt-4 space-y-2">
                  {["Sản phẩm của bạn?", "Bảng giá như thế nào?", "Liên hệ tư vấn"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] break-words whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-sm shadow-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 italic text-xs">
                <div className="flex gap-1 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              type="text"
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
