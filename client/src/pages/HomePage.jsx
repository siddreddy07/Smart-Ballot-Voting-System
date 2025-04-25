import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Vote, FileText, Camera, Video, Facebook, Twitter, Youtube, Instagram, LogIn, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const commissioners = [
  { name: "Shri Rajiv Kumar", role: "Chief Election Commissioner", image: "https://www.eci.gov.in/newimg/gallery/cec-Shri-Gyanesh-Kumar.jpg" },
  { name: "Shri Gyanesh Kumar", role: "Election Commissioner", image: "https://www.eci.gov.in/newimg/gallery/EC-Dr-Sukhbir-Singh-Sandhu.jpg" },
  { name: "Shri Sukhbir Singh Sandhu", role: "Election Commissioner", image: "https://www.eci.gov.in/newimg/gallery/dr-vivek-joshi.png" },
];

const newsUpdates = [
  "Global voter systems live for 2025",
  "AI-powered booths redefine access",
  "Digital campaigns gain transparency",
  "Real-time analytics rolled out",
];

const navItems = [
  { label: "Voter Interface", icon: User, color: "bg-orange-600", to: "/voter" },
  { label: "Candidate Core", icon: Building2, color: "bg-blue-600", to: "/candidate" },
  { label: "Election Grid", icon: Vote, color: "bg-green-600", to: "/elections" },
  { label: "Data Vault", icon: FileText, color: "bg-orange-600", to: "/documents" },
  { label: "Media Array", icon: Camera, color: "bg-blue-600", to: "/media" },
  { label: "ECI Network", icon: Video, color: "bg-green-600", to: "/about" },
];

const galleryImages = [
  { src: "https://www.eci.gov.in/eci-backend/public/banner/April/QnPhJWCo9As0xH81744887743.jpg", alt: "Voter Hub", caption: "Igniting Democracy" },
  { src: "https://www.eci.gov.in/eci-backend/public/banner/March/IIaNlt2cwuKvzAR1743069808.jpg", alt: "Digital Booth", caption: "Voting Reimagined" },
  { src: "https://www.eci.gov.in/eci-backend/public/banner/January/BkKoLRW2n3wkm4P1737821452.jpg", alt: "Campaign Drive", caption: "Voices Amplified" },
  { src: "https://www.eci.gov.in/eci-backend/public/banner/April/cg1wvFMPLChgIFV1712124541.jpg", alt: "Election Core", caption: "Command Nexus" },
];

