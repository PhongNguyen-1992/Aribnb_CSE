import { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Footer from "../Component/footer";
import AppHeader from "../Component/hearder";
import ListVisit from "./StayInfoPage/listVist";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-gray-500 text-sm font-medium animate-pulse">
            Loading your next experience...
          </p>
        </div>
      </Flex>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AppHeader />
      </motion.div>

      {/* Main */}
      <main className="relative py-16 text-center bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold text-gray-800 flex justify-center items-center gap-2"
        >
          <Sparkles className="w-6 h-6 text-indigo-500" />
          Explore Unique Stays
        </motion.h1>
        <p className="text-gray-600 mt-2 text-base">
          Discover beautiful places and experiences curated for you.
        </p>
          <ListVisit />

      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Footer />
      </motion.footer>
    </div>
  );
}
