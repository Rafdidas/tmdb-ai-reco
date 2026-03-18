import { tmdbFetch } from '@/lib/tmdb';
import type { PopularMoviesResponse } from '@/types/movie';

export async function GET() {
  try {
    const data = await tmdbFetch<PopularMoviesResponse>('/movie/popular', {
      language: 'ko-KR',
      page: 1,
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: '인기 영화 데이터를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}