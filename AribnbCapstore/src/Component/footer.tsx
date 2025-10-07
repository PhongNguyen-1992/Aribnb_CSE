import { Globe, Facebook, Instagram, Twitter, Send, Heart, MapPin, Mail } from "lucide-react";
import {  Input, Button } from "antd";
import { motion } from "framer-motion";
import Logo from "./logo";
import { NavLink } from "react-router";

export default function Footer() {
  const footerLinks = {
    support: [
      "Trung tâm trợ giúp",
      "AirCover",
      "Hỗ trợ người khuyết tật",
      "Các tùy chọn hủy",
      "Báo cáo lo ngại"
    ],
    hosting: [
      "Đưa trải nghiệm lên AirStay",
      "Tài nguyên về đón tiếp khách",
      "Diễn đàn cộng đồng",
      "Đón tiếp khách có trách nhiệm"
    ],
    about: [
      "Giới thiệu",
      "Tin tức",
      "Cơ hội nghề nghiệp",
      "Nhà đầu tư"
    ]
  };

  const socialIcons = [
    { Icon: Facebook, color: "hover:text-blue-600", label: "Facebook" },
    { Icon: Instagram, color: "hover:text-pink-600", label: "Instagram" },
    { Icon: Twitter, color: "hover:text-sky-500", label: "Twitter" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50 text-gray-700 pt-16 pb-8 border-t border-purple-100 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <NavLink to={"/Home"}>
            <Logo /></NavLink>
            <p className="text-sm text-gray-600 mt-4 mb-6 max-w-xs leading-relaxed">
              Cảm ơn bạn đã đồng hành cùng AirStay. Hãy chia sẻ ý kiến để chúng tôi phục vụ tốt hơn.
            </p>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Email của bạn"
                prefix={<Mail size={16} className="text-gray-400" />}
                className="rounded-xl h-11 hover:border-purple-400 focus:border-purple-500 transition-colors"
              />
              <Button
                type="primary"
                icon={<Send size={16} />}
                className="rounded-xl h-11 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full text-sm font-medium text-purple-700"
            >
              <MapPin size={16} />
              <span>Việt Nam</span>
            </motion.div>
          </motion.div>

          {/* Links Columns */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">
            {/* Support Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-4 text-gray-900 text-base flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
                Hỗ trợ
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="cursor-pointer hover:text-purple-600 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-600 group-hover:w-3 transition-all duration-300"></span>
                    {link}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Hosting Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-4 text-gray-900 text-base flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></span>
                Đón tiếp khách
              </h3>
              <ul className="space-y-3">
                {footerLinks.hosting.map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="cursor-pointer hover:text-purple-600 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-600 group-hover:w-3 transition-all duration-300"></span>
                    {link}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* About Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-4 text-gray-900 text-base flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full"></span>
                AirStay
              </h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="cursor-pointer hover:text-purple-600 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-600 group-hover:w-3 transition-all duration-300"></span>
                    {link}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Gradient Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500"
        >
          {/* Copyright & Links */}
          <div className="text-center lg:text-left flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1">
              © 2025 AirStay, Inc.
              <Heart size={14} className="text-red-400 animate-pulse" fill="currentColor" />
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Quyền riêng tư</span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Điều khoản</span>
            <span className="hidden sm:inline">•</span>
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Sơ đồ trang web</span>
          </div>

          {/* Language, Currency & Social */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* Language */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md hover:text-purple-600 transition-all duration-300 cursor-pointer"
            >
              <Globe size={16} />
              <span className="font-medium">Tiếng Việt (VN)</span>
            </motion.div>

            {/* Currency */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md hover:text-purple-600 transition-all duration-300 cursor-pointer"
            >
              <span className="font-bold">₫</span>
              <span className="font-medium">VND</span>
            </motion.div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, color, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 ${color}`}
                >
                  <Icon size={18} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Made with Love */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-xs text-gray-400"
        >
          <p className="flex items-center justify-center gap-2">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={12} className="text-red-400" fill="currentColor" />
            </motion.span>
            in Vietnam
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </footer>
  );
}