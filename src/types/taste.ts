export type RecommendedMovie = {
  title: string;
  reason: string;
};

export type RecommendedMovieResult = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  reason: string;
};

export type TasteAnalysis = {
  summary: string;
  keywords: string[];
  recommendedMoods: string[];
  recommendedMovies: RecommendedMovie[];
  recommendedMovieResults: RecommendedMovieResult[];
};

export type TasteAnalysisRequestMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
};

export type TasteAnalysisRequestBody = {
  movies: TasteAnalysisRequestMovie[];
};