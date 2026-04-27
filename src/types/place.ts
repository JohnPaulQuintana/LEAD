type OpeningHours = {
  open_now: boolean;
  weekday_text?: string[];
};

export type Place = {
  lead_quality: string;
  opening_hours?: OpeningHours;
  description: string;
  types: any;
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  website?: string;
  phone?: string;
  photo?: string;

  location?: {
    lat: number;
    lng: number;
  };

  reviews?: {
    author: string;
    rating: number;
    text: string;
    time: string;
    profile_photo?: string;
  }[];
};