export type TmdbImageSize = 'w500' | 'w780' | 'w1280' | 'original';

export function getTmdbImageUrl(
  path: string,
  size: TmdbImageSize = 'w500'
) {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}