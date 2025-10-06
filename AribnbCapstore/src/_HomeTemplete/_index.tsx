import { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Footer from "../Component/footer";
import ListVisit from "./StayInfoPage/listVist";
import AppHeader from "../Component/hearder";

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

  const images = [
    "https://a0.muscache.com/im/pictures/miso/Hosting-714662748945260228/original/4951abc6-6803-4fb5-9ad2-1303566d3918.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1219115879089521579/original/15bb12ef-6fdd-4299-91bf-75f0f388fb21.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1219115879089521579/original/a4afd00e-3288-4808-bdf8-f656de8893fc.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1446133625773813816/original/af65c8f4-3abd-46af-8671-9c026717eb18.jpeg?im_w=720",
  ];

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

        {/* ✨ Image Gallery Section */}
        <section className="mt-16 px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-3xl sm:text-4xl font-extrabold text-gray-800 mb-10 
             tracking-tight animate__animated animate__fadeInUp"
          >
            <Sparkles className="w-7 h-7 text-indigo-500 inline-block mr-2 animate-spin-slow" />
            <span
              className="relative after:absolute after:left-0 after:right-0 after:-bottom-1 
                   after:h-[3px] after:bg-gradient-to-r 
                   from-indigo-400 via-purple-400 to-pink-400 
                   after:rounded-full after:animate-pulse"
            >
              Inspiring Destinations
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src={src}
                  alt={`Destination ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <p className="text-white text-lg font-medium">
                    Dream Getaway #{index + 1}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
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
