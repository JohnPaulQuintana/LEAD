import { useEffect, useState } from "react";
import { fetchPlaces } from "../services/api";
import ListingCard from "../components/ListingCard";
import { useNavigate } from "react-router-dom";
import { type Place } from "../types/place";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiMapPin,
  FiTrendingUp,
  FiStar,
  FiCompass,
} from "react-icons/fi";
import { useSearch } from "../context/searchContext";
export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const { debouncedQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    setPlaces([]);
    setNextPageToken(null);

    const query = debouncedQuery?.trim() ? debouncedQuery : "real estate";

    loadPlaces(undefined, query, activeFilter);
  }, [debouncedQuery, activeFilter]);

  
  const loadPlaces = async (
    page?: string,
    search?: string,
    filter?: string,
  ) => {
    setLoading(true);

    try {
      const params: any = {
        page,
        q: search,
      };

      // 🎯 CONNECT FILTERS TO BACKEND
      if (filter === "top-rated") {
        params.minRating = 4.5;
      }

      if (filter === "trending") {
        params.limit = 10;
      }

      if (filter === "leads") {
        params.mode = "leads_only";
      }

      const data = await fetchPlaces(params);

      const results = data?.results ?? [];

      setPlaces((prev) => (page ? [...prev, ...results] : results));
      setNextPageToken(data?.nextPageToken ?? null);
    } catch (error) {
      console.error("Failed to load places:", error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-8 mb-8"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
  {/* Badge */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.2, type: "spring" }}
    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-4"
  >
    <FiCompass className="text-white" />
    <span className="text-white text-sm font-medium">
      Discover places nearby
    </span>
  </motion.div>

  {/* Title */}
  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
    Find places instantly
  </h1>

  {/* Subtitle (shortened) */}
  <p className="text-white/90 text-sm md:text-lg max-w-2xl">
    Search restaurants, hotels, shops, and attractions with real ratings and details.
  </p>

  {/* Feature chips (hidden on mobile) */}
  <div className="hidden md:flex flex-wrap gap-2 mt-4 text-sm text-white/90">
    <span className="bg-white/10 px-3 py-1 rounded-full">
      Ratings & reviews
    </span>
    <span className="bg-white/10 px-3 py-1 rounded-full">
      Directions
    </span>
    <span className="bg-white/10 px-3 py-1 rounded-full">
      Nearby search
    </span>
  </div>
</div>
      </motion.div>

      {/* FILTERS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-800/50"
      >
        <FilterChip
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          icon={<FiMapPin />}
          label="All Places"
        />
        <FilterChip
          active={activeFilter === "trending"}
          onClick={() => setActiveFilter("trending")}
          icon={<FiTrendingUp />}
          label="Trending"
        />
        <FilterChip
          active={activeFilter === "top-rated"}
          onClick={() => setActiveFilter("top-rated")}
          icon={<FiStar />}
          label="Top Rated"
        />
        <FilterChip
          active={activeFilter === "leads"}
          onClick={() => setActiveFilter("leads")}
          icon={<FiTrendingUp />}
          label="High Value Leads"
        />
      </motion.div>

      {/* RESULTS COUNT */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
        >
          {places.length} places found
        </motion.div>

        {loading && places.length === 0 && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FiLoader className="text-emerald-600 dark:text-emerald-400" />
          </motion.div>
        )}
      </div>

      {/* GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {places.map((place) => (
            <motion.div
              key={place.place_id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <ListingCard
                place={place}
                onClick={() => navigate(`/details/${place.place_id}`)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* EMPTY STATE */}
      {!loading && places.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <FiMapPin className="text-emerald-600 dark:text-emerald-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No places found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* LOAD MORE */}
      <AnimatePresence>
        {nextPageToken && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center pt-4 pb-8"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              disabled={loading}
              onClick={() =>
                loadPlaces(nextPageToken, debouncedQuery, activeFilter)
              }
              className="
                relative group
                flex items-center gap-3
                px-8 py-3 rounded-full
                bg-gradient-to-r from-emerald-600 to-green-600
                text-white font-semibold
                shadow-lg hover:shadow-xl
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Loading more...
                  </>
                ) : (
                  <>
                    <FiCompass />
                    Load More Places
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING SKELETON */}
      {loading && places.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
            <FiLoader className="animate-spin text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Loading more...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Filter Chip Component
const FilterChip = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      transition-all duration-300
      ${
        active
          ? "bg-emerald-600 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 border border-emerald-200 dark:border-emerald-800"
      }
    `}
  >
    {icon}
    {label}
  </motion.button>
);
