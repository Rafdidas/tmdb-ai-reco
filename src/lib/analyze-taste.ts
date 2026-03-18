import 'server-only';
import { openai } from '@/lib/openai';
import { searchMovieOne } from '@/lib/movie';
import type {
  TasteAnalysis,
  TasteAnalysisRequestMovie,
  RecommendedMovieResult,
} from '@/types/taste';

function buildMoviePrompt(movies: TasteAnalysisRequestMovie[]) {
  return movies
    .map((movie, index) => {
      return [
        `${index + 1}. 제목: ${movie.title}`,
        `개봉일: ${movie.release_date || '미정'}`,
        `평점: ${movie.vote_average}`,
        `줄거리: ${movie.overview || '줄거리 없음'}`,
      ].join('\n');
    })
    .join('\n\n');
}

async function resolveRecommendedMovies(
  recommendedMovies: TasteAnalysis['recommendedMovies']
): Promise<RecommendedMovieResult[]> {
  const results = await Promise.all(
    recommendedMovies.map(async (movie) => {
      const matchedMovie = await searchMovieOne(movie.title);

      if (!matchedMovie) {
        return null;
      }

      return {
        id: matchedMovie.id,
        title: matchedMovie.title,
        poster_path: matchedMovie.poster_path,
        release_date: matchedMovie.release_date,
        vote_average: matchedMovie.vote_average,
        reason: movie.reason,
      };
    })
  );

  return results.filter(
    (movie): movie is RecommendedMovieResult => movie !== null
  );
}

export async function analyzeTaste(
  movies: TasteAnalysisRequestMovie[]
): Promise<TasteAnalysis> {
  const movieText = buildMoviePrompt(movies);

  const response = await openai.responses.create({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'developer',
        content: [
          {
            type: 'input_text',
            text: [
              '당신은 영화 취향 분석가입니다.',
              '사용자가 고른 영화 목록을 바탕으로 취향을 분석하세요.',
              '응답은 반드시 지정된 JSON 스키마에 맞춰야 합니다.',
              '한국어로 작성하세요.',
              '과장하지 말고, 영화 목록에서 합리적으로 추론 가능한 내용만 작성하세요.',
              '추천 영화는 이미 사용자가 고른 영화와 너무 똑같은 제목이 아니라, 비슷한 취향의 다른 영화로 제안하세요.',
              '추천 영화 제목은 실제 잘 알려진 영화 제목 위주로 제안하세요.',
              '추천 영화는 3개 이하로 제한하세요.',
            ].join(' '),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `다음 영화 목록을 바탕으로 취향을 분석해줘.\n\n${movieText}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'taste_analysis',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            summary: {
              type: 'string',
            },
            keywords: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            recommendedMoods: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            recommendedMovies: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  title: {
                    type: 'string',
                  },
                  reason: {
                    type: 'string',
                  },
                },
                required: ['title', 'reason'],
              },
            },
          },
          required: [
            'summary',
            'keywords',
            'recommendedMoods',
            'recommendedMovies',
          ],
        },
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error('AI 분석 결과가 비어 있습니다.');
  }

  const parsed = JSON.parse(outputText) as Omit<
    TasteAnalysis,
    'recommendedMovieResults'
  >;

  const recommendedMovieResults = await resolveRecommendedMovies(
    parsed.recommendedMovies
  );

  return {
    ...parsed,
    recommendedMovieResults,
  };
}