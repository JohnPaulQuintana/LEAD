import { createContext, useContext, useEffect, useState } from "react";

type SearchContextType = {
  query: string;
  setQuery: (v: string) => void;
  debouncedQuery: string;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, debouncedQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
};