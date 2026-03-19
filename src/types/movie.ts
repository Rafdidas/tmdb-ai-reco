export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type PopularMoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type MovieGenre = {
  id: number;
  name: string;
};

export type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type MovieCollection = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type MovieCast = {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  cast_id?: number;
  order: number;
  popularity: number;
};

export type MovieCrew = {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
};

export type MovieVideo = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
};

export type MovieKeyword = {
  id: number;
  name: string;
};

export type ReleaseDateItem = {
  certification: string;
  descriptors: string[];
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
};

export type ReleaseDateResult = {
  iso_3166_1: string;
  release_dates: ReleaseDateItem[];
};

export type WatchProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type WatchProviderRegion = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
};

export type MovieDetail = {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: MovieCollection | null;
  budget: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  homepage: string | null;
  imdb_id: string | null;
  poster_path: string | null;
  origin_country: string[];
  popularity: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  vote_average: number;
  vote_count: number;
  status: string;
  tagline: string;
  video: boolean;
  runtime: number | null;
  genres: MovieGenre[];
  spoken_languages: SpokenLanguage[];
  credits: {
    cast: MovieCast[];
    crew: MovieCrew[];
  };
  keywords: {
    keywords: MovieKeyword[];
  };
  videos: {
    results: MovieVideo[];
  };
  release_dates: {
    results: ReleaseDateResult[];
  };
  "watch/providers": {
    results: Record<string, WatchProviderRegion>;
  };
  recommendations: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  similar: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
};
