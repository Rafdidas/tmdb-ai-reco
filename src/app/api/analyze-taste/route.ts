import { analyzeTaste } from '@/lib/analyze-taste';
import type { TasteAnalysisRequestBody } from '@/types/taste';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TasteAnalysisRequestBody;
    const movies = body.movies ?? [];

    if (!Array.isArray(movies) || movies.length === 0) {
      return Response.json(
        { message: '분석할 영화가 없습니다.' },
        { status: 400 }
      );
    }

    if (movies.length > 5) {
      return Response.json(
        { message: '영화는 최대 5개까지만 분석할 수 있습니다.' },
        { status: 400 }
      );
    }

    const result = await analyzeTaste(movies);

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: 'AI 취향 분석에 실패했습니다.' },
      { status: 500 }
    );
  }
}