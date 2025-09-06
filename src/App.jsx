import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// page placeholders – swap in your real pages
import Hiring from "./Pages/Hiring";
import LocalAlerts from "./Pages/LocalAlerts";
import Events from "./Pages/Events";

/* ----------------------  HOME  ---------------------- */
function Home() {
  const images = [
    {
      title: "hero img1",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757157992/generated-image_lpdjav.png",
      message:
        "Sarthi improves urban living by providing real-time traffic updates and facilitating quick civic action",
    },
    {
      title: "hero img2",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158291/generated-image_1_xlnu6x.png",
      message:
        "Sarthi provides real-time, verified local updates to help citizens stay informed and engaged with their community.",
    },
    {
      title: "hero img3",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158626/Gemini_Generated_Image_ihdwd3ihdwd3ihdw_qankgz.png",
      message:
        "Sarthi helps municipal authorities and citizens detect and report urban issues like potholes and garbage to facilitate quicker civic action.",
    },
    {
      title: "hero img4",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158569/generated-image_3_mgkzvg.png",
      message:
        "Sarthi empowers citizens to easily report and resolve urban issues like potholes and graffiti by providing a platform for quick municipal action.",
    },
    {
      title: "hero img5",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158767/Gemini_Generated_Image_ges5x8ges5x8ges5_bkrj7m.png",
      message:
        "Sarthi uses AI to verify community reports, ensuring accurate and trusted information for civic action.",
    },
    {
      title: "hero img6",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158832/generated-image_4_crdfyg.png",
      message:
        "Sarthi provides short-term community jobs to improve employability and increase economic opportunity and engagement.",
    },
    {
      title: "hero img7",
      src: "https://res.cloudinary.com/dkutcr19r/image/upload/v1757158927/Gemini_Generated_Image_vv9py3vv9py3vv9p_uxnztq.png",
      message:
        "Sarthi is a community-powered platform that combines local alerts and events with AI verification to foster engagement and enhance civic action.",
    },
  ];

  const [index, setIndex] = useState(0);
  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleImages = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  };
  const visible = getVisibleImages();

  const IconButton = ({ className = "", ...props }) => (
    <button
      className={`h-12 w-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-md shadow-md ${className}`}
      {...props}
      aria-label="carousel navigation"
    />
  );

  const Card = ({ className = "", children }) => (
    <div className={`rounded-2xl border border-white/30 bg-white/90 text-gray-900 shadow-lg backdrop-blur-md ring-1 ring-white/10 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="relative h-screen max-h-screen rounded-b-3xl w-full overflow-hidden bg-gradient-to-br from-sky-800 via-indigo-900 to-purple-900">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75 transition-all duration-700"
        style={{ backgroundImage: `url(${images[index].src})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full items-center justify-center px-8 gap-12 max-w-7xl mx-auto">
        {/* Logo & Message */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
            Saarthi
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-lg sm:text-xl font-medium text-gray-100 max-w-md drop-shadow-md"
            >
              {images[index].message}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Carousel */}
        <div className="w-full lg:w-2/3 flex items-center justify-center">
          <div className="flex items-center gap-5 w-full">
            <IconButton onClick={prevSlide}>
              <ChevronLeft className="h-7 w-7 text-white" />
            </IconButton>

            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className={`grid gap-5 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
            >
              {images.slice(index, index + visible).map((img, i) => (
                <Card key={i} className="cursor-pointer hover:scale-105 transform transition-transform duration-300">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="h-36 sm:h-44 w-full object-cover rounded-t-2xl"
                    loading="lazy"
                  />
                </Card>
              ))}
            </motion.div>

            <IconButton onClick={nextSlide}>
              <ChevronRight className="h-7 w-7 text-white" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------  APP WITH NAV  -------------------- */
export default function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 font-bold">
                Saarthi
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/hiring" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Hiring
                </Link>
                <Link to="/alerts" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Local Alerts
                </Link>
                <Link to="/events" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <main>
        <Routes>
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/alerts" element={<LocalAlerts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}
