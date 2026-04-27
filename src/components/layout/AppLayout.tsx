import { type ReactNode, useState } from "react";
import {
  FiSearch,
  FiMapPin,
  FiCompass,
  FiHeart,
  FiUser,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSearch } from "../../context/searchContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch(); // ✅ USE CONTEXT ONLY

  const [isDark, setIsDark] = useState(false);

  const gradientClass = isDark
    ? "from-gray-900 via-emerald-950 to-gray-900"
    : "from-emerald-50 via-white to-green-50";

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br ${gradientClass}`}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-3">
            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FiMapPin className="text-emerald-600 text-2xl" />
              <span className="font-bold text-lg md:text-xl">PlaceFinder</span>
            </div>

            {/* NAV (desktop only) */}
            <div className="hidden md:flex items-center gap-2">
              <NavButton icon={<FiCompass />} onClick={() => navigate("/")} />
              <NavButton icon={<FiHeart />} onClick={() => navigate("/")} />
              <NavButton icon={<FiUser />} onClick={() => navigate("/")} />

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>

          {/* SEARCH ROW */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full pl-12 pr-4 py-2 md:py-3 outline-none"
              />
            </div>

            {/* MOBILE THEME BUTTON */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="md:hidden p-3 rounded-full border border-gray-200 dark:border-gray-700"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          {/* MOBILE NAV ROW */}
          <div className="flex md:hidden justify-between mt-3">
            <NavButton icon={<FiCompass />} onClick={() => navigate("/")} />
            <NavButton icon={<FiHeart />} onClick={() => navigate("/")} />
            <NavButton icon={<FiUser />} onClick={() => navigate("/")} />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children} {/* ❌ NO cloneElement */}
      </main>
    </div>
  );
}

/* BUTTON */
const NavButton = ({
  icon,
  onClick,
}: {
  icon: ReactNode;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 rounded-full"
  >
    {icon}
  </motion.button>
);
