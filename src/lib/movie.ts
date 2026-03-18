import { tmdbFetch } from '@/lib/tmdb';
import type { MovieDetail, PopularMoviesResponse } from '@/types/movie';

export async function getPopularMovies(page = 1) {
  return tmdbFetch<PopularMoviesResponse>('/movie/popular', {
    language: 'ko-KR',
    page,
  });
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<PopularMoviesResponse>('/search/movie', {
    language: 'ko-KR',
    query,
    page,
    include_adult: false,
  });
}

export async function searchMovieOne(query: string) {
  const data = await tmdbFetch<PopularMoviesResponse>('/search/movie', {
    language: 'ko-KR',
    query,
    page: 1,
    include_adult: false,
  });

  return data.results[0] ?? null;
}

export async function getMovieDetail(movieId: number) {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`, {
    language: 'ko-KR',
  });
}