const videos = [
  { src: "https://www.eci.gov.in/eci-backend/public/banner/February/FLipYObUslchUzk1739512362.jpg", alt: "System Overview", caption: "Digital Revolution" },
  { src: "https://www.eci.gov.in/eci-backend/public/banner/May/mmuQIB9nGUIKMXg1714982815.jpg", alt: "Voter Access", caption: "Seamless Access" },
  { src: "https://www.eci.gov.in/eci-backend/public/banner/April/QnPhJWCo9As0xH81744887743.jpg", alt: "Campaign Tools", caption: "Clarity First" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isVoterLoginOpen, setVoterLoginOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isOtherLoginOpen, setOtherLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState('candidate');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const menuRef = useRef(null);

  const loaderTexts = [
    { text: "Secure", color: "#f97316" }, // Saffron
    { text: "Transparent", color: "#1e40af" }, // Blue
    { text: "Smart Voting System", color: "#15803d" }, // Green
  ];

  // Close hamburger menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loaderTexts.length);
    }, 1600);

    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(textInterval);
    }, 4800);

    return () => {
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(imageTimer);
  }, []);

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(videoTimer);
  }, []);

  const prevImage = () => setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  const prevVideo = () => setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  const nextVideo = () => setCurrentVideo((prev) => (prev + 1) % videos.length);

  const handleNavigate = (to) => {
    navigate(to);
    setVoterLoginOpen(false);
    setOtherLoginOpen(false);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 antialiased">
      <style>
        {`
          @keyframes text-reveal {
            0% { transform: translateY(50px); opacity: 0; }
            30% { transform: translateY(0); opacity: 1; }
            70% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-50px); opacity: 0; }
          }

          @keyframes gradient-pulse {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.15); }
            100% { opacity: 0.4; transform: scale(1); }
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
          }

          .loader {
            position: fixed;
            inset: 0;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
            transition: opacity 0.8s ease;
          }

          .loader.hidden {
            opacity: 0;
            pointer-events: none;
          }

          .loader::before {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent 50%, currentColor 100%);
            opacity: 0.5;
            animation: gradient-pulse 3s ease-in-out infinite;
          }

          .loader-text {
            font-size: 4rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 6px;
            text-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            animation: text-reveal 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .glassmorphic {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .glassmorphic-bg {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(15px);
          }
        `}
      </style>

      {/* Loader */}
      {isLoading && (
        <motion.div
          className={`loader ${isLoading ? '' : 'hidden'}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="loader-text"
            style={{ color: loaderTexts[currentTextIndex].color }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            key={currentTextIndex}
          >
            {loaderTexts[currentTextIndex].text}
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-full h-full"
            style={{ background: `linear-gradient(135deg, transparent 50%, ${loaderTexts[currentTextIndex].color} 100%)` }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        className="fixed w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white z-40 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">Smart Voter Verification System</h1>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setVoterLoginOpen(true)}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition flex items-center gap-2 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} /> Voter Portal
            </motion.button>
            <motion.button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.div
                className="absolute w-8 h-0.5 bg-white rounded-full"
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 4 : -4 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute w-8 h-0.5 bg-white rounded-full"
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -4 : 4 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="bg-white shadow-xl rounded-b-2xl p-6 absolute top-full right-0 w-full max-w-xs sm:max-w-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {['candidate', 'booth-officer', 'verification-officer'].map((type) => (
                <motion.button
                  key={type}
                  onClick={() => {
                    setOtherLoginOpen(true);
                    setLoginType(type);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-600 rounded-md transition text-sm font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Portal
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-orange-50 overflow-hidden pt-20">
        <motion.div
          className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-600">
              Democracy Reimagined
            </span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A secure, transparent, and accessible voting ecosystem for the future.
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/explore"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-orange-700 transition shadow-md"
            >
              Explore Now
            </Link>
            <Link
              to="/about"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium text-sm hover:bg-orange-50 transition shadow-md border border-orange-200"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
        {/* Subtle Particles */}
        <motion.div
          className="absolute top-1/3 left-1/5 w-8 h-8 bg-orange-300 rounded-full opacity-50"
          animate={{ y: [-10, 10] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-10 h-10 bg-blue-300 rounded-full opacity-50"
          animate={{ y: [10, -10] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
      </section>

      {/* Navigation Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your Voting Ecosystem
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm mb-4">Explore {item.label.toLowerCase()} features.</p>
              <Link to={item.to} className="text-orange-600 text-sm font-medium hover:text-orange-700 transition">
                Discover →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image Carousel */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Moments of Democracy
          </motion.h2>
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: index === currentImage ? 1 : 1.1, opacity: index === currentImage ? 1 : 0 }}
                transition={{ duration: 1 }}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                <motion.div
                  className="absolute bottom-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {img.caption}
                </motion.div>
              </motion.div>
            ))}
            <motion.button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-orange-600 hover:text-white transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-orange-600 hover:text-white transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full ${index === currentImage ? 'bg-orange-600' : 'bg-gray-300'} hover:bg-orange-500 transition`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Carousel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Insights in Motion
        </motion.h2>
        <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 ${index === currentVideo ? 'opacity-100' : 'opacity-0'}`}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: index === currentVideo ? 1 : 1.1, opacity: index === currentVideo ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <img src={video.src} alt={video.alt} className="w-full h-full object-cover" />
              <motion.div
                className="absolute bottom-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {video.caption}
              </motion.div>
            </motion.div>
          ))}
          <motion.button
            onClick={prevVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-orange-600 hover:text-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-orange-600 hover:text-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`w-3 h-3 rounded-full ${index === currentVideo ? 'bg-blue-600' : 'bg-gray-300'} hover:bg-blue-500 transition`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Commissioners & News */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-xl p-8 shadow-md"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Leadership</h3>
              <div className="space-y-6">
                {commissioners.map((commissioner, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={commissioner.image}
                      alt={commissioner.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-600"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{commissioner.name}</p>
                      <p className="text-gray-600 text-sm">{commissioner.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-8 shadow-md"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h3>
              <div className="space-y-4">
                {newsUpdates.map((update, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-orange-600 text-lg">•</span>
                    <p className="text-gray-800 text-sm">{update}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shape the Future
          </motion.h2>
          <motion.p
            className="text-lg text-orange-100 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join a transformative voting experience. Your voice matters.
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => setVoterLoginOpen(true)}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium text-sm hover:bg-orange-50 transition shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <Link
              to="/about"
              className="bg-orange-800 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-orange-900 transition shadow-md"
            >
              Our Mission
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Voter Login Modal */}
      <AnimatePresence>
        {isVoterLoginOpen && (
          <motion.div
            className="fixed inset-0 glassmorphic-bg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setVoterLoginOpen(false)}
          >
            <motion.div
              className="glassmorphic rounded-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Voter Portal</h3>
                <motion.button
                  onClick={() => setVoterLoginOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleNavigate('/login')}
                  className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700 transition shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log In
                </motion.button>
                <motion.button
                  onClick={() => handleNavigate('/signup')}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Register
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Login Modal */}
      <AnimatePresence>
        {isOtherLoginOpen && (
          <motion.div
            className="fixed inset-0 glassmorphic-bg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ overlay: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOtherLoginOpen(false)}
          >
            <motion.div
              className="glassmorphic rounded-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {loginType.charAt(0).toUpperCase() + loginType.slice(1)} Portal
                </h3>
                <motion.button
                  onClick={() => setOtherLoginOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleNavigate(`/${loginType}/login`)}
                  className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700 transition shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log In
                </motion.button>
                <motion.button
                  onClick={() => handleNavigate(`/${loginType}/register`)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Register
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-orange-400 mb-4">VoterSync</h4>
            <p className="text-sm">Building trust in democracy through innovation.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Contact</Link></li>
              <li><Link to="/transparency" className="hover:text-orange-400 transition">Transparency</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Contact</h4>
            <address className="text-sm not-italic">
              Election Commission of India<br />
              Nexus Tower, New Delhi-110001
            </address>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Connect</h4>
            <div className="flex gap-4">
              <motion.a href="#" className="hover:text-orange-400 transition" whileHover={{ scale: 1.2 }}>
                <Facebook size={20} />
              </motion.a>
              <motion.a href="#" className="hover:text-orange-400 transition" whileHover={{ scale: 1.2 }}>
                <Twitter size={20} />
              </motion.a>
              <motion.a href="#" className="hover:text-orange-400 transition" whileHover={{ scale: 1.2 }}>
                <Youtube size={20} />
              </motion.a>
              <motion.a href="#" className="hover:text-orange-400 transition" whileHover={{ scale: 1.2 }}>
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
        <motion.p
          className="text-center text-sm mt-8 opacity-80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          © 2025 Election Commission of India
        </motion.p>
      </footer>
    </div>
  );
}