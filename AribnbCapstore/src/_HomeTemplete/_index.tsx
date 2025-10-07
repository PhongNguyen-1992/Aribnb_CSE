import { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
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
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Spin size="large" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4"
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-purple-300"></div>
            </motion.div>
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold"
          >
            Loading your next experience...
          </motion.p>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800 overflow-hidden">
      {/* ✨ Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.15),transparent_60%)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
    
        <div className="!sticky !top-0 !z-50">
        <AppHeader /></div>
    

      {/* Main */}
      <main className="relative z-10 py-20 text-center">
         <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                   Explore Unique Stays
                </h2>
              </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mt-3 text-lg"
        >
          Discover beautiful places and experiences curated for you.
        </motion.p>

        {/* List Visit */}
        <div className="mt-12">
          <ListVisit />
        </div>

        {/* ✨ Image Gallery Section */}
        <section className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Inspiring Destinations
                </h2>
              </div>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
                    <div className="relative rounded-2xl overflow-hidden">
                      <motion.img
                        src={src}
                        alt={`Destination ${index + 1}`}
                        className="w-full h-72 object-cover transition-all duration-700"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Star className="w-10 h-10 text-yellow-400 mb-3 mx-auto" fill="currentColor" />
                            <p className="text-white text-xl font-bold mb-2">
                              Dream Getaway
                            </p>
                            <p className="text-purple-200 text-sm">
                              #{index + 1}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-12"
      >
        <Footer />
      </motion.footer>
    </div>
  );
}
