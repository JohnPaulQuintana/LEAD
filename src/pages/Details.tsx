import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlaceDetails } from "../services/api";
import { type Place } from "../types/place";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiStar,
  FiGlobe,
  FiPhone,
  FiClock,
  FiChevronLeft,
  FiShare2,
  FiHeart,
  FiNavigation,
  FiThumbsUp,
  FiUsers,
  FiAward,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";

export default function Details() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const API_BASE = import.meta.env.VITE_API_BASE;

  //   const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!placeId) return;

    fetchPlaceDetails(placeId).then((data) => {
      console.log(data);
      setPlace(data);
      setLoading(false);
    });
  }, [placeId]);

  const formatRating = (rating?: number | null) => {
  if (rating === null || rating === undefined) return "New";
  return Number(rating).toFixed(1);
};

  // Generate mock images (in real app, these would be from API)
  const images = [
    place?.photo,
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=400&fit=crop",
  ].filter(Boolean);

  const getRatingColor = (rating?: number) => {
    if (rating === null || rating === undefined) return "text-emerald-600";
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 4.0) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-orange-600";
  };

  const getRatingStars = (rating?: number) => {
    if (rating === null || rating === undefined) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`text-sm ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">
            Loading place details...
          </p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Place Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The place you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-12"
    >
      {/* BACK BUTTON */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <FiChevronLeft className="text-emerald-600 dark:text-emerald-400 text-xl" />
      </motion.button>

      {/* SHARE & LIKE BUTTONS */}
      <div className="fixed top-24 right-4 z-20 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiHeart
            className={`text-xl transition-colors duration-200 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: place.name,
                text: place.address,
                url: window.location.href,
              });
            }
          }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiShare2 className="text-gray-600 dark:text-gray-400 text-xl" />
        </motion.button>
      </div>

      {/* HERO IMAGE SECTION */}
      <div className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-emerald-900 to-green-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={
              images[activeImage] ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"
            }
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* IMAGE NAVIGATION DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeImage === idx
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* TITLE OVERLAY */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-500 rounded-full px-3 py-1 text-xs font-semibold">
                ₱
              </div>
              {place.rating !== null && place.rating !== undefined && (
                <div className="bg-yellow-500 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                  <FiStar className="fill-current" />
                  {place.rating.toFixed(1)}
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {place.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <FiMapPin />
              <span>{place.address}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* QUICK ACTIONS */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton
                  icon={<FiNavigation />}
                  label="Directions"
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${place.address}`)
                  }
                />
                {place.phone && (
                  <QuickActionButton
                    icon={<FiPhone />}
                    label="Call"
                    onClick={() =>
                      (window.location.href = `tel:${place.phone}`)
                    }
                  />
                )}
                {place.website && (
                  <QuickActionButton
                    icon={<FiGlobe />}
                    label="Website"
                    onClick={() => window.open(place.website)}
                  />
                )}
                <QuickActionButton
                  icon={<FiClock />}
                  label="Hours"
                  onClick={() => {}}
                />
              </div>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {place.description ||
                  `${place.name} is a popular destination located in ${place.address}. 
                  This place offers excellent services and amenities for visitors. 
                  Known for its quality and customer satisfaction, it's a must-visit 
                  spot in the area.`}
              </p>
            </motion.div>

            {/* AMENITIES */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {mockDetails.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <FiCheckCircle className="text-emerald-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div> */}

            {/* REVIEWS */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Reviews
                </h2>
                <button className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">
                  See all →
                </button>
              </div>

              <div className="space-y-4">
                {place.reviews?.map((review, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                          {review.profile_photo ? (
                            <img
                              src={`${API_BASE}/proxy/image-proxy?url=${encodeURIComponent(
                                review.profile_photo,
                              )}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiUsers className="text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {review.author}
                          </p>
                          <p className="text-xs text-gray-400">{review.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FiStar className="fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatRating(review.rating)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* INFO CARD */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Information
              </h3>

              <div className="space-y-3">
                {place.phone && (
                  <InfoRow
                    icon={<FiPhone />}
                    label="Phone"
                    value={place.phone}
                  />
                )}

                {/* HOURS BADGE */}
                {place.opening_hours && (
                  <div className="flex items-start gap-3">
                    <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <FiClock />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hours
                      </p>

                      {/* STATUS BADGE */}
                      <div
                        className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold mt-1
                        ${
                          place.opening_hours.open_now
                            ? "bg-green-500 text-white dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-500 text-white dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {place.opening_hours.open_now ? "Open now" : "Closed"}
                      </div>

                      {/* TODAY FULL BADGE */}
                      {place.opening_hours?.weekday_text?.map(
                        (day: string, i: number) => {
                          const todayName = new Date()
                            .toLocaleString("en-US", { weekday: "long" })
                            .toLowerCase();

                          const [dayName] = day.split(":");
                          const isToday = dayName.toLowerCase() === todayName;

                          if (!isToday) return null;

                          return (
                            <span
                              key={i}
                              className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      bg-green-500 text-white border border-blue-300
      dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                            >
                              {day}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {place.rating !== null && place.rating !== undefined && (
                  <div className="flex items-start gap-3">
                    <div className={`${getRatingColor(place.rating)} mt-0.5`}>
                      <FiThumbsUp />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rating
                      </p>

                      <div className="flex items-center gap-2">
                        {getRatingStars(place.rating)}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatRating(place.rating)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* WEBSITE BUTTON */}
              {place.website && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <FiExternalLink />
                  Visit Website
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick Action Button Component
const QuickActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-200"
  >
    <div className="text-emerald-600 dark:text-emerald-400 text-xl">{icon}</div>
    <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
  </motion.button>
);

// Info Row Component
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-gray-800 dark:text-gray-200 font-medium">{value}</p>
    </div>
  </div>
);
