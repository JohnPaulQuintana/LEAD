import axios from "axios";
import type { Place } from "../types/place";

const API_BASE = import.meta.env.VITE_API_BASE;

export type PlacesResponse = {
  results: Place[];
  nextPageToken: string | null;
  hasMore: boolean;
};

export const fetchPlaces = async (params?: {
  q?: string;
  page?: string;
  minRating?: number;
  openNow?: boolean;
}) => {
  const res = await axios.get<PlacesResponse>(`${API_BASE}/places`, {
    params,
  });

  return res.data;
};

export const fetchPlaceDetails = async (placeId: string): Promise<Place> => {
  const res = await axios.get<{ result: Place }>(
    `${API_BASE}/place/${placeId}`
  );

  return res.data.result;
};