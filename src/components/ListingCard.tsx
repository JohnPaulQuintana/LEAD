import { motion } from "framer-motion";
import {
  FiStar,
  FiMapPin,
  FiHeart,
//   FiShare2,
  FiTrendingUp,
  FiCoffee,
  FiHome,
  FiShoppingBag,
  FiCamera,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";
import { useState } from "react";
import { type Place } from "../types/place";

export default function ListingCard({
  place,
  onClick,
}: {
  place: Place;
  onClick: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!place) return null;

  const getTypeIcon = (type?: string) => {
    if (!type) return <FiMapPin />;
    const t = type.toLowerCase();

    if (t.includes("restaurant") || t.includes("cafe")) return <FiCoffee />;
    if (t.includes("real estate") || t.includes("home")) return <FiHome />;
    if (t.includes("shop") || t.includes("store")) return <FiShoppingBag />;
    if (t.includes("tourist")) return <FiCamera />;
    return <FiMapPin />;
  };

  const formatRating = (rating?: number) =>
    rating ? rating.toFixed(1) : "New";

  const getRatingColor = (rating?: number) => {
    if (rating === null || rating === undefined) return "text-emerald-600";
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 4.0) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-orange-600";
  };
  

  const isLead = place.lead_quality === "high" || place.lead_quality === "medium";

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="
        relative w-full
        bg-white dark:bg-gray-800
        rounded-2xl
        overflow-hidden
        border border-emerald-100 dark:border-emerald-800/40
        shadow-md hover:shadow-xl
        transition-all duration-300
        cursor-pointer
      "
    >
      {/* IMAGE */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <img
          src={
            place.photo ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500"
          }
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          <div className="bg-white/90 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {getTypeIcon(place.types?.[0])}
            <span className="truncate max-w-[80px]">
              {place.types?.[0] || "Place"}
            </span>
          </div>

          {(place.rating ?? 0) >= 4.5 && (
            <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <FiTrendingUp />
              Hot
            </div>
          )}

          {isLead && (
            <div
              className={`px-2 py-1 rounded-full text-xs text-white font-bold ${
                place.lead_quality === "high"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {place.lead_quality.toUpperCase()}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="bg-white/90 p-2 rounded-full"
          >
            <FiHeart
              className={
                isLiked ? "text-red-500 fill-red-500" : "text-gray-600"
              }
            />
          </button>

          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.share?.({
                title: place.name,
                url: window.location.href,
              });
            }}
            className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100"
          >
            <FiShare2 />
          </button> */}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* NAME */}
        <h2 className="font-bold text-base sm:text-lg line-clamp-1">
          {place.name}
        </h2>

        {/* ADDRESS */}
        <div className="flex gap-2 text-sm text-gray-500">
          <FiMapPin className="mt-1 flex-shrink-0" />
          <span className="line-clamp-2">{place.address}</span>
        </div>

        {/* LEAD INFO (IMPORTANT PART) */}
        {(place.website || place.phone) && (
          <div className="flex gap-3 text-xs text-emerald-600 pt-1">
            {place.website && (
              <span className="flex items-center gap-1">
                <FiGlobe /> Web
              </span>
            )}
            {place.phone && (
              <span className="flex items-center gap-1">
                <FiPhone /> Call
              </span>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className={`flex items-center gap-1 ${getRatingColor(place.rating)}`}>
            <FiStar />
            <span className="font-semibold text-sm">
              {formatRating(place.rating)}
            </span>
          </div>

          <span className="text-xs text-emerald-600 font-medium">
            View →
          </span>
        </div>
      </div>

      {/* BORDER ANIMATION */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"
        animate={{ scaleX: isHovered ? 1 : 0 }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}