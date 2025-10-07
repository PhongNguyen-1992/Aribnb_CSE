import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "antd";
import {
  Plane,
  Globe2,
  Star,
  Map,
  Compass,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

// Floating Icons Component
interface FloatingIconProps {
  Icon: LucideIcon;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  Icon,
  delay = 0,
  duration = 3,
  x = 100,
  y = 100,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      x: [0, x],
      y: [0, -y],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: 2,
    }}
    className="absolute"
  >
    <Icon className="text-white/40" size={24} />
  </motion.div>
);
 
// Particle Component
const Particle = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -100],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: 1,
    }}
    className="absolute w-1 h-1 bg-blue-400 rounded-full"
  />
);

export default function WelcomePage() {
  const [showContent, setShowContent] = useState(false);
 const navigate = useNavigate();
   const handleStart = () => {
    navigate("/Home"); 
  };
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);
 

  const features = [
    { icon: Map, text: "Hơn 1000+ điểm đến" },
    { icon: Star, text: "Trải nghiệm 5 sao" },
    { icon: Compass, text: "Hướng dẫn địa phương" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient"></div>
      </div>

      {/* Floating Icons */}
      <FloatingIcon Icon={Plane} delay={0} x={150} y={120} duration={4} />
      <FloatingIcon Icon={Globe2} delay={1} x={-120} y={100} duration={3.5} />
      <FloatingIcon Icon={Map} delay={2} x={100} y={150} duration={4.2} />
      <FloatingIcon Icon={Compass} delay={1.5} x={-150} y={130} duration={3.8} />
      <FloatingIcon Icon={Star} delay={2.5} x={120} y={140} duration={3.6} />

      {/* Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Particle delay={i * 0.2} />
        </div>
      ))}

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            {/* Rotating Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="relative mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full shadow-2xl">
                  <Globe2 className="w-16 h-16" />
                </div>
              </motion.div>

              {/* Orbiting Stars */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 1,
                  }}
                  style={{ transformOrigin: "0 0" }}
                >
                  <div
                    className="absolute"
                    style={{ transform: `rotate(${angle}deg) translateX(60px)` }}
                  >
                    <Sparkles
                      className="w-6 h-6 text-yellow-300"
                      fill="currentColor"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 drop-shadow-2xl">
                Chào mừng đến với AirBNB Travel
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl leading-relaxed"
            >
              Khám phá thế giới cùng{" "}
              <span className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                AriBNB Travel
              </span>
              <br />
              Hành trình kỳ diệu bắt đầu từ đây ✨
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-xl"
                >
                  <feature.icon className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={handleStart}
                className="h-16 px-12 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-0 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-3"
                icon={<Plane className="w-6 h-6" />}
              >
                Bắt đầu khám phá
                <ArrowRight className="w-5 h-5 animate-bounce-x" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-gradient { animation: gradient 8s ease infinite; }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounce-x 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
