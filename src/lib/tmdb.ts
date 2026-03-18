import 'server-only';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

if (!TMDB_BASE_URL) {
  throw new Error('TMDB_BASE_URL 환경변수가 없습니다.');
}

if (!TMDB_BEARER_TOKEN) {
  throw new Error('TMDB_BEARER_TOKEN 환경변수가 없습니다.');
}

type TmdbRequestParams = Record<string, string | number | boolean | undefined>;

function buildQueryString(params?: TmdbRequestParams) {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function tmdbFetch<T>(
  path: string,
  params?: TmdbRequestParams
): Promise<T> {
  const queryString = buildQueryString(params);
  const url = `${TMDB_BASE_URL}${path}${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
      Accept: 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB 요청에 실패했습니다. status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}